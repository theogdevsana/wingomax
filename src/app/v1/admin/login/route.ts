import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateAdminToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import crypto from 'crypto';
import { validateLoginCredentials, sanitizeInput } from '@/lib/security';
import { adminLoginLimiter } from '@/lib/rate-limiter';

async function setTokenAndRespond(token: string) {
  const cookieStore = await cookies();
  const cookieOptions: any = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 // 24 hours
  };
  
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.domain = '.wingosignals.xyz';
  }
  
  cookieStore.set('admin_token', token, cookieOptions);
  return NextResponse.json({ status: 'success', msg: 'Login successful' });
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  try {
    // Rate limiting check by IP
    if (!adminLoginLimiter.isAllowed(ip)) {
      return NextResponse.json(
        {
          status: 'error',
          msg: 'Too many login attempts. Please try again later.',
          retryAfter: adminLoginLimiter.getResetTime(ip)
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    // Validate and check for injection attempts
    const validation = validateLoginCredentials(username, password);
    if (!validation.valid) {
      return NextResponse.json(
        { status: 'error', msg: validation.errors[0] || 'Invalid credentials' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = password; // Don't sanitize password as it's hashed

    await connectToDatabase();
    
    // Query using sanitized username with regex escape for safety
    const admin = await Admin.findOne({ username: sanitizedUsername });
    
    if (admin) {
      // Hash the password and compare with stored hash
      const hash = crypto.createHash('sha256').update(sanitizedPassword).digest('hex');
      
      if (admin.passwordHash === hash) {
        const token = generateAdminToken({ username: admin.username, role: 'admin' });
        
        // Reset rate limiter on successful login
        adminLoginLimiter.reset(ip);
        
        return setTokenAndRespond(token);
      }
    }

    // Don't reveal whether username exists or not (security best practice)
    return NextResponse.json({ status: 'error', msg: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    // Don't leak error details to client
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
