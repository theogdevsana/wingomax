import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { verifyAdminToken } from '@/lib/jwt';
import crypto from 'crypto';

async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token ? verifyAdminToken(token) : null;
}

export async function POST(req: Request) {
  try {
    const adminData = await getAuthToken();
    if (!adminData) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }
    const createdBy = adminData.username || 'unknown';

    const { durationDays } = await req.json();

    if (!durationDays || typeof durationDays !== 'number') {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
    }

    const key = 'WG-' + crypto.randomBytes(4).toString('hex').toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const result = await query(
      'INSERT INTO licenses (key, expires_at, created_by) VALUES ($1, $2, $3) RETURNING id, key, expires_at',
      [key, expiresAt, createdBy]
    );

    return NextResponse.json({ status: 'success', data: { key: result.rows[0].key, expiresAt: result.rows[0].expires_at, durationDays } });
  } catch (error) {
    console.error('License creation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!(await getAuthToken())) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }
    const result = await query('SELECT * FROM licenses ORDER BY created_at DESC LIMIT 50');
    return NextResponse.json({ status: 'success', data: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!(await getAuthToken())) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }
    const { id, action } = await req.json();

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const licenseResult = await query('SELECT * FROM licenses WHERE id = $1', [id]);
    const license = licenseResult.rows[0];
    if (!license) return NextResponse.json({ error: 'License not found' }, { status: 404 });

    if (action === 'ban') {
      await query('UPDATE licenses SET status = $1 WHERE id = $2', ['banned', id]);
    } else if (action === 'unban') {
      const newStatus = new Date() > new Date(license.expires_at) ? 'expired' : 'active';
      await query('UPDATE licenses SET status = $1 WHERE id = $2', [newStatus, id]);
    } else if (action === 'reset') {
      await query('UPDATE licenses SET device_id = NULL WHERE id = $1', [id]);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await getAuthToken())) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });

    await query('DELETE FROM licenses WHERE id = $1', [id]);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
