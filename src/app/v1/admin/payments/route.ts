import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { verifyAdminToken } from '@/lib/jwt';

type PaymentOrder = {
  order_id: string;
  plan_id: string;
  amount: number;
  status: string;
  expires_at: string;
  created_at: string;
  paid_at: string | null;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !verifyAdminToken(token)) return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });

    const table = await query("SELECT to_regclass('public.payment_orders') AS name");
    if (!table.rows[0]?.name) return NextResponse.json({ status: 'success', data: { payments: [], summary: { paid: 0, pending: 0, expired: 0, total: 0 } } });

    const result = await query('SELECT order_id, plan_id, amount, status, expires_at, created_at, paid_at FROM payment_orders ORDER BY created_at DESC LIMIT 100');
    const payments = result.rows as PaymentOrder[];
    const summary = payments.reduce((acc, payment) => {
      acc.total += 1;
      if (payment.status === 'paid') acc.paid += 1;
      if (payment.status === 'pending' || payment.status === 'processing') acc.pending += 1;
      if (payment.status === 'expired') acc.expired += 1;
      return acc;
    }, { paid: 0, pending: 0, expired: 0, total: 0 });

    return NextResponse.json({ status: 'success', data: { payments, summary } });
  } catch (error) {
    console.error('Payment log loading failed', error);
    return NextResponse.json({ error: 'Unable to load payment logs' }, { status: 500 });
  }
}