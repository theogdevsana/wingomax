"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`bg-[#111827] text-white py-6 mt-20 ${className}`}>
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6">
        {/* Logo & Name */}
        <Link href="/" className="flex items-center group">
          <div className="transition-all duration-300 group-hover:scale-110 relative">
            <Image 
              src="/logo/main_logo.png" 
              alt="Wingo Signal" 
              width={120}
              height={24}
              className="object-contain" 
            />
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <Link href="/" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">About</Link>
            <Link href="/" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Blog</Link>
            <Link href="/faq" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">FAQ</Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <Link href="/wingo-30-seconds-prediction" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">30s Prediction</Link>
            <Link href="/wingo-1-minute-prediction" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">1 Min Prediction</Link>
            <Link href="/wingo-3-minute-prediction" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">3 Min Prediction</Link>
            <Link href="/wingo-5-minute-prediction" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">5 Min Prediction</Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <Link href="/privacy" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/refund" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/sitemap" className="text-[10px] md:text-xs font-bold text-slate-400 hover:text-white transition-colors">Sitemap</Link>
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
