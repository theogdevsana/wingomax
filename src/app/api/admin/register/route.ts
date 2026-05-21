import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ status: 'error', msg: 'Username and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json({ status: 'error', msg: 'Username already exists' }, { status: 400 });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const newAdmin = await Admin.create({
      username,
      passwordHash,
    });

    return NextResponse.json({ status: 'success', msg: 'Admin registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
