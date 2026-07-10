import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { getPaymentPlan } from '@/lib/payment-plans';

const GATEWAY_URL = (process.env.AUTOPAY_GATEWAY_URL || 'https://kaelis.sh').replace(/\/$/, '');
const ORDER_TTL_MS = 10 * 60 * 1000;

async function ensureOrdersTable() {
  await query(`CREATE TABLE IF NOT EXISTS payment_orders (
    order_id TEXT PRIMARY KEY,
    plan_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    qr_code_url TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    license_key TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ
  )`);
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const plan = getPaymentPlan(cookieStore.get('checkout_plan')?.value);
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const response = await fetch(`${GATEWAY_URL}/autopay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: plan.amount }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
    const gatewayOrder = await response.json().catch(() => null) as { status?: string; order_id?: string; qr_code_url?: string } | null;

    if (!response.ok || gatewayOrder?.status !== 'success' || !gatewayOrder.order_id || !gatewayOrder.qr_code_url) {
      return NextResponse.json({ error: 'Unable to create a payment order. Please try again.' }, { status: 502 });
    }

    const expiresAt = new Date(Date.now() + ORDER_TTL_MS);
    await ensureOrdersTable();
    await query(
      `INSERT INTO payment_orders (order_id, plan_id, amount, qr_code_url, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (order_id) DO UPDATE SET qr_code_url = EXCLUDED.qr_code_url, expires_at = EXCLUDED.expires_at`,
      [gatewayOrder.order_id, plan.id, plan.amount, gatewayOrder.qr_code_url, expiresAt],
    );

    return NextResponse.json({
      status: 'pending',
      orderId: gatewayOrder.order_id,
      qrCodeUrl: gatewayOrder.qr_code_url,
      expiresAt: expiresAt.toISOString(),
      plan: { id: plan.id, name: plan.name, amount: plan.amount, durationDays: plan.durationDays },
    });
  } catch (error) {
    console.error('Payment order creation failed', error);
    return NextResponse.json({ error: 'Unable to create a payment order. Please try again.' }, { status: 500 });
  }
}
