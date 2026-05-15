import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import License from '@/lib/models/License';
import { generateToken } from '@/lib/jwt';


export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  try {
    const body = await req.json();
    const { key, device_id } = body;

    // 1. Check Payload
    if (!key || !device_id) {
      return NextResponse.json({ status: 'error', msg: 'Key and Device ID are required' }, { status: 400 });
    }


    await connectToDatabase();

    const license = await License.findOne({ key });

    if (!license) {
      return NextResponse.json({ status: 'error', msg: 'Invalid License Key' }, { status: 401 });
    }


    if (license.status !== 'active') {
      return NextResponse.json({ status: 'error', msg: 'License is ' + license.status }, { status: 403 });
    }


    if (new Date() > new Date(license.expiresAt)) {
      license.status = 'expired';
      await license.save();
      return NextResponse.json({ status: 'error', msg: 'License Key has expired' }, { status: 403 });
    }


    // Device binding logic
    if (!license.deviceId) {
      license.deviceId = device_id;
      await license.save();
    } else if (license.deviceId !== device_id) {
      return NextResponse.json({ status: 'error', msg: 'Key is already bound to another device' }, { status: 403 });
    }


    // 2. Generate Token


    const token = generateToken({
      licenseId: license._id.toString(),
      deviceId: device_id,
      role: 'user'
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60 
    });

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
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }

}
