'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function PlanPurchaseButton({ planId }: { planId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId }) });
      if (!response.ok) throw new Error();
      router.push('/payment');
    } catch {
      setLoading(false);
    }
  };

  return <button type="button" onClick={startCheckout} className={styles.planBtn} disabled={loading}>{loading ? 'Preparing payment…' : 'Purchase plan'}</button>;
}
