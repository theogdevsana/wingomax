'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Clock3, CreditCard, RefreshCw, XCircle, Search, Copy, Check, Filter } from 'lucide-react';
import { getApiUrl } from '@/lib/api-utils';

type Payment = {
  order_id: string;
  plan_id: string;
  amount: number;
  status: string;
  expires_at: string;
  created_at: string;
  paid_at: string | null;
};

type Summary = { paid: number; pending: number; expired: number; total: number };

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const dateTime = (value: string | null) => (value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—');

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Summary>({ paid: 0, pending: 0, expired: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'expired'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(getApiUrl('/v1/admin/payments'), { credentials: 'include' });
      const data = await response.json();
      if (!response.ok || data.status !== 'success') throw new Error(data.error || 'Unable to load payment logs');
      setPayments(data.data.payments);
      setSummary(data.data.summary);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load payment logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadPayments(), 0);
    return () => window.clearTimeout(timer);
  }, [loadPayments]);

  const copyOrder = (orderId: string) => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'paid'
        ? p.status === 'paid' || p.status === 'active' || p.status === 'granted'
        : filter === 'pending'
        ? p.status === 'pending' || p.status === 'processing'
        : p.status === 'expired';

    const matchesSearch =
      search.trim() === '' ||
      p.order_id.toLowerCase().includes(search.toLowerCase()) ||
      p.plan_id.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-page-wide space-y-6">
      {/* Page Header */}
      <div className="admin-page-header flex-wrap gap-4">
        <div>
          <p className="admin-eyebrow">Billing & Access</p>
          <h1 className="admin-title">Payment Logs & Status</h1>
          <p className="admin-subtitle">Monitor real-time QR payment verification, active access grants, and expired orders.</p>
        </div>
        <button className="admin-btn admin-btn-secondary" onClick={() => void loadPayments()} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <LogStat
          label="All Orders"
          value={summary.total}
          icon={<CreditCard size={22} />}
          tone="#007aff"
          isActive={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        <LogStat
          label="Access Granted (Paid)"
          value={summary.paid}
          icon={<CheckCircle2 size={22} />}
          tone="#34c759"
          isActive={filter === 'paid'}
          onClick={() => setFilter('paid')}
        />
        <LogStat
          label="Pending Verification"
          value={summary.pending}
          icon={<Clock3 size={22} />}
          tone="#ff9f0a"
          isActive={filter === 'pending'}
          onClick={() => setFilter('pending')}
        />
        <LogStat
          label="Expired Orders"
          value={summary.expired}
          icon={<XCircle size={22} />}
          tone="#64748b"
          isActive={filter === 'expired'}
          onClick={() => setFilter('expired')}
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filter === 'all' ? 'bg-[var(--admin-primary)] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({summary.total})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filter === 'paid' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Access Granted ({summary.paid})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filter === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pending ({summary.pending})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filter === 'expired' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Expired ({summary.expired})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search order ID or plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 text-slate-8 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/20 focus:border-[var(--admin-primary)] transition-all"
          />
        </div>
      </div>

      {/* Payment Table */}
      <section className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Created At</th>
              <th>Verification / Paid At</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-12">
                  <div className="inline-flex items-center gap-2">
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Loading payment orders...</span>
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6} className="text-center text-rose-500 py-12 font-medium">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && filteredPayments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-slate-400 py-12 font-medium">
                  No matching payment records found.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredPayments.map((payment) => (
                <tr key={payment.order_id} className="hover:bg-slate-50/80 transition-colors">
                  <td>
                    <div className="inline-flex items-center gap-2">
                      <code className="admin-order-id font-mono text-xs">{payment.order_id}</code>
                      <button
                        onClick={() => copyOrder(payment.order_id)}
                        className="text-slate-400 hover:text-slate-700 transition-colors"
                        title="Copy Order ID"
                      >
                        {copiedId === payment.order_id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>
                  <td className="font-semibold text-slate-700">{payment.plan_id}</td>
                  <td className="font-bold text-slate-900">{money.format(payment.amount)}</td>
                  <td>
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="text-slate-500 text-xs">{dateTime(payment.created_at)}</td>
                  <td className="text-slate-500 text-xs">{dateTime(payment.paid_at)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function LogStat({
  label,
  value,
  icon,
  tone,
  isActive,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`admin-stat cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
        isActive ? 'ring-2 ring-offset-1' : ''
      }`}
      style={{ '--stat-color': tone, ringColor: tone } as React.CSSProperties}
    >
      <div className="admin-stat-accent" style={{ background: tone }} />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div>
          <p className="admin-stat-label">{label}</p>
          <p className="admin-stat-value">{value}</p>
        </div>
        <div className="admin-stat-icon" style={{ color: tone }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = (status || '').toLowerCase();

  if (normalized === 'paid' || normalized === 'active' || normalized === 'granted') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
        Access Granted
      </span>
    );
  }

  if (normalized === 'pending' || normalized === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping flex-shrink-0" />
        Pending
      </span>
    );
  }

  if (normalized === 'expired') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
        Expired
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
      {normalized || 'Failed'}
    </span>
  );
}