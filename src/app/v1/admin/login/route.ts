import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateAdminToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import crypto from 'crypto';

async function setTokenAndRespond(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 // 24 hours
  });
  return NextResponse.json({ status: 'success', msg: 'Login successful' });
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  try {
    const body = await req.json();
    const { username, password } = body;

    await connectToDatabase();
    
    const admin = await Admin.findOne({ username });
    if (admin) {
      const hash = crypto.createHash('sha256').update(password).digest('hex');
      if (admin.passwordHash === hash) {
        const token = generateAdminToken({ username: admin.username, role: 'admin' });
        return setTokenAndRespond(token);
      }
    }

    return NextResponse.json({ status: 'error', msg: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
