import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getPaymentPlan } from '@/lib/payment-plans';

export async function POST(request: Request) {
  try {
    const { planId } = await request.json();
    const plan = getPaymentPlan(planId);
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const cookieStore = await cookies();
    cookieStore.set('checkout_plan', plan.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });
    return NextResponse.json({ status: 'success' });
  } catch {
    return NextResponse.json({ error: 'Unable to start checkout' }, { status: 400 });
  }
}
