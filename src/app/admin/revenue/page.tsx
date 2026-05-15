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
            bg="bg-[#E8F5E9]" 
            border="border-[#34C759]"
            blobFill="rgba(52, 199, 89, 0.1)"
            blobFill2="rgba(52, 199, 89, 0.15)"
          />
          <RevenueCard 
            title="Monthly Sales (Last 30 Days)" 
            amount={stats?.monthly || 0} 
            icon={<Calendar className="text-blue-600" size={28} />} 
            bg="bg-[#E5F0FF]" 
            border="border-[#007AFF]"
            blobFill="rgba(0, 122, 255, 0.08)"
            blobFill2="rgba(0, 122, 255, 0.12)"
          />
          <RevenueCard 
            title="Weekly Sales (Last 7 Days)" 
            amount={stats?.weekly || 0} 
            icon={<TrendingUp className="text-purple-600" size={28} />} 
            bg="bg-[#F3E5F5]" 
            border="border-[#AF52DE]"
            blobFill="rgba(175, 82, 222, 0.08)"
            blobFill2="rgba(175, 82, 222, 0.12)"
          />
          <RevenueCard 
            title="Previous Month Sales" 
            amount={stats?.lastMonth || 0} 
            icon={<CalendarDays className="text-orange-600" size={28} />} 
            bg="bg-[#FFF4E5]" 
            border="border-[#FF9500]"
            blobFill="rgba(255, 149, 0, 0.1)"
            blobFill2="rgba(255, 149, 0, 0.15)"
          />
        </div>
      )}
    </div>
  );
}

function RevenueCard({ title, amount, icon, bg, border, blobFill, blobFill2 }: { title: string, amount: number, icon: React.ReactNode, bg: string, border: string, blobFill: string, blobFill2: string }) {
  return (
    <div className={`rounded-3xl border p-5 md:p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${bg} ${border}`}>
      {/* Abstract Papercut Background Blob */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 400 300">
        <path d="M-40 60 C20 0 100 30 160 10 C220 -10 280 40 340 20 C400 0 440 50 420 80 L420 0 L0 0 Z" fill={blobFill} />
        <path d="M0 280 C60 240 120 270 180 250 C260 220 320 260 380 240 C420 230 450 270 440 300 L0 300 Z" fill={blobFill2} />
      </svg>
      
      <div className="relative z-10 flex justify-between items-center mb-4 md:mb-5">
        <div className="p-3 bg-white/60 rounded-2xl backdrop-blur-sm shadow-sm">
          {icon}
        </div>
      </div>
      <h4 className="relative z-10 text-slate-600 font-bold text-sm md:text-base">{title}</h4>
      <p className="relative z-10 text-3xl md:text-4xl font-black mt-1 md:mt-2 tracking-tight text-slate-900">₹{amount.toLocaleString()}</p>
    </div>
  );
}
