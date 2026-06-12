"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Calendar, CalendarDays } from "lucide-react";
import { getApiUrl } from "@/lib/api-utils";

export default function RevenuePage() {
  const [stats, setStats] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(getApiUrl("/v1/admin/stats"), { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.status === "success") {
          setStats(data.data.revenue);
        }
      } catch (err) {
        console.error("Failed to fetch revenue stats", err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-page space-y-8">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Financials</p>
          <h1 className="admin-title">Revenue Analytics</h1>
          <p className="admin-subtitle">Track your total sales and growth.</p>
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#7B5EA7]/20 border-t-[#7B5EA7] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
          <RevenueCard 
            title="Total Revenue" 
            amount={stats?.total || 0} 
            icon={<DollarSign className="text-[#34C759]" size={26} />} 
            color="#34C759"
          />
          <RevenueCard 
            title="Monthly Sales (Last 30 Days)" 
            amount={stats?.monthly || 0} 
            icon={<Calendar className="text-[#007AFF]" size={26} />} 
            color="#007AFF"
          />
          <RevenueCard 
            title="Weekly Sales (Last 7 Days)" 
            amount={stats?.weekly || 0} 
            icon={<TrendingUp className="text-[#7B5EA7]" size={26} />} 
            color="#7B5EA7"
          />
          <RevenueCard 
            title="Previous Month Sales" 
            amount={stats?.lastMonth || 0} 
            icon={<CalendarDays className="text-[#FF9F0A]" size={26} />} 
            color="#FF9500"
          />
        </div>
      )}
    </div>
  );
}

function RevenueCard({ title, amount, icon, color = "#007AFF" }: { title: string, amount: number, icon: React.ReactNode, color?: string }) {
  const shadowColor = `${color}25`;

  return (
    <div 
      className="admin-card bg-white p-5 relative overflow-hidden group min-h-[130px] flex flex-col justify-center cursor-default"
      style={{ boxShadow: `0 8px 24px -8px ${shadowColor}` }}
    >
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: color }} />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h4 className="text-slate-500 font-black text-[11px] mb-1 uppercase tracking-wide">{title}</h4>
          <p className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">₹{amount.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:shadow-md transition-all">
          {icon}
        </div>
      </div>
    </div>
  );
}
