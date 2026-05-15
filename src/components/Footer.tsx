"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`bg-[#111827] text-white py-6 mt-20 ${className}`}>
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6">
        {/* Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 transition-all duration-300 group-hover:scale-110 relative">
            <Image 
              src="/logo/official-logo.png" 
              alt="Wingo Signal" 
              width={40} 
              height={40} 
              className="w-full h-full object-contain rounded-lg" 
            />
          </div>
          <span className="font-bold tracking-tighter text-lg md:text-xl text-white">Wingo Signal</span>
        </Link>

        {/* Navigation Links in 3 Rows */}
        <nav className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <Link href="/" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Wingo Blog</Link>
            <Link href="/faq" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Support Center</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <Link href="/wingo-30-seconds-prediction" className="text-[10px] md:text-xs font-bold text-indigo-400 hover:text-white transition-colors">WinGo 30s</Link>
            <Link href="/wingo-1-minute-prediction" className="text-[10px] md:text-xs font-bold text-indigo-400 hover:text-white transition-colors">WinGo 1m</Link>
            <Link href="/wingo-3-minute-prediction" className="text-[10px] md:text-xs font-bold text-indigo-400 hover:text-white transition-colors">WinGo 3m</Link>
            <Link href="/wingo-5-minute-prediction" className="text-[10px] md:text-xs font-bold text-indigo-400 hover:text-white transition-colors">WinGo 5m</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <Link href="/privacy" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/sitemap.xml" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Sitemap</Link>
          </div>
        </nav>

        {/* Copyright Section */}
        <div className="w-full border-t border-white/5 pt-4 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            © 2026 Wingo Signal • All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
