'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Clock3, CreditCard, RefreshCw, XCircle } from 'lucide-react';
import { getApiUrl } from '@/lib/api-utils';

type Payment = { order_id: string; plan_id: string; amount: number; status: string; expires_at: string; created_at: string; paid_at: string | null };
type Summary = { paid: number; pending: number; expired: number; total: number };

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const dateTime = (value: string | null) => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary>({ paid: 0, pending: 0, expired: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPayments = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch(getApiUrl('/v1/admin/payments'), { credentials: 'include' });
      const data = await response.json();
      if (!response.ok || data.status !== 'success') throw new Error(data.error || 'Unable to load payment logs');
      setPayments(data.data.payments); setSummary(data.data.summary);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load payment logs');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => void loadPayments(), 0); return () => window.clearTimeout(timer); }, [loadPayments]);

  return <div className="admin-page-wide space-y-6">
    <div className="admin-page-header"><div><p className="admin-eyebrow">Billing</p><h1 className="admin-title">Payment logs</h1><p className="admin-subtitle">Review recent QR payment orders and their verified status.</p></div><button className="admin-btn admin-btn-secondary" onClick={() => void loadPayments()} disabled={loading}><RefreshCw size={16} className={loading ? 'animate-spin' : ''} />Refresh</button></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <LogStat label="All orders" value={summary.total} icon={<CreditCard size={20} />} tone="var(--admin-primary)" />
      <LogStat label="Paid" value={summary.paid} icon={<CheckCircle2 size={20} />} tone="var(--admin-green)" />
      <LogStat label="Pending" value={summary.pending} icon={<Clock3 size={20} />} tone="var(--admin-orange)" />
      <LogStat label="Expired" value={summary.expired} icon={<XCircle size={20} />} tone="var(--admin-red)" />
    </div>
    <section className="admin-table-wrap">
      <table><thead><tr><th>Order</th><th>Plan</th><th>Amount</th><th>Status</th><th>Created</th><th>Paid</th></tr></thead><tbody>
        {loading && <tr><td colSpan={6} className="text-center text-gray-400 py-10">Loading payment logs…</td></tr>}
        {!loading && error && <tr><td colSpan={6} className="text-center text-red-500 py-10">{error}</td></tr>}
        {!loading && !error && payments.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400 py-10">No payment orders yet.</td></tr>}
        {!loading && !error && payments.map(payment => <tr key={payment.order_id}><td><code className="admin-order-id">{payment.order_id}</code></td><td className="font-semibold text-slate-700">{payment.plan_id}</td><td className="font-bold text-slate-800">{money.format(payment.amount)}</td><td><Status status={payment.status} /></td><td className="text-slate-500">{dateTime(payment.created_at)}</td><td className="text-slate-500">{dateTime(payment.paid_at)}</td></tr>)}
      </tbody></table>
    </section>
  </div>;
}

function LogStat({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: string }) { return <div className="admin-stat" style={{ '--stat-color': tone } as React.CSSProperties}><div className="admin-stat-accent" style={{ background: tone }} /><div className="relative z-10 flex items-center justify-between gap-3"><div><p className="admin-stat-label">{label}</p><p className="admin-stat-value">{value}</p></div><div className="admin-stat-icon" style={{ color: tone }}>{icon}</div></div></div>; }
function Status({ status }: { status: string }) { const normalized = status === 'paid' ? 'active' : status === 'expired' ? 'expired' : 'banned'; return <span className={`admin-badge admin-badge-${normalized}`}>{status}</span>; }