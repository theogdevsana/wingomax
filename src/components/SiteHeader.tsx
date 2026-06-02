"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy", href: "/privacy" },
];

export default function SiteHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <>
      <style>{`
        .sh-wrap { position: sticky; top: 0; z-index: 100; background: #fff; border-bottom: 1px solid #e2e5ec; box-shadow: 0 1px 8px rgba(0,0,0,0.04); transition: all 0.3s ease; }
        .sh-inner { max-width: 1160px; margin: 0 auto; padding: 0 24px; height: 66px; display: flex; align-items: center; justify-content: space-between; position: relative; }
        .sh-hamburger { display: flex; background: none; border: none; cursor: pointer; color: #0f1117; padding: 0; }
        .sh-logo { flex: 1; display: flex; justify-content: center; align-items: center; text-decoration: none; flex-shrink: 0; position: relative; z-index: 2; }
        .sh-nav { display: none; gap: 28px; align-items: center; }
        .sh-cta { display: none; padding: 8px 18px; font-size: 12px; background: #C6FF33; color: #1a202c; text-decoration: none; font-weight: 800; letter-spacing: 0.3px; align-items: center; overflow: hidden; border-radius: 6px; position: relative; }
        @media (min-width: 769px) {
          .sh-hamburger { display: none; }
          .sh-logo { flex: initial; justify-content: flex-start; }
          .sh-nav { display: flex; }
          .sh-cta { display: inline-flex; }
        }
      `}</style>
      <header className="sh-wrap">
        <div className="sh-inner">
          <button onClick={onMenuClick} aria-label="Open menu" className="sh-hamburger">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"></path>
            </svg>
          </button>

          <Link href="/" className="sh-logo">
            <div style={{ width: "160px", height: "32px", position: "relative" }}>
              <Image src="/logo/main_logo.png" alt="Wingo Signal" fill sizes="160px" style={{ objectFit: "contain" }} priority />
            </div>
          </Link>

          <nav className="sh-nav">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link key={href} href={href}
                style={{
                  color: href === "/" ? "#007AFF" : "#3C3C43",
                  fontWeight: href === "/" ? 700 : 600,
                  fontSize: "14px",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => { if (href !== "/") e.currentTarget.style.color = "#007AFF" }}
                onMouseLeave={e => { if (href !== "/") e.currentTarget.style.color = "#3C3C43" }}
              >{label}</Link>
            ))}
          </nav>

          <Link href="/login" id="header-cta" className="sh-cta">
            <span className="absolute top-0 right-0 inline-block w-3 h-3 transition-all duration-500 ease-in-out rounded" style={{ background: "#b8f020" }}>
              <span className="absolute top-0 right-0 w-4 h-4 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#8cba20" }}></span>
            </span>
            <span className="absolute bottom-0 rotate-180 left-0 inline-block w-3 h-3 transition-all duration-500 ease-in-out rounded" style={{ background: "#b8f020" }}>
              <span className="absolute top-0 right-0 w-4 h-4 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#8cba20" }}></span>
            </span>
            <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-md group-hover:translate-x-0" style={{ background: "#a8e020" }}></span>
            <span className="relative w-full text-center transition-colors duration-200 ease-in-out group-hover:text-white" style={{ fontWeight: 800 }}>Get Access</span>
          </Link>
        </div>
      </header>
    </>
  );
}
