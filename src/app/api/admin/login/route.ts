import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateAdminToken } from '@/lib/jwt';


export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  try {
    const body = await req.json();
    const { username, password } = body;

    // Verify credentials
    if (username === 'babyxwingo' && password === 'wingoxkilller') {
      const token = generateAdminToken({
        username: 'babyxwingo',
        role: 'admin'
      });

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

    return NextResponse.json({ status: 'error', msg: 'Invalid credentials' }, { status: 401 });


  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
