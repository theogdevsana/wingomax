"use client";

import React, { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteSidebar from '@/components/SiteSidebar';
import SiteFooter from '@/components/SiteFooter';

export default function BlogLayoutClient({
  children,
}: {
  children: React.ReactNode;
  telegramLink: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:text-base text-sm">
      <SiteHeader onMenuClick={() => setIsMenuOpen(true)} />

      <SiteSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-grow">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
