"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Calendar, CalendarDays } from "lucide-react";

export default function RevenuePage() {
  const [stats, setStats] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Revenue Analytics</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1 font-medium">Track your total sales and growth.</p>
      </div>

      {isFetching ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
          <RevenueCard 
            title="Total Revenue" 
            amount={stats?.total || 0} 
            icon={<DollarSign className="text-emerald-600" size={28} />} 
            color="#34C759"
          />
          <RevenueCard 
            title="Monthly Sales (Last 30 Days)" 
            amount={stats?.monthly || 0} 
            icon={<Calendar className="text-blue-600" size={28} />} 
            color="#007AFF"
          />
          <RevenueCard 
            title="Weekly Sales (Last 7 Days)" 
            amount={stats?.weekly || 0} 
            icon={<TrendingUp className="text-purple-600" size={28} />} 
            color="#AF52DE"
          />
          <RevenueCard 
            title="Previous Month Sales" 
            amount={stats?.lastMonth || 0} 
            icon={<CalendarDays className="text-orange-600" size={28} />} 
            color="#FF9500"
          />
        </div>
      )}
    </div>
  );
}

function RevenueCard({ title, amount, icon, color = "#007AFF" }: { title: string, amount: number, icon: React.ReactNode, color?: string }) {
  const blobColor = `${color}15`; 
  const blobColor2 = `${color}08`;
  const shadowColor = `${color}25`;

  return (
    <div 
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-h-[120px] flex flex-col justify-center cursor-default"
      style={{ boxShadow: `0 8px 24px -8px ${shadowColor}` }}
    >
      {/* Decorative Blobs */}
      <div 
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none transition-transform duration-500 group-hover:scale-125" 
        style={{ background: blobColor }}
      />
      <div 
        className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full pointer-events-none transition-transform duration-500 group-hover:scale-110" 
        style={{ background: blobColor2 }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h4 className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1">{title}</h4>
          <p className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">₹{amount.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-50 group-hover:shadow-md transition-all">
          {icon}
        </div>
      </div>
    </div>
  );
}
