import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getPaymentPlan } from '@/lib/payment-plans';

const GATEWAY_URL = (process.env.AUTOPAY_GATEWAY_URL || 'https://kaelis.sh').replace(/\/$/, '');

type StoredOrder = { order_id: string; plan_id: string; status: string; expires_at: string; license_key: string | null };

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (typeof orderId !== 'string' || orderId.length < 3 || orderId.length > 200) {
      return NextResponse.json({ error: 'Invalid order reference' }, { status: 400 });
    }

    const stored = await query('SELECT order_id, plan_id, status, expires_at, license_key FROM payment_orders WHERE order_id = $1', [orderId]);
    const order = stored.rows[0] as StoredOrder | undefined;
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.status === 'paid' && order.license_key) return NextResponse.json({ status: 'paid', licenseKey: order.license_key });
    if (new Date(order.expires_at).getTime() <= Date.now()) {
      await query("UPDATE payment_orders SET status = 'expired' WHERE order_id = $1 AND status = 'pending'", [orderId]);
      return NextResponse.json({ status: 'expired' });
    }
    if (order.status !== 'pending') return NextResponse.json({ status: 'pending' });

    const gatewayResponse = await fetch(`${GATEWAY_URL}/autopay/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId }),
      cache: 'no-store',
      signal: AbortSignal.timeout(12_000),
    });
    const gatewayResult = await gatewayResponse.json().catch(() => null) as { status?: string } | null;
    if (!gatewayResponse.ok || gatewayResult?.status !== 'success') return NextResponse.json({ status: 'pending' });

    const plan = getPaymentPlan(order.plan_id);
    if (!plan) return NextResponse.json({ error: 'Order plan is invalid' }, { status: 500 });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays);
    const licenseKey = `WG-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const claim = await query("UPDATE payment_orders SET status = 'processing' WHERE order_id = $1 AND status = 'pending' RETURNING order_id", [orderId]);
    if (claim.rows.length === 0) {
      const latest = await query('SELECT status, license_key FROM payment_orders WHERE order_id = $1', [orderId]);
      if (latest.rows[0]?.status === 'paid' && latest.rows[0]?.license_key) return NextResponse.json({ status: 'paid', licenseKey: latest.rows[0].license_key });
      return NextResponse.json({ status: 'pending' });
    }

    await query('INSERT INTO licenses (key, expires_at, created_by) VALUES ($1, $2, $3)', [licenseKey, expiresAt, `payment:${orderId}`]);
    await query("UPDATE payment_orders SET status = 'paid', license_key = $2, paid_at = NOW() WHERE order_id = $1", [orderId, licenseKey]);

    return NextResponse.json({ status: 'paid', licenseKey });
  } catch (error) {
    console.error('Payment verification failed', error);
    return NextResponse.json({ error: 'Unable to verify payment right now.' }, { status: 500 });
  }
}
