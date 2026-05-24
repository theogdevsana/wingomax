import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';
import { isSetupAccessCookie } from '@/lib/setup-access';

async function requireSetupAccess() {
  const cookieStore = await cookies();
  const setupCookie = cookieStore.get('setup_access')?.value;
  if (!isSetupAccessCookie(setupCookie)) {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await requireSetupAccess())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const admins = await Admin.find({}, 'username createdAt')
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    admins: admins.map((a) => ({
      id: String(a._id),
      username: a.username,
      createdAt: a.createdAt,
    })),
  });
}

export async function DELETE(req: Request) {
  if (!(await requireSetupAccess())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { status: 'error', msg: 'Admin id is required' },
      { status: 400 }
    );
  }

  await connectToDatabase();
  const deleted = await Admin.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { status: 'error', msg: 'Admin not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: 'success',
    msg: 'Admin deleted successfully',
  });
}
