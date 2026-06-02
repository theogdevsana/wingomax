"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

export default function SiteFooter({ className = "" }) {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Refund", href: "/refund" },
    { label: "Sitemap", href: "/sitemap" },
  ];

  const desktopNavLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <>
      {/* Mobile Footer */}
      <footer className={`md:hidden ${className}`} style={{ background: "#111827", borderTop: "1px solid var(--border)", padding: "28px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image src="/logo/main_logo.png" alt="Wingo Signal" width={120} height={24} style={{ objectFit: "contain" }} priority />
          </Link>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: "12px", fontWeight: 700, color: "#d1d5db", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>

          <div style={{ width: "100%", borderTop: "1px solid #1f2937", paddingTop: "14px", textAlign: "center" }}>
            <p style={{ fontSize: "11px", color: "#6b7280", fontWeight: 500 }}>© 2026 Wingo Signal • All rights reserved</p>
          </div>
        </div>
      </footer>

      {/* Desktop Footer */}
      <footer className={`hidden md:block ${className}`} style={{ background: "#111827", borderTop: "1px solid var(--border)", padding: "52px 24px 32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
            {/* Brand */}
            <div>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: "16px" }}>
                <Image src="/logo/main_logo.png" alt="Wingo Signal" width={160} height={32} style={{ objectFit: "contain" }} priority />
              </Link>
              <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.7, maxWidth: "300px" }}>
                The most trusted AI powered Wingo prediction platform for 91Club, Tiranga, BDG Win, and 10+ gaming platforms.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p style={{ fontWeight: 800, fontSize: "13px", color: "#ffffff", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "18px" }}>Navigation</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {desktopNavLinks.map((item) => (
                  <Link key={item.href} href={item.href}
                    style={{ fontSize: "14px", color: "#9ca3af", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#d1d5db")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <p style={{ fontWeight: 800, fontSize: "13px", color: "#ffffff", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "18px" }}>Legal</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Refund Policy", href: "/refund" },
                  { label: "Sitemap", href: "/sitemap" },
                ].map((l) => (
                  <Link key={l.href} href={l.href}
                    style={{ fontSize: "14px", color: "#9ca3af", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#d1d5db")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #374151", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <p style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>
              © 2026 Wingo Signal. All rights reserved.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>
              <GlobeIcon />
              wingosignals.xyz
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
