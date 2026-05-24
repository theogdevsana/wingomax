"use client";

import { useState, useEffect } from "react";
import { Key, Clock, Copy, Plus, AlertCircle, CheckCircle2, ShieldBan, ShieldCheck, Trash2, Smartphone } from "lucide-react";

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
      const res = await fetch("/api/admin/license");
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
      const res = await fetch("/api/admin/license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationDays: duration }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setGeneratedLicense(data.data);
        fetchLicenses(); // Refresh the list
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
        await fetch(`/api/admin/license?id=${id}`, { method: 'DELETE' });
      } else {
        await fetch('/api/admin/license', {
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">License Management</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">Create and manage access keys for users.</p>
      </div>

      {/* Generate Key Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Key className="text-blue-600" /> Generate New Key
        </h3>

        <div className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Subscription Plan
            </label>
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
                  className={`relative p-3 rounded-[1.25rem] border-2 text-left transition-all duration-300 overflow-hidden flex flex-col justify-center min-h-[72px] group ${
                    duration === opt.value
                      ? "border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10 scale-[1.02] z-10"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                  }`}
                >
                  {opt.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-bl-lg">
                      Popular
                    </div>
                  )}
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${duration === opt.value ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                    {opt.tier}
                  </div>
                  <div className={`text-base font-black tracking-tight ${duration === opt.value ? 'text-slate-900' : 'text-slate-700'}`}>
                    {opt.days}
                  </div>
                  {duration === opt.value && (
                    <div className="absolute bottom-2.5 right-2.5 text-blue-500">
                      <CheckCircle2 size={16} className="drop-shadow-sm" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="w-full py-3.5 md:py-4 bg-[#007AFF] hover:bg-[#0066D6] text-white rounded-2xl font-bold text-base md:text-lg shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={24} /> Create License Key
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
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              Success! Key Generated
            </h4>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 font-mono text-xl text-center tracking-widest text-slate-800 font-bold shadow-inner">
                {generatedLicense.key}
              </div>
              <button
                onClick={() => copyToClipboard(generatedLicense.key)}
                className="p-4 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle2 className="text-blue-500" /> : <Copy />}
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
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Existing Licenses</h2>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search by key..." 
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            onChange={(e) => {
              const term = e.target.value.toLowerCase();
              // In a real app, this would filter the state or refetch
            }}
          />
          <button 
            onClick={fetchLicenses}
            className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            title="Refresh List"
          >
            <Clock size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Licenses List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-bottom border-slate-100">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">License Key</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Device</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">Expires At</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isFetching ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    Fetching keys...
                  </td>
                </tr>
              ) : licenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No keys found. Generate one above!
                  </td>
                </tr>
              ) : (
                licenses.map((lic) => (
                  <tr key={lic._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-black text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                          {lic.key}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(lic.key, false)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                        lic.status === 'active' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                        lic.status === 'expired' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {lic.status === 'active' ? <ShieldCheck size={12} /> : <ShieldBan size={12} />}
                        {lic.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                        <Smartphone size={14} className={lic.deviceId ? "text-blue-500" : "text-slate-300"} />
                        <span className="truncate max-w-[100px]">{lic.deviceId || "Unused"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-500">
                        {new Date(lic.expiresAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {lic.status === 'banned' ? (
                          <button 
                            onClick={() => handleAction(lic._id, 'unban')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Unban Key"
                          >
                            <ShieldCheck size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAction(lic._id, 'ban')}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                            title="Ban Key"
                          >
                            <ShieldBan size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleAction(lic._id, 'delete')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
      </div>

      {/* Pricing Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        <PlanGuide 
          days={7} 
          price="499" 
          title="Weekly Access" 
          icon={<Clock className="text-blue-600" size={24} />}
          bg="bg-white" 
          border="border-blue-100" 
          accent="bg-blue-600"
        />
        <PlanGuide 
          days={15} 
          price="1,499" 
          title="Fortnightly Access" 
          icon={<Clock className="text-purple-600" size={24} />}
          bg="bg-white" 
          border="border-purple-100" 
          accent="bg-purple-600"
        />
        <PlanGuide 
          days={30} 
          price="1,999" 
          title="Monthly Premium" 
          icon={<Clock className="text-indigo-600" size={24} />}
          bg="bg-white" 
          border="border-indigo-100" 
          accent="bg-indigo-600"
        />
      </div>
    </div>
  );
}

function PlanGuide({ days, price, title, icon, bg, border, accent }: { days: number, price: string, title: string, icon: React.ReactNode, bg: string, border: string, accent: string }) {
  return (
    <div className={`p-6 rounded-[2rem] border-2 ${border} ${bg} flex flex-col shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}>
      {/* Top Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-2 ${accent} opacity-80`} />
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-white ${accent}`}>
          {days === 30 ? "Best Value" : "Plan"}
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

      <div className="space-y-3 pt-6 border-t border-slate-100">
        {[
          "Single Device Access",
          "All Premium Features",
          "24/7 Priority Support"
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <div className={`w-1.5 h-1.5 rounded-full ${accent}`} />
            {feat}
          </div>
        ))}
      </div>
    </div>
  );
}
