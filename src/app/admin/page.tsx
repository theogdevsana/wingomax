import { Key, Users, AlertOctagon, DollarSign, ShieldAlert } from "lucide-react";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/jwt";

async function getAuthUsername() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return 'Admin';
  const decoded = verifyAdminToken(token);
  return decoded ? decoded.username : 'Admin';
}

export default async function AdminDashboard() {
  const currentUsername = await getAuthUsername();

  return (
    <div className="admin-page space-y-6 md:space-y-8">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Admin dashboard</p>
          <h1 className="admin-title">Overview</h1>
          <p className="admin-subtitle">Welcome back, <span className="font-black text-[var(--admin-primary)]">{currentUsername}</span>.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Status" value="Database" icon={<Key className="text-[var(--admin-primary)]" size={22} />} color="var(--admin-primary)" subtitle="PostgreSQL Connected" />
        <StatCard title="Revenue" value="₹0" icon={<DollarSign className="text-[var(--admin-green)]" size={22} />} color="var(--admin-green)" subtitle="via License Keys" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, negative = false, color = "var(--admin-blue)", subtitle }: { title: string, value: string, icon: React.ReactNode, negative?: boolean, color?: string, subtitle?: string }) {
  return (
    <div className="admin-stat" style={{ '--stat-color': color } as React.CSSProperties}>
      <div className="admin-stat-accent" style={{ background: color }} />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="admin-stat-label">{title}</p>
          <p className={`admin-stat-value ${negative ? 'text-[var(--admin-red)]' : ''}`}>{value}</p>
          {subtitle && <p className="text-[var(--text-xs)] text-[var(--admin-muted)] font-medium mt-0.5">{subtitle}</p>}
        </div>
        <div className="admin-stat-icon">{icon}</div>
      </div>
    </div>
  );
}
