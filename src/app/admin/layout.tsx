"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Gamepad2, Settings, BarChart3, LogOut, Key, Menu, X, DollarSign, Power } from "lucide-react";
import Image from "next/image";
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'] });

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login' || pathname === '/admin/setup') {
    return <div className={`h-screen bg-[#F5F5F7] ${nunito.className}`}>{children}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`flex h-screen bg-[#F5F5F7] text-slate-900 overflow-hidden ${nunito.className}`}>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem href="/admin" icon={<Home size={20} color="#007AFF" />} label="Dashboard" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/licenses" icon={<Key size={20} color="#FF9500" />} label="License Keys" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/users" icon={<Users size={20} color="#AF52DE" />} label="Users" onClick={() => setSidebarOpen(false)} />
          <NavItem href="/admin/revenue" icon={<DollarSign size={20} color="#34C759" />} label="Revenue" onClick={() => setSidebarOpen(false)} />
          <NavItem href="#" icon={<Gamepad2 size={20} color="#FF2D55" />} label="Games" />
          <NavItem href="/admin/settings" icon={<Settings size={20} color="#8E8E93" />} label="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 shrink-0">
          <div className="flex-1 flex items-center">
            <button className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
          
          <div className="flex items-center justify-center">
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
              className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors border-2 border-white shadow-sm ring-2 ring-slate-100"
              title="Logout"
            >
              <Power size={20} strokeWidth={2.5} />
            </button>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false, onClick }: { href: string; icon: ReactNode; label: string; active?: boolean, onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all ${
      active 
        ? "bg-blue-50 text-blue-600 shadow-sm" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
