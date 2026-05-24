import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getSetupAccessToken,
  verifySetupPassword,
} from '@/lib/setup-access';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || !verifySetupPassword(password)) {
      return NextResponse.json(
        { status: 'error', msg: 'Invalid setup password' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('setup_access', getSetupAccessToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ status: 'success' });
  } catch {
    return NextResponse.json(
      { status: 'error', msg: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
