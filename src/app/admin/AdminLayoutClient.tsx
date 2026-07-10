"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Gamepad2, Settings, LogOut, Key, Menu, X, DollarSign, Zap, ChevronRight, ArrowLeft, CreditCard } from "lucide-react";
import AdminBlogNav from "./AdminBlogNav";
import { getApiUrl } from "@/lib/api-utils";
import "./admin-fixes.css";

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getPageTitle(pathname);

  if (
    pathname === '/admin/login' || 
    pathname === '/login' || 
    pathname === '/admin/setup' || 
    pathname === '/setup'
  ) {
    return <div className="admin-shell bg-[var(--admin-bg)]">{children}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch(getApiUrl('/v1/admin/logout'), { credentials: 'include',  method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="admin-shell">

      {sidebarOpen && (
        <div className="admin-overlay lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-logo">
          <Link href="/admin" className="flex items-center gap-3 min-w-0 flex-1 no-underline text-inherit">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-primary-2)] flex items-center justify-center shadow-sm flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-gray-900 tracking-tight truncate">Wingo Admin</div>
              <div className="text-[10px] text-gray-400 font-medium -mt-0.5 truncate">Management Panel</div>
            </div>
          </Link>
          <button className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-black/5 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="admin-sidebar-nav">
          <NavItem href="/admin" icon={<LayoutDashboard />} label="Dashboard" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/licenses" icon={<Key />} label="License Keys" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/users" icon={<Users />} label="Users" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/revenue" icon={<DollarSign />} label="Revenue" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/payments" icon={<CreditCard />} label="Payment logs" onClick={() => setSidebarOpen(false)} />
          <AdminBlogNav onNavigate={() => setSidebarOpen(false)} />
          <NavItem href="#" icon={<Gamepad2 />} label="Games" />
          <NavItem href="/admin/settings" icon={<Settings />} label="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="admin-sidebar-footer space-y-1">
          <button
            onClick={handleLogout}
            className="admin-nav-link w-full text-red-400 hover:bg-red-50 hover:text-red-600"
          >
            <span className="admin-nav-icon"><LogOut /></span>
            <span>Sign Out</span>
          </button>
          <Link href="/" className="admin-nav-link text-gray-400 hover:bg-gray-100 hover:text-gray-600 no-underline text-inherit">
            <span className="admin-nav-icon"><ArrowLeft /></span>
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button className="p-2 -ml-2 text-gray-600 rounded-xl hover:bg-black/5 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-primary-2)] flex items-center justify-center flex-shrink-0">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="truncate text-sm font-bold text-gray-900">{pageTitle}</span>
            </div>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

function getPageTitle(pathname: string) {
  if (pathname.includes("/admin/licenses")) return "License Keys";
  if (pathname.includes("/admin/users")) return "Users";
  if (pathname.includes("/admin/revenue")) return "Revenue Analytics";
  if (pathname.includes("/admin/payments")) return "Payment Logs";
  if (pathname.includes("/admin/blogs")) return "Blog Manager";
  if (pathname.includes("/admin/settings")) return "Platform Settings";
  return "Dashboard Overview";
}

function NavItem({ href, icon, label, active = false, onClick }: { href: string; icon: ReactNode; label: string; active?: boolean, onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = active || (href !== "#" && pathname === href);
  return (
    <Link href={href} onClick={onClick} data-active={isActive} className="admin-nav-link no-underline text-inherit">
      <span className="admin-nav-icon">{icon}</span>
      <span className="flex-1">{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 text-[var(--admin-primary)]/40 flex-shrink-0" />}
    </Link>
  );
}
