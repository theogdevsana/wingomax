import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import { validateLicenseLogin } from '@/lib/security';
import { licenseLoginLimiter } from '@/lib/rate-limiter';

export async function GET() {
  return NextResponse.json({ status: 'info', msg: 'WingoSignals API is running. Please use POST for login requests.' });
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  try {
    if (!licenseLoginLimiter.isAllowed(ip)) {
      return NextResponse.json(
        { status: 'error', msg: 'Too many login attempts. Please try again later.', retryAfter: licenseLoginLimiter.getResetTime(ip) },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { key, device_id } = body;

    const validation = validateLicenseLogin(key, device_id);
    if (!validation.valid) {
      return NextResponse.json({ status: 'error', msg: validation.errors[0] || 'Invalid credentials' }, { status: 400 });
    }

    const { sanitized } = validation;

    const result = await query('SELECT * FROM licenses WHERE key = $1', [sanitized.key]);
    const license = result.rows[0];

    if (!license) {
      return NextResponse.json({ status: 'error', msg: 'Invalid License Key' }, { status: 401 });
    }

    const isExpired = license.status === 'expired' || new Date() > new Date(license.expires_at);

    if (isExpired) {
      if (license.status !== 'expired') {
        await query('UPDATE licenses SET status = $1 WHERE id = $2', ['expired', license.id]);
      }
      return NextResponse.json({ status: 'error', code: 'expired', msg: 'Your license key has expired', expires_at: license.expires_at }, { status: 403 });
    }

    if (license.status === 'banned') {
      return NextResponse.json({ status: 'error', code: 'banned', msg: 'This license key has been banned' }, { status: 403 });
    }

    if (license.status !== 'active') {
      return NextResponse.json({ status: 'error', msg: `License is ${license.status}` }, { status: 403 });
    }

    if (!license.device_id) {
      await query('UPDATE licenses SET device_id = $1 WHERE id = $2', [sanitized.device_id, license.id]);
    } else if (license.device_id !== sanitized.device_id) {
      return NextResponse.json({ status: 'error', msg: 'Key is already bound to another device' }, { status: 403 });
    }

    const secondsUntilExpiry = Math.max(60, Math.floor((new Date(license.expires_at).getTime() - Date.now()) / 1000));
    const token = generateToken({
      licenseId: String(license.id),
      deviceId: sanitized.device_id,
      role: 'user'
    }, secondsUntilExpiry);

    const cookieStore = await cookies();
    const cookieOptions: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'lax';
      path: string;
      maxAge: number;
      domain?: string;
    } = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: secondsUntilExpiry
    };

    if (process.env.NODE_ENV === 'production') {
      cookieOptions.domain = '.wingosignals.com';
    }

    cookieStore.set('auth_token', token, cookieOptions);

    licenseLoginLimiter.reset(ip);

    return NextResponse.json({
      status: 'success',
      data: { is_demo: false, game_access: ['all'], expires_at: license.expires_at }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
