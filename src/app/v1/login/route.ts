import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import License from '@/lib/models/License';
import { generateToken } from '@/lib/jwt';
import { validateLicenseLogin } from '@/lib/security';
import { licenseLoginLimiter } from '@/lib/rate-limiter';

export async function GET() {
  return NextResponse.json({ status: 'info', msg: 'WingoSignals API is running. Please use POST for login requests.' });
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  try {
    // Rate limiting check
    if (!licenseLoginLimiter.isAllowed(ip)) {
      return NextResponse.json(
        {
          status: 'error',
          msg: 'Too many login attempts. Please try again later.',
          retryAfter: licenseLoginLimiter.getResetTime(ip)
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { key, device_id } = body;

    // 1. Check Payload and validate/sanitize
    const validation = validateLicenseLogin(key, device_id);
    if (!validation.valid) {
      return NextResponse.json(
        {
          status: 'error',
          msg: validation.errors[0] || 'Invalid credentials'
        },
        { status: 400 }
      );
    }

    const { sanitized } = validation;



    await connectToDatabase();

    const license = await License.findOne({ key: sanitized.key });

    if (!license) {
      return NextResponse.json({ status: 'error', msg: 'Invalid License Key' }, { status: 401 });
    }

    const isExpired =
      license.status === 'expired' ||
      new Date() > new Date(license.expiresAt);

    if (isExpired) {
      if (license.status !== 'expired') {
        license.status = 'expired';
        await license.save();
      }
      return NextResponse.json(
        {
          status: 'error',
          code: 'expired',
          msg: 'Your license key has expired',
          expires_at: license.expiresAt,
        },
        { status: 403 }
      );
    }

    if (license.status === 'banned') {
      return NextResponse.json(
        {
          status: 'error',
          code: 'banned',
          msg: 'This license key has been banned',
        },
        { status: 403 }
      );
    }

    if (license.status !== 'active') {
      return NextResponse.json(
        { status: 'error', msg: `License is ${license.status}` },
        { status: 403 }
      );
    }


    // Device binding logic
    if (!license.deviceId) {
      license.deviceId = sanitized.device_id;
      await license.save();
    } else if (license.deviceId !== sanitized.device_id) {
      return NextResponse.json({ status: 'error', msg: 'Key is already bound to another device' }, { status: 403 });
    }


    // 2. Generate Token


    const token = generateToken({
      licenseId: license._id.toString(),
      deviceId: sanitized.device_id,
      role: 'user'
    });

    const cookieStore = await cookies();
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60 
    };

    if (process.env.NODE_ENV === 'production') {
      cookieOptions.domain = '.wingosignals.xyz';
    }

    cookieStore.set('auth_token', token, cookieOptions);

    // Reset rate limiter on successful login
    licenseLoginLimiter.reset(ip);

    return NextResponse.json({
      status: 'success',
      data: {
        is_demo: false,
        game_access: ['all'],
        expires_at: license.expiresAt
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    if (error.name === 'MongooseServerSelectionError') {
      return NextResponse.json({ 
        status: 'error', 
        msg: 'Database Connection Error. Please ensure your IP is whitelisted in MongoDB Atlas.' 
      }, { status: 500 });
    }
    // Don't leak error details to client
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }

}
