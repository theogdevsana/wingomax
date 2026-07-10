'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Download, LockKeyhole, QrCode, ReceiptText, ShieldCheck, Wallet } from 'lucide-react';
import { PAYMENT_PLANS, type PaymentPlanId } from '@/lib/payment-plans';
import styles from './payment.module.css';

type PaymentOrder = { orderId: string; qrCodeUrl: string; expiresAt: string; plan: { id: string; name: string; amount: number; durationDays: number } };
type PaymentState = 'loading' | 'pending' | 'expired' | 'success' | 'error';

const storageKey = (planId: string) => `wingo-payment-order:${planId}`;

function getDeviceId() {
  const existing = document.cookie.match(/(^|;)\s*device_id\s*=\s*([^;]+)/)?.[2];
  if (existing) return existing;
  const next = `dev_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  document.cookie = `device_id=${next}; path=/; max-age=315360000; SameSite=Lax`;
  return next;
}

export default function PaymentClient({ planId }: { planId: string | null }) {
  const router = useRouter();
  const plan = planId && planId in PAYMENT_PLANS ? PAYMENT_PLANS[planId as PaymentPlanId] : null;
  const [state, setState] = useState<PaymentState>('loading');
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [message, setMessage] = useState('Preparing your secure QR code…');
  const [licenseKey, setLicenseKey] = useState('');

  const formattedTime = useMemo(() => `${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`, [secondsLeft]);

  const createOrder = useCallback(async () => {
    if (!plan) return;
    setState('loading');
    setMessage('Preparing your secure QR code…');
    try {
      const response = await fetch('/api/payments/order', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create an order');
      const nextOrder = { orderId: data.orderId, qrCodeUrl: data.qrCodeUrl, expiresAt: data.expiresAt, plan: data.plan } as PaymentOrder;
      sessionStorage.setItem(storageKey(plan.id), JSON.stringify(nextOrder));
      setOrder(nextOrder);
      setState('pending');
      setMessage('Waiting for payment confirmation…');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Could not create an order');
    }
  }, [plan]);

  useEffect(() => {
    if (!plan) { router.replace('/subscribe'); return; }
    let timeoutId: number | undefined;
    const saved = sessionStorage.getItem(storageKey(plan.id));
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as PaymentOrder;
        if (new Date(parsed.expiresAt).getTime() > Date.now()) {
          timeoutId = window.setTimeout(() => { setOrder(parsed); setState('pending'); setMessage('Waiting for payment confirmation…'); }, 0);
          return () => { if (timeoutId) window.clearTimeout(timeoutId); };
        }
        sessionStorage.removeItem(storageKey(plan.id));
      } catch { sessionStorage.removeItem(storageKey(plan.id)); }
    }
    timeoutId = window.setTimeout(() => void createOrder(), 0);
    return () => { if (timeoutId) window.clearTimeout(timeoutId); };
  }, [createOrder, plan, router]);

  useEffect(() => {
    if (!order || state !== 'pending') return;
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((new Date(order.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(seconds);
      if (!seconds) { setState('expired'); sessionStorage.removeItem(storageKey(order.plan.id)); }
    };
    tick();
    const interval = window.setInterval(tick, 1_000);
    return () => window.clearInterval(interval);
  }, [order, state]);

  const activateAccess = useCallback(async (key: string) => {
    localStorage.setItem('login_key', key);
    try {
      await fetch('/v1/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ key, device_id: getDeviceId() }) });
    } catch { /* The key remains available for normal sign-in if the network is interrupted. */ }
  }, []);

  const verifyOrder = useCallback(async () => {
    if (!order || state !== 'pending') return;
    try {
      const response = await fetch('/api/payments/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.orderId }) });
      const data = await response.json();
      if (data.status === 'paid' && data.licenseKey) {
        await activateAccess(data.licenseKey);
        setLicenseKey(data.licenseKey);
        setState('success');
        sessionStorage.removeItem(storageKey(order.plan.id));
      } else if (data.status === 'expired') {
        setState('expired');
        sessionStorage.removeItem(storageKey(order.plan.id));
      }
    } catch { /* polling will retry */ }
  }, [activateAccess, order, state]);

  const downloadQr = useCallback(async () => {
    if (!order) return;
    try {
      const response = await fetch(`/api/payments/qr?orderId=${encodeURIComponent(order.orderId)}`);
      if (!response.ok) throw new Error('QR image unavailable');
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      const image = new window.Image();
      image.onload = () => {
        const padding = 20;
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth + padding * 2;
        canvas.height = image.naturalHeight + padding * 2;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, padding, padding);
        canvas.toBlob((png) => {
          if (!png) return;
          const downloadUrl = URL.createObjectURL(png);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `wingo-payment-${order.orderId}.png`;
          link.click();
          URL.revokeObjectURL(downloadUrl);
        }, 'image/png');
        URL.revokeObjectURL(imageUrl);
      };
      image.src = imageUrl;
    } catch {
      setMessage('QR download is unavailable. Please retry in a moment.');
    }
  }, [order]);

  useEffect(() => {
    if (state !== 'pending') return;
    const initial = window.setTimeout(() => void verifyOrder(), 0);
    const interval = window.setInterval(() => void verifyOrder(), 3_000);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); };
  }, [state, verifyOrder]);

  if (!plan) return null;

  if (state === 'success') return <main className={styles.shell}><section className={styles.gateway}><header className={styles.brand}><Link href="/dashboard" className={styles.iconBack} aria-label="Open dashboard"><ArrowLeft size={18} /></Link><div className={styles.brandName}><span className={styles.brandMark}>W</span><strong>Wingo Signal</strong></div><span className={styles.secure}><ShieldCheck size={15} />Secure</span></header><div className={styles.successPanel}><div className={styles.successIcon}><CheckCircle2 size={42} /></div><p className={styles.eyebrow}>Payment verified</p><h1>Payment successful</h1><p className={styles.copy}>Your {plan.name} access is active and ready to use.</p><section className={styles.receipt}><div className={styles.receiptAmount}><small>Amount paid</small><strong>₹{plan.amount}</strong><span><CheckCircle2 size={14} />Paid successfully</span></div><div className={styles.details}><span><Wallet size={16} />Selected plan</span><strong>{plan.name}</strong><span><CalendarDays size={16} />Access period</span><strong>{plan.durationDays} days</strong><span><ReceiptText size={16} />License key</span><strong className={styles.key}>{licenseKey}</strong></div></section><div className={styles.successSecure}><ShieldCheck size={20} /><span>Access has been saved securely to this device.</span></div><Link href="/dashboard" className={styles.primary}>Open dashboard</Link></div></section></main>;

  return <main className={styles.shell}><section className={styles.gateway}>
    <header className={styles.brand}><Link href="/subscribe" className={styles.iconBack} aria-label="Back to plans"><ArrowLeft size={18} /></Link><div className={styles.brandName}><span className={styles.brandMark}>W</span><strong>Wingo Signal</strong></div><span className={styles.secure}><LockKeyhole size={14} />Secure</span></header>
    <div className={styles.paymentPanel}>
      <div className={styles.paymentIntro}><div><h1>{state === 'expired' ? 'Order expired' : 'Complete payment'}</h1><p>{state === 'expired' ? 'Create a new QR code to continue.' : 'Scan the QR code to complete your selected plan.'}</p></div><span><ShieldCheck size={15} />Protected</span></div>
      <section className={styles.payAmountCard}><div><small>Amount to pay</small><strong>₹{plan.amount}</strong><p>Payment is linked to your selected plan.</p></div><div className={styles.amountPlan}><span><ShieldCheck size={13} />Secure order</span><em>{plan.name}</em><small>{plan.durationDays} days access</small></div></section>
      <h2 className={styles.chooseTitle}>Payment method</h2><section className={styles.methodCard}><QrCode size={18} /><div><strong>QR payment</strong><small>Scan with your preferred scanner</small></div><span>Selected</span></section>
      <section className={styles.scanCard}><div className={styles.scanHeader}><div><h2>Scan and pay</h2><span /></div>{state === 'pending' && <button type="button" className={styles.downloadIcon} onClick={() => void downloadQr()} aria-label="Download QR image"><Download size={17} /></button>}</div>
        {state === 'pending' && order && <><div className={styles.qrFrame}><Image src={order.qrCodeUrl} alt={`Payment QR code for order ${order.orderId}`} width={256} height={256} unoptimized priority /></div><button type="button" className={styles.download} onClick={() => void downloadQr()}><Download size={16} />Download QR image</button><p className={styles.waiting}><span />{message}</p><div className={styles.timer}><span><Clock3 size={15} />Order expires in</span><strong>{formattedTime}</strong></div><div className={styles.order}><span>Order ID</span><code>{order.orderId}</code></div></>}
        {state === 'loading' && <div className={styles.loading}><span className={styles.spinner} />Creating your payment order…</div>}
        {state === 'error' && <div className={styles.error}>{message}</div>}
        {(state === 'expired' || state === 'error') && <button className={styles.primary} onClick={() => void createOrder()}>Create new QR code</button>}
      </section><p className={styles.note}><ShieldCheck size={15} />Payment is confirmed automatically after gateway verification.</p>
    </div>
    <footer className={styles.footer}>Keep this page open until the payment confirmation appears.</footer>
  </section></main>;
}