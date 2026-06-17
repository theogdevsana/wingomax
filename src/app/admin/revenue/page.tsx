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
    <div className="admin-page space-y-6 md:space-y-8">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Financials</p>
          <h1 className="admin-title">Revenue Analytics</h1>
          <p className="admin-subtitle">Track your total sales and growth.</p>
        </div>
      </div>

      {isFetching ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[var(--admin-primary)]/20 border-t-[var(--admin-primary)] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <RevenueCard 
            title="Total Revenue" 
            amount={stats?.total || 0} 
            icon={<DollarSign className="text-[var(--admin-green)]" size={26} />} 
            color="var(--admin-green)"
          />
          <RevenueCard 
            title="Monthly Sales (Last 30 Days)" 
            amount={stats?.monthly || 0} 
            icon={<Calendar className="text-[var(--admin-blue)]" size={26} />} 
            color="var(--admin-blue)"
          />
          <RevenueCard 
            title="Weekly Sales (Last 7 Days)" 
            amount={stats?.weekly || 0} 
            icon={<TrendingUp className="text-[var(--admin-primary)]" size={26} />} 
            color="var(--admin-primary)"
          />
          <RevenueCard 
            title="Previous Month Sales" 
            amount={stats?.lastMonth || 0} 
            icon={<CalendarDays className="text-[var(--admin-orange)]" size={26} />} 
            color="var(--admin-orange)"
          />
        </div>
      )}
    </div>
  );
}

function RevenueCard({ title, amount, icon, color = "var(--admin-blue)" }: { title: string, amount: number, icon: React.ReactNode, color?: string }) {
  return (
    <div className="admin-stat" style={{ '--stat-color': color } as React.CSSProperties}>
      <div className="admin-stat-accent" style={{ background: color }} />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="admin-stat-label">{title}</p>
          <p className="admin-stat-value text-[var(--admin-text)]">₹{amount.toLocaleString()}</p>
        </div>
        <div className="admin-stat-icon">
          {icon}
        </div>
      </div>
    </div>
  );
}
