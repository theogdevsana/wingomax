import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateAdminToken } from '@/lib/jwt';
import { query } from '@/lib/db';
import { validateLoginCredentials, sanitizeInput } from '@/lib/security';
import { adminLoginLimiter } from '@/lib/rate-limiter';
import crypto from 'crypto';

const DEFAULT_USERNAME = 'wingobot';
const DEFAULT_PASSWORD_HASH = crypto.createHash('sha256').update('sanam#0909').digest('hex');

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
    cookieOptions.domain = '.wingosignals.com';
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

    const result = await query('SELECT * FROM admins WHERE username = $1', [sanitizedUsername]);
    const admin = result.rows[0];

    if (admin) {
      if (admin.password_hash === password) {
        const token = generateAdminToken({ username: admin.username, role: 'admin' });
        adminLoginLimiter.reset(ip);
        return setTokenAndRespond(token);
      }
    } else {
      const countResult = await query('SELECT COUNT(*)::int AS count FROM admins');
      if (countResult.rows[0].count === 0 && username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD_HASH) {
        await query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [DEFAULT_USERNAME, DEFAULT_PASSWORD_HASH]);
        const token = generateAdminToken({ username: DEFAULT_USERNAME, role: 'admin' });
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
