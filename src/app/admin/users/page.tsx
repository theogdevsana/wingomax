"use client";

import { useState, useEffect } from "react";
import { UserCircle, Clock, Smartphone, ShieldBan, ShieldCheck, Trash2, Key, Copy, CheckCircle2, RotateCcw } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

export default function UsersPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(getApiUrl("/api/admin/license"));
      const data = await res.json();
      if (res.ok && data.status === "success") {
        // Show ALL keys
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
        await fetch(getApiUrl(`/api/admin/license?id=${id}`), { method: 'DELETE' });
      } else {
        await fetch(getApiUrl('/api/admin/license'), {
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
    <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">License Database</h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-500 mt-1 font-medium">Manage all generated access keys and users.</p>
      </div>

      <div>
        {isFetching ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : licenses.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-500 font-medium">
            No keys found. Generate keys from the License Keys page.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 md:gap-6">
            {licenses.map((user) => {
              const isExpired = new Date() > new Date(user.expiresAt) || user.status === 'expired';
              const isBanned = user.status === 'banned';
              const isUsed = !!user.deviceId;

              // Soft Premium Palette (iOS Inspired)
              let bgClass = "bg-[#F5F7FF] border-[#E0E7FF]"; // Soft Indigo (Active)
              let badgeClass = "bg-indigo-600 text-white shadow-indigo-100";
              let badgeText = "Active";
              let blobFill = "rgba(79, 70, 229, 0.08)";
              let blobFill2 = "rgba(79, 70, 229, 0.12)";
              let iconColor = "text-indigo-600";

              if (isBanned) {
                bgClass = "bg-[#FFF9F2] border-[#FFE4CC]"; // Soft Amber (Banned)
                badgeClass = "bg-amber-500 text-white shadow-amber-100";
                badgeText = "Banned";
                blobFill = "rgba(245, 158, 11, 0.08)";
                blobFill2 = "rgba(245, 158, 11, 0.12)";
                iconColor = "text-amber-600";
              } else if (isExpired) {
                bgClass = "bg-[#FFF5F5] border-[#FEE2E2]"; // Soft Rose (Expired)
                badgeClass = "bg-rose-500 text-white shadow-rose-100";
                badgeText = "Expired";
                blobFill = "rgba(244, 63, 94, 0.08)";
                blobFill2 = "rgba(244, 63, 94, 0.12)";
                iconColor = "text-rose-600";
              }

              return (
                <div key={user._id} className={`aspect-video rounded-2xl border flex flex-col justify-between shadow-sm transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden ${bgClass}`}>
                  
                  {/* Decorative Blobs - Subscription Style */}
                  <div 
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none transition-transform group-hover:scale-110" 
                    style={{ background: blobFill }}
                  />
                  <div 
                    className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full pointer-events-none transition-transform group-hover:scale-110" 
                    style={{ background: blobFill2 }}
                  />

                  {/* Status Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase shadow-sm z-10 ${badgeClass}`}>
                    {badgeText}
                  </div>

                  <div className="relative z-10 p-3 flex-1 flex flex-col justify-center">
                    
                    <div className="flex items-center mb-1.5">
                      <div className="p-1 bg-white/60 backdrop-blur-md rounded-lg shadow-sm">
                        <Key className={iconColor} size={12} />
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
                        className="shrink-0 p-1.5 bg-white/60 hover:bg-white backdrop-blur-md rounded-md text-slate-600 transition-all shadow-sm border border-slate-100/50 flex items-center justify-center"
                        title="Copy Key"
                      >
                        {copiedKey === user.key ? <CheckCircle2 size={12} className="text-green-600" /> : <Copy size={12} />}
                      </button>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[9px] sm:text-[10px] font-bold">
                      <div className="flex items-center gap-1 text-slate-600 bg-white/60 backdrop-blur-md px-2 py-1 rounded shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-white">
                        <Clock size={12} className={iconColor} />
                        {new Date(user.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                      </div>
                      
                      {isUsed ? (
                        <div className="flex items-center gap-1 text-blue-700 bg-blue-100/70 backdrop-blur-md px-2 py-1 rounded shadow-[0_2px_10px_-4px_rgba(59,130,246,0.2)] border border-blue-50" title={user.deviceId}>
                          <Smartphone size={12} />
                          <span className="truncate max-w-[50px] sm:max-w-[70px]">Used</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500 bg-white/60 backdrop-blur-md px-2 py-1 rounded shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-white">
                          <Smartphone size={12} />
                          <span>Unused</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="relative z-10 bg-white/50 backdrop-blur-md border-t border-black/5 p-2 flex items-center justify-end gap-1.5">
                    {isUsed && !isExpired && (
                      <button 
                        onClick={() => handleAction(user._id, 'reset')}
                        className="flex items-center justify-center gap-1 p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all active:scale-95 font-bold text-[10px] sm:text-xs group"
                        title="Reset Device"
                      >
                        <RotateCcw size={12} className="group-hover:-rotate-90 transition-transform duration-300" />
                      </button>
                    )}
                    
                    {!isExpired && (
                      isBanned ? (
                        <button 
                          onClick={() => handleAction(user._id, 'unban')}
                          className="flex items-center justify-center gap-1 flex-1 py-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white text-[10px] sm:text-xs font-black tracking-wider transition-all active:scale-95 shadow-sm border border-emerald-100/50"
                        >
                          <ShieldCheck size={12} /> UNBAN
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction(user._id, 'ban')}
                          className="flex items-center justify-center gap-1 flex-1 py-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white text-[10px] sm:text-xs font-black tracking-wider transition-all active:scale-95 shadow-sm border border-amber-100/50"
                        >
                          <ShieldBan size={12} /> BAN
                        </button>
                      )
                    )}
                    
                    <button 
                      onClick={() => handleAction(user._id, 'delete')}
                      className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-[10px] sm:text-xs font-black tracking-wider transition-all active:scale-95 shadow-sm border ${isExpired ? 'flex-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border-red-100/50' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border-red-100/50'}`}
                    >
                      <Trash2 size={12} /> {isExpired ? 'DEL' : ''}
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
