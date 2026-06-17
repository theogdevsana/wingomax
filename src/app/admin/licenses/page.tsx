"use client";

import { useState, useEffect } from "react";
import { Key, Clock, Copy, Plus, AlertCircle, CheckCircle2, ShieldBan, ShieldCheck, Trash2, Smartphone } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

export default function CreateLicense() {
  const [duration, setDuration] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLicense, setGeneratedLicense] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [licenses, setLicenses] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchLicenses = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(getApiUrl("/v1/admin/license"), { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setLicenses(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedLicense(null);
    setCopied(false);

    try {
      const res = await fetch(getApiUrl("/v1/admin/license"), { credentials: 'include', 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationDays: duration }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setGeneratedLicense(data.data);
        fetchLicenses();
      } else {
        setError(data.error || data.msg || "Failed to create license");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, isMain: boolean = true) => {
    navigator.clipboard.writeText(text);
    if (isMain) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAction = async (id: string, action: 'ban' | 'unban' | 'delete') => {
    try {
      if (action === 'delete') {
        const confirmDelete = confirm("Are you sure you want to delete this key?");
        if (!confirmDelete) return;
        await fetch(getApiUrl(`/v1/admin/license?id=${id}`), { credentials: 'include',  method: 'DELETE' });
      } else {
        await fetch(getApiUrl('/v1/admin/license'), { credentials: 'include', 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action })
        });
      }
      fetchLicenses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page space-y-6 md:space-y-8">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Access control</p>
          <h1 className="admin-title">License management</h1>
          <p className="admin-subtitle">Create and manage access keys for users.</p>
        </div>
      </div>

      <div className="admin-panel p-5 md:p-7">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Key className="text-[var(--admin-primary)]" /> Generate new key
        </h3>

        <div className="space-y-6" style={{ maxWidth: "min(100%, 36rem)" }}>
          <div>
            <label className="admin-label mb-2">Subscription plan</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {[
                { days: "7 Days", tier: "Starter", value: 7 },
                { days: "10 Days", tier: "Elite", value: 10 },
                { days: "30 Days", tier: "Max Pro", value: 30, popular: true },
                { days: "45 Days", tier: "Smart AI", value: 45 },
                { days: "90 Days", tier: "Neural", value: 90 },
                { days: "Lifetime", tier: "Quantum", value: 36500 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  className={`admin-action relative p-3 rounded-2xl border text-left transition-all duration-300 overflow-hidden flex flex-col justify-center min-h-[72px] group ${
                    duration === opt.value
                      ? "border-[var(--admin-primary)] bg-[var(--admin-primary-soft)] shadow-md"
                      : "border-[var(--admin-border)] bg-white hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-soft)] hover:shadow-sm"
                  }`}
                >
                    {opt.popular && (
                    <div className="absolute top-0 right-0 bg-[var(--admin-primary)] text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg">
                      Popular
                    </div>
                  )}
                  <div className={`text-[10px] font-black tracking-widest mb-0.5 ${duration === opt.value ? 'text-[var(--admin-primary)]' : 'text-slate-400 group-hover:text-slate-500'}`}>
                    {opt.tier}
                  </div>
                  <div className={`text-base font-black tracking-tight ${duration === opt.value ? 'text-slate-900' : 'text-slate-700'}`}>
                    {opt.days}
                  </div>
                  {duration === opt.value && (
                    <div className="absolute bottom-2.5 right-2.5 text-[var(--admin-primary)]">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="admin-btn admin-btn-primary w-full py-3.5 md:py-4 text-base md:text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={24} /> Create license key
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-medium">
            <AlertCircle /> {error}
          </div>
        )}

        {generatedLicense && (
          <div className="mt-8 p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
            <h4 className="text-sm font-bold text-slate-500 mb-4">
              Success! Key generated
            </h4>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 font-mono text-base sm:text-xl text-center tracking-widest text-slate-800 font-bold shadow-inner break-all">
                {generatedLicense.key}
              </div>
              <button
                onClick={() => copyToClipboard(generatedLicense.key)}
                className="admin-btn admin-btn-secondary justify-center"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle2 className="text-[var(--admin-primary)]" /> : <Copy />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white p-3 rounded-lg border border-slate-100 inline-flex">
              <Clock size={16} className="text-orange-500" />
              Expires on: {new Date(generatedLicense.expiresAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Existing licenses</h2>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search by key..." 
            className="admin-input w-full md:w-auto"
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
            }}
          />
          <button 
            onClick={fetchLicenses}
            className="admin-btn admin-btn-secondary p-2"
            title="Refresh List"
          >
            <Clock size={20} />
          </button>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>License key</th>
              <th>Status</th>
              <th>Device</th>
              <th>Expires at</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)]">
            {isFetching ? (
              <tr>
                <td colSpan={5} className="text-center text-[var(--admin-muted)] font-medium italic py-12">
                  Fetching keys...
                </td>
              </tr>
            ) : licenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-[var(--admin-muted)] font-medium italic py-12">
                  No keys found. Generate one above!
                </td>
              </tr>
            ) : (
              licenses.map((lic) => (
                <tr key={lic._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-black text-slate-700 bg-[var(--admin-surface-soft)] px-2 py-1 rounded border border-[var(--admin-border)]">
                        {lic.key}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(lic.key, false)}
                        className="p-1.5 text-slate-400 hover:text-[var(--admin-primary)] transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={`admin-badge ${
                      lic.status === 'active' ? 'admin-badge-active' :
                      lic.status === 'expired' ? 'admin-badge-expired' :
                      'admin-badge-banned'
                    }`}>
                      {lic.status === 'active' ? <ShieldCheck size={12} /> : <ShieldBan size={12} />}
                      {lic.status.charAt(0).toUpperCase() + lic.status.slice(1)}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                      <Smartphone size={14} className={lic.deviceId ? "text-[var(--admin-blue)]" : "text-slate-300"} />
                      <span className="truncate" style={{ maxWidth: '6rem' }}>{lic.deviceId || "Unused"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-xs font-bold text-slate-500">
                      {new Date(lic.expiresAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      {lic.status === 'banned' ? (
                        <button 
                          onClick={() => handleAction(lic._id, 'unban')}
                          className="p-2 text-[var(--admin-green)] hover:bg-green-50 rounded-lg transition-all"
                          title="Unban Key"
                        >
                          <ShieldCheck size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction(lic._id, 'ban')}
                          className="p-2 text-[var(--admin-orange)] hover:bg-orange-50 rounded-lg transition-all"
                          title="Ban Key"
                        >
                          <ShieldBan size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleAction(lic._id, 'delete')}
                        className="p-2 text-[var(--admin-red)] hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Key"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <PlanGuide 
          days={7} 
          price="499" 
          title="Weekly access" 
          icon={<Clock className="text-[var(--admin-blue)]" size={24} />}
          accent="var(--admin-blue)"
        />
        <PlanGuide 
          days={15} 
          price="1,499" 
          title="Fortnightly access" 
          icon={<Clock className="text-purple-600" size={24} />}
          accent="purple"
        />
        <PlanGuide 
          days={30} 
          price="1,999" 
          title="Monthly premium" 
          icon={<Clock className="text-[var(--admin-primary)]" size={24} />}
          accent="var(--admin-primary)"
        />
      </div>
    </div>
  );
}

function PlanGuide({ days, price, title, icon, accent }: { days: number, price: string, title: string, icon: React.ReactNode, accent: string }) {
  return (
    <div className="admin-card p-5 md:p-6 flex flex-col relative overflow-hidden group">
      <div className="admin-stat-accent" style={{ background: accent }} />

      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-[var(--admin-surface-soft)] rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="px-3 py-1 rounded-full text-[10px] font-black tracking-tighter text-white" style={{ background: accent }}>
          {days === 30 ? "Best value" : "Plan"}
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <h4 className="font-black text-slate-900 text-xl tracking-tight">{title}</h4>
        <p className="text-sm font-bold text-slate-400">{days} Days Duration</p>
      </div>

      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-3xl font-black text-slate-900">₹{price}</span>
        <span className="text-slate-400 text-sm font-bold">/ plan</span>
      </div>

      <div className="space-y-3 pt-6 border-t border-[var(--admin-border)]">
        {[
          "Single device access",
          "All premium features",
          "24/7 Priority Support"
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            {feat}
          </div>
        ))}
      </div>
    </div>
  );
}
