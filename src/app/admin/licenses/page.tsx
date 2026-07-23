"use client";

import { useState, useEffect } from "react";
import { Key, Clock, Copy, Plus, AlertCircle, CheckCircle2, ShieldBan, ShieldCheck, Trash2, Smartphone, Search, RefreshCw } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

export default function CreateLicense() {
  const [duration, setDuration] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLicense, setGeneratedLicense] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [licenses, setLicenses] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      const res = await fetch(getApiUrl("/v1/admin/license"), {
        credentials: 'include',
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
    } else {
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAction = async (id: string, action: 'ban' | 'unban' | 'delete') => {
    try {
      if (action === 'delete') {
        const confirmDelete = confirm("Are you sure you want to delete this key?");
        if (!confirmDelete) return;
        await fetch(getApiUrl(`/v1/admin/license?id=${id}`), { credentials: 'include', method: 'DELETE' });
      } else {
        await fetch(getApiUrl('/v1/admin/license'), {
          credentials: 'include',
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action }),
        });
      }
      fetchLicenses();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLicenses = licenses.filter((lic) =>
    searchTerm.trim() === "" ? true : lic.key?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page space-y-6 md:space-y-8">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Access control</p>
          <h1 className="admin-title">License management</h1>
          <p className="admin-subtitle">Create and manage access keys for users.</p>
        </div>
      </div>

      {/* YouTube Thumbnail Box Container (16:9 Aspect Ratio on Desktop) */}
      <div className="w-full max-w-[760px] mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden transition-all md:aspect-[16/9] flex flex-col justify-between p-5 md:p-7 relative">
        {/* Top bar inside box */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[var(--admin-primary)] flex items-center justify-center font-bold">
              <Key size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-none">Generate new key</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Select duration and click generate</p>
            </div>
          </div>
        </div>

        {/* Center content: Plan selector grid */}
        <div className="my-3">
          <label className="text-xs font-semibold text-slate-600 block mb-2">Subscription plan</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
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
                className={`relative p-2.5 rounded-xl text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[64px] border ${
                  duration === opt.value
                    ? "border-[var(--admin-primary)] bg-blue-50/70 text-[var(--admin-primary)] shadow-sm font-bold"
                    : "border-slate-100 bg-slate-50/60 text-slate-700 hover:bg-slate-100/80 hover:border-slate-200"
                }`}
              >
                {opt.popular && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                    Popular
                  </span>
                )}
                <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">{opt.tier}</span>
                <span className="text-xs font-extrabold block">{opt.days}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generated Key Result Container if available */}
        {generatedLicense ? (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 my-2 animate-in fade-in">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={13} /> Key created successfully!
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Expires: {new Date(generatedLicense.expiresAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white px-3 py-2 rounded-xl border border-slate-200 font-mono text-sm sm:text-base text-slate-900 font-extrabold tracking-wider text-center select-all">
                {generatedLicense.key}
              </code>
              <button
                onClick={() => copyToClipboard(generatedLicense.key)}
                className="px-3 py-2 bg-[var(--admin-primary)] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0"
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>
        ) : error ? (
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2 my-2">
            <AlertCircle size={14} /> {error}
          </div>
        ) : null}

        {/* Bottom CTA action button inside YouTube box */}
        <div className="pt-2">
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="w-full py-3 bg-[var(--admin-primary)] hover:bg-blue-600 active:scale-[0.99] text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={18} /> Generate license key
              </>
            )}
          </button>
        </div>
      </div>

      {/* Existing Licenses Section */}
      <div className="pt-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Existing licenses ({licenses.length})</h2>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/20"
              />
            </div>
            <button
              onClick={fetchLicenses}
              className="p-2 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              title="Refresh list"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Table */}
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
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400 font-medium py-10">
                    Loading keys...
                  </td>
                </tr>
              ) : filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-slate-400 font-medium py-10">
                    No keys found. Generate one above!
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((lic) => {
                  const isBanned = lic.status === 'banned';
                  const isExpired = lic.status === 'expired' || (lic.expiresAt && new Date(lic.expiresAt) < new Date());
                  const isActive = !isBanned && !isExpired;

                  return (
                    <tr key={lic._id || lic.key} className="hover:bg-slate-50/80 transition-colors">
                      <td>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-bold font-mono text-slate-900 select-all tracking-wider">
                            {lic.key}
                          </code>
                          <button
                            onClick={() => copyToClipboard(lic.key, false)}
                            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                            title="Copy key"
                          >
                            {copiedId === lic.key ? (
                              <CheckCircle2 size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck size={12} /> Active
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <Clock size={12} /> Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <ShieldBan size={12} /> Banned
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <Smartphone size={13} className={lic.deviceId ? "text-blue-500" : "text-slate-300"} />
                          <span className="truncate max-w-[100px]">{lic.deviceId || "Unused"}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs text-slate-500 font-medium">
                          {lic.expiresAt ? new Date(lic.expiresAt).toLocaleDateString() : '—'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isBanned ? (
                            <button
                              onClick={() => handleAction(lic._id, 'unban')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Unban Key"
                            >
                              <ShieldCheck size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(lic._id, 'ban')}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Ban Key"
                            >
                              <ShieldBan size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleAction(lic._id, 'delete')}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Key"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
