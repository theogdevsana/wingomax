"use client";

import { useState, useEffect } from "react";
import { Clock, Smartphone, ShieldBan, ShieldCheck, Trash2, Key, Copy, CheckCircle2, RotateCcw } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

export default function UsersPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchUsers = async () => {
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
    fetchUsers();
  }, []);

  const handleAction = async (id: string, action: 'ban' | 'unban' | 'delete' | 'reset') => {
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
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="admin-page-wide space-y-6 md:space-y-8">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">User access</p>
          <h1 className="admin-title">License database</h1>
          <p className="admin-subtitle">Manage all generated access keys and users.</p>
        </div>
      </div>

      <div>
        {isFetching ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-[var(--admin-primary)]/20 border-t-[var(--admin-primary)] rounded-full animate-spin" />
          </div>
        ) : licenses.length === 0 ? (
          <div className="admin-panel text-center p-12 text-[var(--admin-muted)] font-medium">
            No keys found. Generate keys from the License Keys page.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
            {licenses.map((user) => {
              const isExpired = new Date() > new Date(user.expiresAt) || user.status === 'expired';
              const isBanned = user.status === 'banned';
              const isUsed = !!user.deviceId;

              let borderClass = "border-[#E0E7FF]";
              let badgeClass = "bg-[var(--admin-primary)] text-white";
              let badgeText = "Active";
              let accentStyle = { background: 'var(--admin-primary)' };
              let usedBadgeClass = "text-[var(--admin-blue)] bg-[var(--admin-blue)]/10 border-[var(--admin-blue)]/10";

              if (isBanned) {
                borderClass = "border-[#FFE4CC]";
                badgeClass = "bg-amber-500 text-white";
                badgeText = "Banned";
                accentStyle = { background: '#d97706' };
                usedBadgeClass = "text-amber-600 bg-amber-50 border-amber-100";
              } else if (isExpired) {
                borderClass = "border-[#FEE2E2]";
                badgeClass = "bg-rose-500 text-white";
                badgeText = "Expired";
                accentStyle = { background: '#dc2626' };
                usedBadgeClass = "text-rose-600 bg-rose-50 border-rose-100";
              }

              return (
                <div key={user._id} className={`admin-card aspect-video rounded-2xl border flex flex-col justify-between relative overflow-hidden ${borderClass}`}>
                  <div className="absolute inset-x-0 top-0 h-1" style={accentStyle} />

                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-black shadow-sm z-10 ${badgeClass}`}>
                    {badgeText}
                  </div>

                  <div className="relative z-10 p-3 flex-1 flex flex-col justify-center">
                    <div className="flex items-center mb-1.5">
                      <div className="p-1 bg-white/60 backdrop-blur-md rounded-lg shadow-sm">
                        <Key size={12} style={{ color: isBanned ? '#d97706' : isExpired ? '#dc2626' : 'var(--admin-primary)' }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 mt-2">
                      <div className="border border-dashed border-slate-300 bg-white/40 px-2 sm:px-3 py-1.5 rounded-md flex-1 backdrop-blur-sm overflow-hidden flex items-center">
                        <h4 className="font-mono text-[10px] sm:text-[11px] md:text-xs font-bold text-slate-800 tracking-wider truncate w-full">
                          {user.key}
                        </h4>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(user.key)}
                        className="admin-action shrink-0 p-1.5 bg-white/60 hover:bg-white backdrop-blur-md rounded-md text-slate-600 transition-all shadow-sm border border-slate-100/50 flex items-center justify-center"
                        title="Copy Key"
                      >
                        {copiedKey === user.key ? <CheckCircle2 size={12} className="text-green-600" /> : <Copy size={12} />}
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5 text-[9px] sm:text-[10px] font-bold">
                      <div className="flex items-center gap-1 text-slate-600 bg-white/60 backdrop-blur-md px-2 py-1 rounded shadow-sm border border-white">
                        <Clock size={12} />
                        {new Date(user.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                      </div>

                      {isUsed ? (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded shadow-sm border ${usedBadgeClass}`} title={user.deviceId}>
                          <Smartphone size={12} />
                          <span className="truncate" style={{ maxWidth: '3rem' }}>Used</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500 bg-white/60 backdrop-blur-md px-2 py-1 rounded shadow-sm border border-white">
                          <Smartphone size={12} />
                          <span>Unused</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10 bg-white/50 backdrop-blur-md border-t border-black/5 p-2 flex items-center justify-end gap-1.5">
                    {isUsed && !isExpired && (
                      <button 
                        onClick={() => handleAction(user._id, 'reset')}
                        className="admin-action flex items-center justify-center gap-1 p-1.5 rounded bg-[var(--admin-blue)]/10 text-[var(--admin-blue)] hover:bg-[var(--admin-blue)] hover:text-white transition-all active:scale-95 font-bold text-[10px] sm:text-xs group"
                        title="Reset Device"
                      >
                        <RotateCcw size={12} className="group-hover:-rotate-90 transition-transform duration-300" />
                      </button>
                    )}

                    {!isExpired && (
                      isBanned ? (
                        <button 
                          onClick={() => handleAction(user._id, 'unban')}
                          className="admin-action flex items-center justify-center gap-1 flex-1 py-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white text-[10px] sm:text-xs font-black transition-all active:scale-95 shadow-sm border border-emerald-100/50"
                        >
                          <ShieldCheck size={12} /> Unban
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction(user._id, 'ban')}
                          className="admin-action flex items-center justify-center gap-1 flex-1 py-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white text-[10px] sm:text-xs font-black transition-all active:scale-95 shadow-sm border border-amber-100/50"
                        >
                          <ShieldBan size={12} /> Ban
                        </button>
                      )
                    )}

                    <button 
                      onClick={() => handleAction(user._id, 'delete')}
                      className={`admin-action flex items-center justify-center gap-1 py-1.5 px-2 rounded text-[10px] sm:text-xs font-black transition-all active:scale-95 shadow-sm border ${isExpired ? 'flex-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border-red-100/50' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-red-100/50'}`}
                    >
                      <Trash2 size={12} /> {isExpired ? 'Delete' : ''}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
