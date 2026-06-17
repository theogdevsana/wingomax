import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { verifyAdminToken } from '@/lib/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    const result = await query('SELECT * FROM licenses');
    const licenses = result.rows;

    let totalKeys = licenses.length;
    let totalUsed = 0;
    let totalBanned = 0;
    let totalRevenue = 0;
    let weeklyRevenue = 0;
    let monthlyRevenue = 0;
    let lastMonthRevenue = 0;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    licenses.forEach((lic: any) => {
      if (lic.device_id) totalUsed++;
      if (lic.status === 'banned') totalBanned++;

      const durationMs = new Date(lic.expires_at).getTime() - new Date(lic.created_at).getTime();
      const days = Math.round(durationMs / (1000 * 60 * 60 * 24));

      let price = 0;
      if (days <= 7) price = 499;
      else if (days <= 15) price = 1499;
      else price = 1999;

      totalRevenue += price;

      const created = new Date(lic.created_at);
      if (created >= oneWeekAgo) weeklyRevenue += price;
      if (created >= oneMonthAgo) monthlyRevenue += price;
      else if (created >= twoMonthsAgo && created < oneMonthAgo) lastMonthRevenue += price;
    });

    return NextResponse.json({
      status: 'success',
      data: {
        totalKeys, totalUsed, totalBanned,
        revenue: { total: totalRevenue, weekly: weeklyRevenue, monthly: monthlyRevenue, lastMonth: lastMonthRevenue }
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
