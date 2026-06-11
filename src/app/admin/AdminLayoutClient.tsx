"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Gamepad2, Settings, LogOut, Key, Menu, X, DollarSign, Power, Sparkles } from "lucide-react";
import Image from "next/image";
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
    return <div className={`min-h-screen bg-[var(--admin-bg)] ${nunito.className}`}>{children}</div>;
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
    <div className={`admin-shell flex h-screen text-slate-900 overflow-hidden ${nunito.className}`}>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-[280px] bg-white/95 border-r border-slate-200 flex flex-col transition-transform duration-300 ease-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-slate-100 flex justify-start items-center relative">
          <Link href="/admin" className="flex items-center pl-1">
            <div className="relative w-36 h-12">
              <Image 
                src="/duner/main_logo.png" 
                alt="Main Logo" 
                fill 
                className="object-contain object-left"
                priority
                sizes="(max-width: 768px) 144px, 144px"
              />
            </div>
          </Link>
          <button className="md:hidden text-slate-500 absolute right-4" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="px-5 pt-4">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
            <div className="flex items-center gap-2 text-blue-700">
              <Sparkles size={16} />
              <span className="text-xs font-black uppercase tracking-wide">Admin Control</span>
            </div>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">Manage keys, users, revenue, and site settings.</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto hide-scrollbar">
          <NavItem href="/admin" icon={<Home size={19} />} label="Dashboard" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/licenses" icon={<Key size={19} />} label="License Keys" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/users" icon={<Users size={19} />} label="Users" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/revenue" icon={<DollarSign size={19} />} label="Revenue" onClick={() => setSidebarOpen(false)} />
          <AdminBlogNav onNavigate={() => setSidebarOpen(false)} />
          <NavItem href="#" icon={<Gamepad2 size={19} />} label="Games" />
          <NavItem href="/admin/settings" icon={<Settings size={19} />} label="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <button 
            onClick={handleLogout}
            className="admin-action flex items-center gap-3 w-full p-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-bold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="admin-header h-16 bg-white/88 border-b border-slate-200 flex items-center px-4 md:px-6 shrink-0">
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <button className="md:hidden p-2 text-slate-600 rounded-xl hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden sm:block min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">Wingo Signal</p>
              <h2 className="truncate text-sm font-black text-slate-900 md:text-base">{pageTitle}</h2>
            </div>
          </div>
          
          <div className="flex items-center justify-center md:hidden">
            <div className="relative w-36 h-10">
              <Image 
                src="/duner/main_logo.png" 
                alt="Main Logo" 
                fill 
                className="object-contain"
                priority
                sizes="(max-width: 768px) 144px, 144px"
              />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end gap-4">
            <button 
              onClick={handleLogout}
              className="admin-action w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors border border-red-100 shadow-sm"
              title="Logout"
            >
              <Power size={20} strokeWidth={2.5} />
            </button>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="admin-content flex-1 overflow-y-auto p-4 sm:p-5 md:p-8">
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
        ? "bg-blue-50 text-blue-700 shadow-sm" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
    }`} style={{ textDecoration: "none" }}>
      <span className={`${isActive ? "text-blue-600" : "text-slate-400"} transition-colors`}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
