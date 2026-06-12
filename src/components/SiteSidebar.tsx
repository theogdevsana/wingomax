"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" fill="rgba(120,120,128,0.08)" />
    <line x1="8" y1="8" x2="16" y2="16" />
    <line x1="16" y1="8" x2="8" y2="16" />
  </svg>
);

const navItems = [
  { label: "Home", href: "/", icon: "home" },
  { label: "About", href: "/about", icon: "home" },
  { label: "Blog", href: "/blog", icon: "blog" },
  { label: "FAQ", href: "/faq", icon: "faq" },
  { label: "Privacy", href: "/privacy", icon: "privacy" },
  { label: "Login", href: "/login", icon: "download" },
];

const NavIcon = ({ icon, color }: { icon: string; color: string }) => {
  if (icon === "blog") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
  if (icon === "faq") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
  if (icon === "privacy") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
  if (icon === "download") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  );
};

export default function SiteSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 200,
        height: "100dvh",
        minHeight: "100dvh",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.3s",
      }} />

      <div role="dialog" aria-modal="true" aria-label="Navigation" style={{
        position: "fixed", top: 0, right: 0, zIndex: 300,
        width: "min(300px, 82vw)",
        height: "100dvh",
        minHeight: "100dvh",
        maxHeight: "100dvh",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(24px) saturate(1.2)",
        WebkitBackdropFilter: "blur(24px) saturate(1.2)",
        borderLeft: "1px solid rgba(60,60,67,0.08)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        overscrollBehavior: "contain",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "calc(22px + env(safe-area-inset-top, 0px)) 20px 14px", flexShrink: 0 }}>
          <Link href="/" onClick={onClose} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image src="/logo/main_logo.png" alt="Wingo Signal" width={120} height={24} style={{ objectFit: "contain" }} priority />
          </Link>
          <button onClick={onClose} aria-label="Close menu"
            style={{ background: "none", border: "none", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3C3C43" }}>
            <CloseIcon />
          </button>
        </div>

        <nav style={{ padding: "6px 14px", flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map(({ label, href, icon }) => {
            const iconColor =
              href === "/" ? "#007AFF" :
              href === "/blog" ? "#AF52DE" :
              href === "/faq" ? "#FF9500" :
              href === "/privacy" ? "#5856D6" :
              href === "/login" ? "#34C759" : "#007AFF";
            const active = href === "/";
            return (
              <Link key={href} href={href} onClick={onClose} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "12px",
                textDecoration: "none",
                background: active ? `${iconColor}12` : "transparent",
                color: active ? iconColor : "#3C3C43",
                fontWeight: active ? 700 : 500,
                fontSize: "15px",
                transition: "all 0.2s",
              }}>
                <span style={{ color: iconColor, opacity: active ? 1 : 0.8 }}>
                  <NavIcon icon={icon} color={iconColor} />
                </span>
                {label}
              </Link>
            );
          })}

          <div style={{ height: "1px", background: "rgba(60,60,67,0.08)", margin: "8px 0" }} />

          <span style={{ fontSize: "11px", fontWeight: 600, color: "#8E8E93", textTransform: "uppercase", letterSpacing: "0.5px", padding: "8px 14px 4px" }}>Predictions</span>
          {[
            { label: "30 Sec", href: "/wingo-30-seconds-prediction", color: "#007AFF" },
            { label: "1 Min", href: "/wingo-1-minute-prediction", color: "#AF52DE" },
            { label: "3 Min", href: "/wingo-3-minute-prediction", color: "#FF9500" },
            { label: "5 Min", href: "/wingo-5-minute-prediction", color: "#34C759" },
          ].map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 14px", borderRadius: "12px",
              textDecoration: "none", color: "#3C3C43",
              fontWeight: 500, fontSize: "15px",
              transition: "all 0.2s",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "6px 16px calc(28px + env(safe-area-inset-bottom, 0px))", borderTop: "1px solid rgba(60,60,67,0.08)", flexShrink: 0 }}>
          <Link href="/login" onClick={onClose} style={{
            width: "100%", padding: "13px 20px", fontSize: "14px",
            background: "#007AFF", color: "#fff", textDecoration: "none",
            fontWeight: 700, justifyContent: "center", letterSpacing: "0.3px",
            boxShadow: "0 4px 12px rgba(0,122,255,0.3)",
            display: "flex", alignItems: "center", borderRadius: "12px",
            border: "none", cursor: "pointer",
          }}>
            Get Free Access
          </Link>
        </div>
      </div>
    </>
  );
}
