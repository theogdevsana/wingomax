"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Gamepad2, Settings, LogOut, Key, Menu, X, DollarSign, Zap, ChevronRight, ArrowLeft } from "lucide-react";
import { Nunito } from 'next/font/google';
import AdminBlogNav from "./AdminBlogNav";
import { getApiUrl } from "@/lib/api-utils";
import "./admin-fixes.css";

const nunito = Nunito({ subsets: ['latin'] });

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
    return <div className={`min-h-[100dvh] bg-[var(--admin-bg)] ${nunito.className}`}>{children}</div>;
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
    <div className={`admin-shell flex h-[100dvh] min-h-[100dvh] text-slate-900 overflow-hidden ${nunito.className}`}>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 h-[100dvh] bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar fixed inset-y-0 left-0 z-50 h-[100dvh] max-h-[100dvh] w-[280px] bg-white/80 backdrop-blur-xl border-r border-black/5 flex flex-col overflow-hidden transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="shrink-0 px-6 h-16 border-b border-black/5 flex items-center gap-3 relative">
          <Link href="/admin" className="flex min-w-0 flex-1 items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7B5EA7] to-[#9B7FBF] flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-gray-900 tracking-tight truncate">Wingo Admin</div>
              <div className="text-[10px] text-gray-400 font-medium -mt-0.5 truncate">Management Panel</div>
            </div>
          </Link>
          <button className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-gray-100" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overscroll-contain px-3 py-4 space-y-1 overflow-y-auto hide-scrollbar">
          <NavItem href="/admin" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/licenses" icon={<Key className="w-5 h-5" />} label="License Keys" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/users" icon={<Users className="w-5 h-5" />} label="Users" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/revenue" icon={<DollarSign className="w-5 h-5" />} label="Revenue" onClick={() => setSidebarOpen(false)} />
          <AdminBlogNav onNavigate={() => setSidebarOpen(false)} />
          <NavItem href="#" icon={<Gamepad2 className="w-5 h-5" />} label="Games" />
          <NavItem href="/admin/settings" icon={<Settings className="w-5 h-5" />} label="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="shrink-0 px-4 py-4 border-t border-black/5 space-y-1">
          <button 
            onClick={handleLogout}
            className="admin-action flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <Link href="/" className="admin-action flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main flex-1 flex flex-col h-[100dvh] min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="admin-header h-14 bg-[#f2f2f7]/80 border-b border-black/5 flex items-center px-4 lg:hidden shrink-0">
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <button className="p-2 -ml-2 text-gray-600 rounded-xl hover:bg-gray-200/50" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7B5EA7] to-[#9B7FBF] flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="truncate text-sm font-bold text-gray-900">{pageTitle}</span>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="admin-content flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
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
  if (pathname.includes("/admin/blogs")) return "Blog Manager";
  if (pathname.includes("/admin/settings")) return "Platform Settings";
  return "Dashboard Overview";
}

function NavItem({ href, icon, label, active = false, onClick }: { href: string; icon: ReactNode; label: string; active?: boolean, onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = active || (href !== "#" && pathname === href);
  return (
    <Link href={href} onClick={onClick} data-active={isActive} className={`admin-nav-link no-underline flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
      isActive
        ? "bg-[#7B5EA7]/10 text-[#7B5EA7]" 
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    }`} style={{ textDecoration: "none" }}>
      <span className={`${isActive ? "text-[#7B5EA7]" : "text-gray-400"} transition-colors`}>{icon}</span>
      <span>{label}</span>
      {isActive && <ChevronRight className="w-4 h-4 ml-auto text-[#7B5EA7]/50" />}
    </Link>
  );
}
