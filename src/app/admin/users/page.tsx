"use client";

import { useState, useEffect } from "react";
import { UserCircle, Clock, Smartphone, ShieldBan, ShieldCheck, Trash2, Key, Copy, CheckCircle2, RotateCcw } from "lucide-react";

export default function UsersPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/admin/license");
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
        await fetch(`/api/admin/license?id=${id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/admin/license', {
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
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">License Database</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">Manage all generated access keys and users.</p>
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

              // iOS soft colors with blobs
              let bgClass = "bg-[#E8F5E9] border-[#34C759]"; // iOS Green light (Active)
              let badgeClass = "bg-[#34C759] text-white";
              let badgeText = "Active";
              let blobFill = "rgba(52, 199, 89, 0.1)";
              let blobFill2 = "rgba(52, 199, 89, 0.15)";
              let iconColor = "text-[#34C759]";

              if (isBanned) {
                bgClass = "bg-[#FFF4E5] border-[#FF9500]"; // iOS Orange light
                badgeClass = "bg-[#FF9500] text-white";
                badgeText = "Banned";
                blobFill = "rgba(255, 149, 0, 0.1)";
                blobFill2 = "rgba(255, 149, 0, 0.15)";
                iconColor = "text-[#FF9500]";
              } else if (isExpired) {
                bgClass = "bg-[#FFEBEB] border-[#FF3B30]"; // iOS Red light
                badgeClass = "bg-[#FF3B30] text-white";
                badgeText = "Expired";
                blobFill = "rgba(255, 59, 48, 0.1)";
                blobFill2 = "rgba(255, 59, 48, 0.15)";
                iconColor = "text-[#FF3B30]";
              }

              return (
                <div key={user._id} className={`rounded-3xl border flex flex-col justify-between shadow-sm transition-all hover:shadow-md hover:-translate-y-1 min-h-[220px] relative overflow-hidden ${bgClass}`}>
                  
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
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase shadow-sm z-10 ${badgeClass}`}>
                    {badgeText}
                  </div>

                  <div className="relative z-10 p-5 md:p-6 flex-1 flex flex-col justify-center">
                    
                    <div className="flex items-center mb-3 md:mb-4">
                      <div className="p-2.5 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm">
                        <Key className={iconColor} size={20} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-mono text-sm md:text-lg font-bold text-slate-800 tracking-widest break-all">
                        {user.key}
                      </h4>
                      <button 
                        onClick={() => copyToClipboard(user.key)}
                        className="shrink-0 p-2 bg-white/50 hover:bg-white backdrop-blur-md rounded-xl text-slate-600 transition-all shadow-sm"
                        title="Copy Key"
                      >
                        {copiedKey === user.key ? <CheckCircle2 size={18} className="text-green-600" /> : <Copy size={18} />}
                      </button>
                    </div>
                    
                    <div className="mt-3 md:mt-4 flex flex-wrap gap-2 text-xs md:text-sm font-bold">
                      <div className="flex items-center gap-1 text-slate-700 bg-white/50 backdrop-blur-md px-2 py-1.5 md:px-3 rounded-xl shadow-sm">
                        <Clock size={14} className={iconColor} />
                        {new Date(user.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      
                      {isUsed ? (
                        <div className="flex items-center gap-1 text-blue-800 bg-blue-100/70 backdrop-blur-md px-2 py-1.5 md:px-3 rounded-xl shadow-sm" title={user.deviceId}>
                          <Smartphone size={14} />
                          <span className="truncate max-w-[80px] md:max-w-[120px]">Used</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500 bg-white/50 backdrop-blur-md px-2 py-1.5 md:px-3 rounded-xl shadow-sm">
                          <Smartphone size={14} />
                          <span>Unused</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="relative z-10 bg-white/40 backdrop-blur-md border-t border-black/5 p-2.5 md:p-3 flex items-center justify-end gap-2">
                    {isUsed && !isExpired && (
                      <button 
                        onClick={() => handleAction(user._id, 'reset')}
                        className="flex items-center justify-center gap-1 p-2 md:p-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md active:scale-95"
                        title="Reset Device"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
                    
                    {!isExpired && (
                      isBanned ? (
                        <button 
                          onClick={() => handleAction(user._id, 'unban')}
                          className="flex items-center justify-center gap-1 flex-1 py-2 md:py-2.5 rounded-xl bg-green-500 text-white hover:bg-green-600 text-xs md:text-sm font-black transition-all shadow-md active:scale-95"
                        >
                          <ShieldCheck size={14} /> UNBAN
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAction(user._id, 'ban')}
                          className="flex items-center justify-center gap-1 flex-1 py-2 md:py-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 text-xs md:text-sm font-black transition-all shadow-md active:scale-95"
                        >
                          <ShieldBan size={14} /> BAN
                        </button>
                      )
                    )}
                    
                    <button 
                      onClick={() => handleAction(user._id, 'delete')}
                      className={`flex items-center justify-center gap-1 py-2 md:py-2.5 px-3 md:px-4 rounded-xl text-white hover:bg-red-600 text-xs md:text-sm font-black transition-all shadow-md active:scale-95 ${isExpired ? 'flex-1 bg-red-500' : 'bg-red-500'}`}
                    >
                      <Trash2 size={14} /> {isExpired ? 'DELETE' : ''}
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
