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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 md:gap-6">
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
      className="bg-white rounded-[28px] p-6 border border-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group min-h-[180px] flex flex-col justify-center"
      style={{ boxShadow: `0 12px 30px -10px ${shadowColor}` }}
    >
      {/* Decorative Blobs - Subscription Style */}
      <div 
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none transition-transform group-hover:scale-110" 
        style={{ background: blobColor }}
      />
      <div 
        className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none transition-transform group-hover:scale-110" 
        style={{ background: blobColor2 }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:border-white transition-colors">
            {icon}
          </div>
        </div>
        <h4 className="text-slate-500 font-bold text-xs md:text-sm uppercase tracking-widest">{title}</h4>
        <p className="text-3xl md:text-4xl font-black mt-2 tracking-tight text-slate-900">₹{amount.toLocaleString()}</p>
      </div>
    </div>
  );
}
