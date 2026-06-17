import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateAdminToken } from '@/lib/jwt';
import { query } from '@/lib/db';
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
    maxAge: 24 * 60 * 60
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
    if (!adminLoginLimiter.isAllowed(ip)) {
      return NextResponse.json(
        { status: 'error', msg: 'Too many login attempts. Please try again later.', retryAfter: adminLoginLimiter.getResetTime(ip) },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    const validation = validateLoginCredentials(username, password);
    if (!validation.valid) {
      return NextResponse.json({ status: 'error', msg: validation.errors[0] || 'Invalid credentials' }, { status: 400 });
    }

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = password;

    const result = await query('SELECT * FROM admins WHERE username = $1', [sanitizedUsername]);
    const admin = result.rows[0];

    if (admin) {
      const hash = crypto.createHash('sha256').update(sanitizedPassword).digest('hex');

      if (admin.password_hash === hash) {
        const token = generateAdminToken({ username: admin.username, role: 'admin' });
        adminLoginLimiter.reset(ip);
        return setTokenAndRespond(token);
      }
    }

    return NextResponse.json({ status: 'error', msg: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
