import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/mongodb';
import License from '@/lib/models/License';
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
    await connectToDatabase();
    
    const { durationDays } = await req.json();
    
    if (!durationDays || typeof durationDays !== 'number') {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
    }

    // Generate a secure random key
    const key = 'WG-' + crypto.randomBytes(4).toString('hex').toUpperCase() + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const license = await License.create({
      key,
      expiresAt,
      createdBy,
    });

    return NextResponse.json({ 
      status: 'success', 
      data: {
        key: license.key,
        expiresAt: license.expiresAt,
        durationDays
      } 
    });

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
    await connectToDatabase();
    const licenses = await License.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ status: 'success', data: licenses });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!(await getAuthToken())) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }
    await connectToDatabase();
    const { id, action } = await req.json();

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const license = await License.findById(id);
    if (!license) return NextResponse.json({ error: 'License not found' }, { status: 404 });

    if (action === 'ban') {
      license.status = 'banned';
    } else if (action === 'unban') {
      // Re-evaluate if it's expired
      if (new Date() > new Date(license.expiresAt)) {
        license.status = 'expired';
      } else {
        license.status = 'active';
      }
    } else if (action === 'reset') {
      license.deviceId = null;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await license.save();
    return NextResponse.json({ status: 'success', data: license });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await getAuthToken())) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });

    await License.findByIdAndDelete(id);
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
