import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { isSetupAccessCookie } from '@/lib/setup-access';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const setupCookie = cookieStore.get('setup_access')?.value;
    if (!isSetupAccessCookie(setupCookie)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ status: 'error', msg: 'Username and password are required' }, { status: 400 });
    }

    const existing = await query('SELECT id FROM admins WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ status: 'error', msg: 'Username already exists' }, { status: 400 });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    await query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [username, passwordHash]);

    return NextResponse.json({ status: 'success', msg: 'Admin registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
