import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { isSetupAccessCookie } from '@/lib/setup-access';

async function requireSetupAccess() {
  const cookieStore = await cookies();
  const setupCookie = cookieStore.get('setup_access')?.value;
  if (!isSetupAccessCookie(setupCookie)) return false;
  return true;
}

export async function GET() {
  if (!(await requireSetupAccess())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await query('SELECT id, username, created_at FROM admins ORDER BY created_at DESC');
  return NextResponse.json({
    admins: result.rows.map((a: any) => ({ id: String(a.id), username: a.username, createdAt: a.created_at })),
  });
}

export async function DELETE(req: Request) {
  if (!(await requireSetupAccess())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ status: 'error', msg: 'Admin id is required' }, { status: 400 });
  }

  const admin = await query('SELECT username FROM admins WHERE id = $1', [id]);
  if (admin.rows.length === 0) {
    return NextResponse.json({ status: 'error', msg: 'Admin not found' }, { status: 404 });
  }

  if (admin.rows[0].username === 'wingobot') {
    return NextResponse.json({ status: 'error', msg: 'Cannot delete default admin' }, { status: 400 });
  }

  await query('DELETE FROM admins WHERE id = $1', [id]);
  return NextResponse.json({ status: 'success', msg: 'Admin deleted successfully' });
}
