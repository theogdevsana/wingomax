import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST() {
  try {
    const existing = await query('SELECT COUNT(*)::int AS count FROM admins');
    if (existing.rows[0].count > 0) {
      return NextResponse.json(
        { status: 'error', msg: 'Admins already exist. Seed only works when no admins are present.' },
        { status: 400 }
      );
    }

    const passwordHash = crypto.createHash('sha256').update('sanam#0909').digest('hex');
    await query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', ['wingobot', passwordHash]);

    return NextResponse.json({ status: 'success', msg: 'Default admin created. Username: wingobot' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ status: 'error', msg: 'Internal Server Error' }, { status: 500 });
  }
}
