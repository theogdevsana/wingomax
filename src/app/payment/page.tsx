import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import PaymentClient from './PaymentClient';

export const metadata: Metadata = {
  title: 'Secure payment | Wingo Signal',
  description: 'Complete your selected Wingo Signal access plan using the payment QR code.',
  robots: { index: false, follow: false },
};

export default async function PaymentPage() {
  const cookieStore = await cookies();
  return <PaymentClient planId={cookieStore.get('checkout_plan')?.value ?? null} />;
}
