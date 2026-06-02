"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, LayoutGrid, FileText, ShieldCheck, X, Home, BookOpen, Clock, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const PREDICTION_PAGES = [
  { label: 'Wingo 30s', href: '/wingo-30-seconds-prediction', icon: Clock },
  { label: 'Wingo 1 Min', href: '/wingo-1-minute-prediction', icon: Timer },
  { label: 'Wingo 3 Min', href: '/wingo-3-minute-prediction', icon: Timer },
  { label: 'Wingo 5 Min', href: '/wingo-5-minute-prediction', icon: Timer },
];

import SiteFooter from '@/components/SiteFooter';

export default function BlogLayoutClient({
  children,
  telegramLink
}: {
  children: React.ReactNode;
  telegramLink: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:text-base text-sm">
      {/* Blog Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="w-full px-4 md:px-8 h-16 flex items-center relative">
          {/* Hamburger Menu Toggle - NOW ON LEFT */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-slate-800 p-2.5 hover:bg-slate-100 rounded-xl transition-colors z-10 flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Open navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"></path>
            </svg>
          </button>

          <Link href="/blog" className="absolute left-1/2 -translate-x-1/2">
            <Image 
              src="/duner/wingo-blog.png" 
              alt="Wingo Blog" 
              width={160} 
              height={48} 
              priority 
              className="h-8 md:h-12 w-auto object-contain" 
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </div>
      </header>

      {/* Side Menu Overlay - NOW FROM LEFT */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />
            
            {/* Menu Panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] md:w-[320px] bg-white z-[70] shadow-2xl flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <Image 
                  src="/duner/wingo-blog.png" 
                  alt="Wingo Blog Logo" 
                  width={140} 
                  height={40} 
                  className="h-8 md:h-10 w-auto object-contain" 
                  style={{ width: 'auto', height: 'auto' }}
                />
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-2.5 text-slate-500 hover:text-slate-900 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close navigation menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <Link 
                  href="/"  
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 md:p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Home size={18} />
                  </div>
                  <span className="font-bold text-slate-700 text-xs md:text-sm">Home</span>
                </Link>

                <Link 
                  href="/blog" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 md:p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <BookOpen size={18} />
                  </div>
                  <span className="font-bold text-slate-700 text-xs md:text-sm">Wingo Blog</span>
                </Link>

                <div className="my-4 h-px bg-slate-100 mx-4" aria-hidden="true" />
                <span className="px-4 text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Prediction Tools</span>

                {PREDICTION_PAGES.map((page) => (
                  <Link 
                    key={page.href}
                    href={page.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 md:p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <page.icon size={18} />
                    </div>
                    <span className="font-bold text-slate-700 text-xs md:text-sm">{page.label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <Link 
                  href={telegramLink}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl text-[11px] md:text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={16} /> Join Telegram
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Blog Content */}
      <main className="flex-grow">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
