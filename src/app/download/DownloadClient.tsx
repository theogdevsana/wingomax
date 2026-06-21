"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./DownloadClient.module.css";
import { BLOG_POSTS } from "@/lib/blogs";
import SiteFooter from "@/components/SiteFooter";

// ─── SVG Icon Library ─────────────────────────────────────────────────────────

const Icons = {
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"></path>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill="rgba(120,120,128,0.08)" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="16" y1="8" x2="8" y2="16" />
    </svg>
  ),
  Home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <polyline points="9 21 9 12 15 12 15 21" />
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Blog: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  ),
  Faq: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  Privacy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Target: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Zap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" strokeWidth="2" />
    </svg>
  ),
  Mobile: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  Brain: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.74 3 3 0 0 1 .79-5.68 2.5 2.5 0 0 1 1.7-3.62z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.74 3 3 0 0 0-.79-5.68 2.5 2.5 0 0 0-1.7-3.62z" />
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Quote: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" opacity="0.08">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Minus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Telegram: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Home", href: "/", Icon: Icons.Home },
  { label: "About", href: "/about", Icon: Icons.Home },
  { label: "Blog", href: "/blog", Icon: Icons.Blog },
  { label: "FAQ", href: "/faq", Icon: Icons.Faq },
  { label: "Privacy", href: "/privacy", Icon: Icons.Privacy },
];

const FEATURES = [
  {
    Icon: Icons.Target,
    color: "#007AFF",
    title: "Wingo Prediction Context",
    description:
      "Review Wingo prediction signals beside recent colour, number, and big-small history so every estimate has visible context before you act.",
  },
  {
    Icon: Icons.Zap,
    color: "#FF9500",
    title: "Real-Time Result History",
    description:
      "The dashboard keeps period timing and recent result rows close together for 30 second, 1 minute, 3 minute, and 5 minute Wingo rounds.",
  },
  {
    Icon: Icons.Shield,
    color: "#34C759",
    title: "Secure & Private",
    description:
      "No APK installation is required. The dashboard runs in your browser and uses standard secure web transport for account requests.",
  },
  {
    Icon: Icons.Mobile,
    color: "#00B0FF",
    title: "Works on Any Device",
    description:
      "A fully responsive web app. Open it on your Android, iPhone, tablet, or laptop. No installation required. Your session syncs across all devices automatically.",
  },
  {
    Icon: Icons.Brain,
    color: "#AF52DE",
    title: "AI-Assisted Pattern Review",
    description:
      "The Wingo AI prediction view highlights big/small streaks, colour repetition, and number clusters as statistical context, not as a guaranteed future result.",
  },
  {
    Icon: Icons.Users,
    color: "#1B7A2B",
    title: "India-Focused Wingo Signals",
    description:
      "Built for fast mobile browsing across India and nearby regions, with focused pages for Wingo 1 minute prediction and other popular round speeds.",
  },
];

const PLATFORMS = [
  { name: "91Club", logo: "/logo/91club.png", alt: "91Club Prediction" },
  { name: "Tiranga", logo: "/logo/tiranga.png", alt: "Tiranga Games Prediction" },
  { name: "BDG Win", logo: "/logo/bdg_win.png", alt: "BDG Win Signal" },
  { name: "82 Lottery", logo: "/logo/82_lottery.png", alt: "82 Lottery Signal" },
  { name: "Jai Club", logo: "/logo/jai_club.png", alt: "Jai Club Prediction" },
  { name: "Yarr Win", logo: "/logo/yarr_win.png", alt: "Yarr Win Signal" },
];

const STEPS = [
  { n: "01", title: "Contact on Telegram", body: "Reach out on Telegram to purchase your license key. Our support team will guide you through the process and activate your access instantly." },
  { n: "02", title: "Select Your Platform", body: "Choose from 91Club, Tiranga, BDG Win, 82 Lottery, or any of the 10+ supported platforms. Switch freely at any time." },
  { n: "03", title: "Review the Signal", body: "Read the AI-assisted colour, number, and big-small estimate with the latest history rows before deciding what to do next." },
  { n: "04", title: "Track the Outcome", body: "Use the history dashboard to compare signals against completed periods and learn how each round speed behaves over time." },
];

const TESTIMONIALS = [
  { name: "Rahul M.", loc: "Mumbai, India", rating: 5, text: "The 1-minute page is easy to read on mobile. I like that the signal and recent Wingo history stay on one screen." },
  { name: "Priya S.", loc: "Delhi, India", rating: 5, text: "Clean interface, clear colour history, and no APK download. It feels much safer than random Wingo signal files shared in groups." },
  { name: "Arif H.", loc: "Dhaka, Bangladesh", rating: 5, text: "The Tiranga 3-minute view gives enough time to compare recent results before a round closes. Support also responds quickly." },
  { name: "Vikram R.", loc: "Hyderabad, India", rating: 5, text: "The AI signal is useful because it explains the pattern context. I still treat it as probability, not a guarantee." },
];

const FAQS = [
  { q: "Is an APK required?", a: "No. Wingo Signal runs in a supported browser. Avoid unofficial downloads that claim to represent the service." },
  { q: "Which platforms does Wingo Signal support?", a: "We support 91Club, Tiranga Games, BDG Win, 82 Lottery, Jai Club, Yarr Win, Raja Game, Jalwa Game, GOA Game, Sikkim Games, and Tashan Win, with more platforms added regularly." },
  { q: "What prediction intervals are available?", a: "Wingo Signal covers 30 second, Wingo 1 minute prediction, 3 minute, and 5 minute Wingo rounds. Each interval has its own history and statistical signal page." },
  { q: "Are predictions guaranteed?", a: "No. Signals are statistical estimates based on available history and can be wrong." },
  { q: "Do I need to download an app?", a: "No download is needed. Wingo Signal runs entirely in your browser. Open wingosignals.com on any device, Android, iPhone, tablet, or desktop, and start immediately." },
  { q: "Can I use it on multiple devices at the same time?", a: "Yes. Your subscription works across all your devices simultaneously. Log in on your phone during your commute and continue on a tablet at home with no interruption." },
];

const TRUST_BADGES = [
  "Official wingosignals.com",
  "All devices supported",
  "No APK download",
  "Transparent estimates",
  "Mobile-first layout",
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function DownloadClient({ telegramLink = "https://t.me/enzosrs" }: { telegramLink?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>


      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text1)", fontFamily: "var(--font-nunito), system-ui, sans-serif", overflowX: "hidden" }}>

        {/* ── JSON-LD ─────────────────────────────────────────────────────── */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Wingo Signal",
            "operatingSystem": "Web, Android, iOS",
            "applicationCategory": "GameApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
            "description": "Wingo Signal is the official browser-based Wingo prediction, Wingo 1 minute prediction, colour prediction, and statistical signal dashboard.",
            "url": "https://wingosignals.com",
            "featureList": [
              "Wingo prediction",
              "Wingo 1 minute prediction",
              "Wingo colour prediction",
              "Wingo AI prediction context",
              "Recent Wingo result history"
            ]
          })
        }} />

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "#ffffff",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
          transition: "all 0.3s ease",
        }}>
          <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "0 24px", height: "66px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>

            {/* Mobile toggle — left on mobile, hidden on desktop */}
            <button id="mobile-menu-open" onClick={() => setMenuOpen(true)} aria-label="Open menu"
              className={styles.mobileShow}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text1)", padding: 0 }}>
              <Icons.Menu />
            </button>

            {/* Logo — centered on mobile, left on desktop */}
            <Link href="/" className={styles.logoCenterMobile} style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0, position: "relative", zIndex: 2 }}>
              <div className={styles.headerLogoWrap}>
                <Image src="/logo/main_logo.png" alt="Wingo Signal" fill sizes="160px" style={{ objectFit: "contain" }} priority />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className={styles.desktopOnly} style={{ gap: "28px" }}>
              {NAV_ITEMS.map(({ label, href }) => (
                <Link key={href} href={href} className={`${styles.navLink}${href === "/" ? ` ${styles.navLinkActive}` : ""}`}>{label}</Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <Link href="/login" id="header-cta" className={`relative flex items-center overflow-hidden font-medium transition-all rounded-md group ${styles.desktopOnly}`} style={{ padding: "8px 18px", fontSize: "12px", background: "#C6FF33", color: "#1a202c", textDecoration: "none", fontWeight: 800, letterSpacing: "0.3px" }}>
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

        {/* ── MOBILE SIDE MENU ────────────────────────────────────────────── */}
        {/* Overlay */}
        <div onClick={() => setMenuOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 200,
          height: "100dvh",
          minHeight: "100dvh",
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.3s",
        }} />

        {/* Drawer */}
        <div ref={menuRef} role="dialog" aria-modal="true" aria-label="Navigation" style={{
          position: "fixed", top: 0, right: 0, zIndex: 300,
          width: "min(300px, 82vw)",
          height: "100dvh",
          minHeight: "100dvh",
          maxHeight: "100dvh",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(24px) saturate(1.2)",
          WebkitBackdropFilter: "blur(24px) saturate(1.2)",
          borderLeft: "1px solid rgba(60,60,67,0.08)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          overscrollBehavior: "contain",
        }}>
          {/* Drawer header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "calc(22px + env(safe-area-inset-top, 0px)) 20px 14px", flexShrink: 0 }}>
            <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <Image src="/logo/main_logo.png" alt="Wingo Signal" width={120} height={24} style={{ objectFit: "contain" }} priority />
            </Link>
            <button id="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"
              style={{ background: "none", border: "none", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#3C3C43", transition: "color 0.2s" }}>
              <Icons.Close />
            </button>
          </div>

          {/* Drawer nav */}
          <nav style={{ padding: "6px 14px", flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", display: "flex", flexDirection: "column", gap: "2px" }}>
              {[
                  { label: "Home", href: "/", Icon: Icons.Home, iconColor: "#007AFF" },
                  { label: "About", href: "/about", Icon: Icons.Home, iconColor: "#007AFF" },
                  { label: "Blog", href: "/blog", Icon: Icons.Blog, iconColor: "#AF52DE" },
                  { label: "FAQ", href: "/faq", Icon: Icons.Faq, iconColor: "#FF9500" },
                  { label: "Privacy", href: "/privacy", Icon: Icons.Privacy, iconColor: "#5856D6" },
                  { label: "Login", href: "/login", Icon: Icons.Download, iconColor: "#34C759" },
                ].map(({ label, href, Icon, iconColor }) => {
                  const active = href === "/";
              return (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
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
                    <Icon />
                  </span>
                  {label}
                </Link>
              );
            })}

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(60,60,67,0.08)", margin: "8px 0" }} />

            {/* Prediction Links */}
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#8E8E93", textTransform: "uppercase", letterSpacing: "0.5px", padding: "8px 14px 4px" }}>Predictions</span>
            {[
              { label: "30 Sec", href: "/wingo-30-seconds-prediction", color: "#007AFF" },
              { label: "1 Min", href: "/wingo-1-minute-prediction", color: "#AF52DE" },
              { label: "3 Min", href: "/wingo-3-minute-prediction", color: "#FF9500" },
              { label: "5 Min", href: "/wingo-5-minute-prediction", color: "#34C759" },
            ].map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{
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
              </a>
            ))}
          </nav>

          {/* Drawer footer */}
          <div style={{ padding: "6px 16px calc(28px + env(safe-area-inset-bottom, 0px))", borderTop: "1px solid rgba(60,60,67,0.08)", flexShrink: 0 }}>
            <Link href="/login" onClick={() => setMenuOpen(false)} className="relative flex items-center overflow-hidden font-medium transition-all rounded-xl group" style={{ width: "100%", padding: "13px 20px", fontSize: "14px", background: "#007AFF", color: "#fff", textDecoration: "none", fontWeight: 700, justifyContent: "center", letterSpacing: "0.3px", boxShadow: "0 4px 12px rgba(0,122,255,0.3)" }}>
              <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#0066d9" }}>
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#fff" }}></span>
              </span>
              <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#0066d9" }}>
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#fff" }}></span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-xl group-hover:translate-x-0" style={{ background: "#0055b3" }}></span>
              <span className="relative w-full text-center transition-colors duration-200 ease-in-out group-hover:text-white" style={{ fontWeight: 700 }}>Get Free Access</span>
            </Link>
          </div>
        </div>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section id="hero" className={styles.heroSection}>
          <div className={styles.heroGrid} style={{ maxWidth: "1160px", margin: "0 auto", width: "100%" }}>

            {/* Left - Text Column */}
            <div className={styles.heroTextCol} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
              <div className={styles.pill} style={{ marginBottom: "20px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34C759", position: "relative", flexShrink: 0 }} className={styles.liveDot} />
                Official wingosignals.com · AI statistical signals
              </div>

              <h1 style={{ fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 900, color: "var(--text1)", lineHeight: 1.15, letterSpacing: "-0.8px", marginBottom: "14px" }}>
                Wingo Prediction{" "}
                <span style={{ color: "#007AFF", fontWeight: 900 }}>by Wingo Signal AI</span>
              </h1>

              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.7, marginBottom: "28px", maxWidth: "520px" }}>
                Use the official <strong>wingosignals.com</strong> dashboard for <strong>wingo prediction</strong>, <strong>wingo 1 minute prediction</strong>, <strong>wingo colour prediction</strong>, and AI-assisted big-small signal context. No APK needed.
              </p>

              {/* CTA row */}
              <div className={styles.heroCtas} style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all rounded-md group" style={{ flex: 1, background: "#24A1DE", textDecoration: "none" }}>
                  <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#1d8ec4" }}>
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                  </span>
                  <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#1d8ec4" }}>
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-md group-hover:translate-x-0" style={{ background: "#1a7db5" }}></span>
                  <span className="relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-white" style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "0.5px" }}>Join Telegram</span>
                </a>
                <Link href="/login" className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all rounded-md group" style={{ flex: 1, background: "#6366F1", textDecoration: "none" }}>
                  <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#5558E6" }}>
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                  </span>
                  <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#5558E6" }}>
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-md group-hover:translate-x-0" style={{ background: "#4F46E5" }}></span>
                  <span className="relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-white" style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "0.5px" }}>Login</span>
                </Link>
              </div>

              {/* Trust line */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {TRUST_BADGES.map((b) => (
                  <span key={b} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text2)", fontWeight: 500 }}>
                    <span style={{ color: "#34C759" }}><Icons.Check /></span>
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - Image Column */}
            <div className={styles.heroImgCol} style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "relative", width: "100%", maxWidth: "480px", aspectRatio: "1.3" }}
              >
                <Image src="/logo/hero.png" alt="Wingo Signal AI prediction dashboard for Wingo colour prediction" fill sizes="(max-width: 768px) 100vw, 480px" style={{ objectFit: "contain" }} priority />
              </motion.div>
            </div>

          </div>
        </section>

        {/* ── SIGNALS COUNTER ────────────────────────────────────────────── */}
        {/* ── GAME MODES ──────────────────────────────────────────────────── */}
        <section style={{ padding: "48px 24px", background: "var(--bg)" }}>
          <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div className={styles.pill} style={{ marginBottom: "14px" }}>Predictions</div>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 900, color: "var(--text1)", letterSpacing: "-0.8px" }}>
                Choose Your{" "}
                <span className={styles.gradText}>Game Mode</span>
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text2)", marginTop: "10px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                Choose the Wingo prediction page that matches your round speed and review recent history before using any signal.
              </p>
            </div>
            <div className={styles.gameModesGrid}>
              {[
                { label: "30 Sec", sub: "Fast rounds, quick results", href: "/wingo-30-seconds-prediction", grad: "linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)" },
                { label: "1 Min", sub: "Popular Wingo 1 minute prediction", href: "/wingo-1-minute-prediction", grad: "linear-gradient(135deg, #AF52DE 0%, #FF6BCB 100%)" },
                { label: "3 Min", sub: "More time for history review", href: "/wingo-3-minute-prediction", grad: "linear-gradient(135deg, #FF9500 0%, #FFD60A 100%)" },
                { label: "5 Min", sub: "Slower statistical signal mode", href: "/wingo-5-minute-prediction", grad: "linear-gradient(135deg, #34C759 0%, #30D158 100%)" },
              ].map((item) => (
                <a key={item.href} href={item.href} style={{
                  borderRadius: "20px", padding: "0",
                  display: "flex", flexDirection: "column",
                  textDecoration: "none", cursor: "pointer",
                  transition: "transform 0.25s, box-shadow 0.3s",
                  background: "#ffffff", border: "1px solid var(--border)",
                  overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}>
                  {/* Abstract header */}
                  <div style={{
                    height: "90px", position: "relative",
                    background: item.grad,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    {/* Abstract blobs */}
                    <div style={{ position: "absolute", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", top: "-40px", right: "-30px" }} />
                    <div style={{ position: "absolute", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", bottom: "-20px", left: "-20px" }} />
                    <div style={{ position: "absolute", width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", top: "10px", left: "20%" }} />
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "relative", zIndex: 1 }}>
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  {/* Content */}
                  <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 900, color: "var(--text1)", letterSpacing: "-0.3px" }}>{item.label}</span>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text3)", lineHeight: 1.4 }}>{item.sub}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#7D39EB", display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
                      Predict Now <Icons.ArrowRight />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── TOPICAL AUTHORITY ───────────────────────────────────────────── */}
        <section id="wingo-prediction-guide" style={{ padding: "72px 24px", background: "#ffffff", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "22px", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className={styles.pill}>Official Wingo Signals</div>
              <h2 style={{ fontSize: "clamp(24px, 3.2vw, 38px)", fontWeight: 900, color: "var(--text1)", lineHeight: 1.18, margin: 0 }}>
                Wingo prediction, colour signals, and AI history review in one place
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.8, margin: 0 }}>
                Wingo Signal is built as a topical hub for users who search for <strong>wingo prediction</strong>, <strong>wingo 1 minute prediction</strong>, <strong>wingo signals</strong>, <strong>wingo colour prediction</strong>, and <strong>wingo ai prediction</strong>. Each page explains the round speed, shows recent result history, and keeps the statistical signal separate from any guarantee claim.
              </p>
              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.8, margin: 0 }}>
                Use the official domain, <strong>wingosignals.com</strong>, to avoid duplicate or copied pages. We organize Wingo data by period, colour, number, and big-small size so the content is useful for mobile readers, search engines, and AI answer engines.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {[
                { title: "Wingo 1 Minute Prediction", body: "The most searched round speed, focused on recent 1-minute result history, colour context, and big-small signal review.", href: "/wingo-1-minute-prediction" },
                { title: "Wingo Colour Prediction", body: "Read red, green, and violet result patterns with the latest period rows instead of relying on unsourced social media signals.", href: "/wingo-30-seconds-prediction" },
                { title: "Wingo AI Prediction", body: "AI-assisted estimates are shown as statistical context with transparent limitations and responsible-use language.", href: "/blog/how-to-use-wingo-signal" },
              ].map((item) => (
                <Link key={item.title} href={item.href} className={styles.glass} style={{ display: "block", padding: "18px", borderRadius: "12px", textDecoration: "none", border: "1px solid var(--border)", background: "#fbfcff" }}>
                  <h3 style={{ margin: "0 0 8px", color: "var(--text1)", fontSize: "16px", fontWeight: 900 }}>{item.title}</h3>
                  <p style={{ margin: 0, color: "var(--text2)", fontSize: "13px", lineHeight: 1.65 }}>{item.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLATFORMS ───────────────────────────────────────────────────── */}
        <section id="platforms" style={{ padding: "48px 24px", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <p style={{ textAlign: "center", color: "var(--text3)", fontWeight: 700, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "28px" }}>
              Works with all major platforms
            </p>
            <div className={styles.platformGrid}>
              {PLATFORMS.map((p) => (
                <div key={p.name} className={`${styles.platformCard} ${styles.glass}`} style={{ borderRadius: "14px", width: "120px", cursor: "default", overflow: "hidden", position: "relative" }}>
                  {/* Full-fit image */}
                  <div style={{ width: "100%", aspectRatio: "1", position: "relative", overflow: "hidden" }}>
                    <Image src={p.logo} alt={p.alt} fill sizes="120px" style={{ objectFit: "cover" }} />
                    {/* Name overlay */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "6px 6px 7px",
                      background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 100%)",
                      display: "flex", alignItems: "flex-end", justifyContent: "center",
                    }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "#ffffff", letterSpacing: "0.3px", textAlign: "center", lineHeight: 1.2 }}>{p.name}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.glass} style={{ borderRadius: "14px", width: "120px", aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", border: "1px dashed var(--border2)" }}>
                <span style={{ fontSize: "20px", fontWeight: 900, color: "#7D39EB" }}>+5</span>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text3)", letterSpacing: "0.3px" }}>More Soon</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────── */}
        <section id="features" style={{ padding: "100px 24px", background: "var(--bg)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* Section heading */}
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <div className={styles.pill} style={{ marginBottom: "18px" }}>Features</div>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--text1)", letterSpacing: "-0.8px", marginBottom: "14px" }}>
                Why Thousands Choose{" "}
                <span style={{ color: "#007AFF" }} className="font-black">Wingo Signal</span>
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text2)", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
                We built Wingo Signal to solve one real problem: Wingo prediction pages should be fast, readable, transparent, and easy to compare with real result history.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "20px" }}>
              {FEATURES.map((f) => (
                <div key={f.title} className={`${styles.featureCard} ${styles.glass}`} style={{ borderRadius: "var(--radius-lg)", padding: "28px 26px" }}>
                  {/* Icon */}
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${f.color}20`, border: `1px solid ${f.color}40`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: "18px" }}>
                    <f.Icon />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text1)", marginBottom: "10px", letterSpacing: "-0.2px" }}>{f.title}</h3>
                  <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.75 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
        <section id="how-it-works" style={{ padding: "100px 24px", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <div className={styles.pill} style={{ marginBottom: "18px" }}>Process</div>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--text1)", letterSpacing: "-0.8px", marginBottom: "14px" }}>
                Start Winning in{" "}
                <span className={styles.gradText}>4 Simple Steps</span>
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text2)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
                Getting started takes under two minutes. No technical knowledge, no installs. Just open and predict.
              </p>
            </div>

            <div className={styles.stepsGrid} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", position: "relative" }}>
              {/* Background connector line */}
              <div className={styles.stepLine} style={{ position: "absolute", top: "28px", left: "calc(12.5%)", right: "calc(12.5%)", height: "1px", background: "linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent)", zIndex: 0 }} />

              {STEPS.map((s) => (
                <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#C6FF33", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px", color: "#1a2400", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                    {s.n}
                  </div>
                  <h3 style={{ fontSize: "14px", fontWeight: 800, color: "var(--text1)", marginBottom: "8px", letterSpacing: "-0.1px" }}>{s.title}</h3>
                  <p style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.7 }}>{s.body}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "52px" }}>
              <Link href="/wingo-1-minute-prediction" id="steps-cta" className="relative inline-flex items-center overflow-hidden font-medium transition-all rounded-md group" style={{ padding: "14px 32px", fontSize: "14px", background: "#C6FF33", color: "#1a202c", textDecoration: "none", fontWeight: 800, letterSpacing: "0.5px" }}>
                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#b8f020" }}>
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#8cba20" }}></span>
              </span>
              <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#b8f020" }}>
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#8cba20" }}></span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-md group-hover:translate-x-0" style={{ background: "#a8e020" }}></span>
              <span className="relative w-full text-center transition-colors duration-200 ease-in-out group-hover:text-white" style={{ fontWeight: 800 }}>Start Predicting Free</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <section id="stats" style={{ padding: "72px 24px", background: "var(--bg3)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div className={styles.statsGrid} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px", textAlign: "center" }}>
              {[
                { val: "4", label: "Round Formats", sub: "30s to 5 minutes" },
                { val: "10", label: "Recent Results", sub: "visible history context" },
                { val: "11+", label: "Platforms", sub: "91Club, Tiranga & more" },
                { val: "24/7", label: "Live Signals", sub: "never miss a round" },
              ].map((s, idx) => (
                <div key={s.label} style={{ borderRight: idx < 3 ? "1px solid var(--border)" : "none", paddingRight: "20px" }}>
                  <div style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, color: "#7D39EB", lineHeight: 1, letterSpacing: "-1px" }}>{s.val}</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text1)", marginTop: "8px" }}>{s.label}</div>
                  <div style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 500, marginTop: "4px" }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
        <section id="testimonials" style={{ padding: "100px 24px", background: "var(--bg)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <div className={styles.pill} style={{ marginBottom: "18px" }}>Testimonials</div>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--text1)", letterSpacing: "-0.8px", marginBottom: "14px" }}>
                Real Users.{" "}
                <span className={styles.gradText}>Real Results.</span>
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text2)", maxWidth: "400px", margin: "0 auto", lineHeight: 1.7 }}>
                Don&rsquo;t take our word for it. Here is what our community says.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className={`${styles.tCard} ${styles.glass}`} style={{ borderRadius: "var(--radius-lg)", padding: "26px 24px", position: "relative" }}>
                  {/* Quote mark */}
                  <div style={{ position: "absolute", top: "16px", right: "18px", color: "var(--text3)" }}>
                    <Icons.Quote />
                  </div>

                  {/* Stars */}
                  <div style={{ display: "flex", gap: "3px", marginBottom: "14px", color: "#fbbf24" }}>
                    {Array.from({ length: t.rating }).map((_, i) => <Icons.Star key={i} />)}
                  </div>

                  <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.75, marginBottom: "18px", fontStyle: "italic" }}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#f5f0ff", border: "1px solid #c5a8f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 900, color: "#7D39EB" }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "13px", color: "var(--text1)" }}>{t.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 500 }}>{t.loc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BLOG CARDS ──────────────────────────────────────────────────── */}
        <section id="blog" style={{ padding: "80px 24px", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div className={styles.pill} style={{ marginBottom: "18px" }}>Blog</div>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--text1)", letterSpacing: "-0.8px", marginBottom: "14px" }}>
                Latest From{" "}
                <span className={styles.gradText}>Our Blog</span>
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text2)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
                Practical guides about Wingo prediction, colour history, AI signal limits, and responsible result tracking.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {BLOG_POSTS.slice(0, 3).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.glass} style={{ borderRadius: "16px", overflow: "hidden", textDecoration: "none", transition: "transform 0.25s, box-shadow 0.25s", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden" }}>
                    <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 350px" style={{ objectFit: "cover", transition: "transform 0.5s" }}
                      onMouseEnter={e => { if (e.currentTarget) e.currentTarget.style.transform = "scale(1.1)"; }}
                      onMouseLeave={e => { if (e.currentTarget) e.currentTarget.style.transform = ""; }} />
                  </div>
                  <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent2)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{post.date}</span>
                    <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--text1)", lineHeight: 1.3, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.title}</h3>
                    <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6, margin: 0, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.description}</p>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent2)", display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
                      Read More <Icons.ArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <Link href="/blog" className="relative inline-flex items-center overflow-hidden font-medium transition-all rounded-md group" style={{ padding: "12px 28px", fontSize: "14px", background: "#f5f0ff", color: "#7D39EB", textDecoration: "none", fontWeight: 700, letterSpacing: "0.3px", gap: "6px", whiteSpace: "nowrap" }}>
                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#ede5ff" }}>
                  <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#7D39EB" }}></span>
                </span>
                <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#ede5ff" }}>
                  <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#7D39EB" }}></span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-md group-hover:translate-x-0" style={{ background: "#e5d5ff" }}></span>
                <span className="relative w-full text-center transition-colors duration-200 ease-in-out group-hover:text-white" style={{ fontWeight: 700 }}>View All Articles</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section id="faq" style={{ padding: "100px 24px", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <div className={styles.pill} style={{ marginBottom: "18px" }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 900, color: "var(--text1)", letterSpacing: "-0.8px", marginBottom: "14px" }}>
                Frequently Asked{" "}
                <span className={styles.gradText}>Questions</span>
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.7 }}>
                Still have questions?{" "}
                <Link href="/faq" style={{ color: "var(--accent2)", fontWeight: 600, textDecoration: "none" }}>Visit our full support centre</Link>.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {FAQS.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} style={{ borderRadius: "var(--radius)", overflow: "hidden", border: `1px solid ${open ? "#c5a8f8" : "var(--border)"}`, background: open ? "#faf8ff" : "#ffffff", transition: "border-color 0.25s, background 0.25s" }}>
                    <button
                      id={`faq-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", textAlign: "left" }}
                    >
                      <span style={{ fontWeight: 700, fontSize: "14px", color: open ? "var(--text1)" : "var(--text2)" }}>{faq.q}</span>
                      <span style={{ color: open ? "#7D39EB" : "var(--text3)", flexShrink: 0, transition: "transform 0.25s, color 0.25s", transform: open ? "rotate(45deg)" : "none", display: "flex" }}>
                        {open ? <Icons.Minus /> : <Icons.Plus />}
                      </span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 20px 18px", fontSize: "13px", color: "var(--text2)", lineHeight: 1.75 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
        <section id="cta" style={{ padding: "100px 24px", background: "var(--bg)", borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "relative", maxWidth: "580px", margin: "0 auto" }}>
            {/* Icon */}
            <div style={{ width: "60px", height: "60px", borderRadius: "16px", background: "#f0ffd0", border: "1px solid #c6e870", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "#8cba20" }}>
              <Icons.Target />
            </div>

            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, color: "var(--text1)", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: "16px" }}>
              Ready to Review{" "}
              <span className={styles.gradText}>Live Wingo Signals?</span>
            </h2>
            <p style={{ fontSize: "15px", color: "var(--text2)", lineHeight: 1.75, maxWidth: "440px", margin: "0 auto 36px" }}>
              Review live period timing, recent result history, and statistical signal context in one responsive browser dashboard.
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/login" id="cta-access" className="relative inline-flex items-center overflow-hidden font-medium transition-all rounded-md group" style={{ padding: "14px 32px", fontSize: "14px", background: "#C6FF33", color: "#1a202c", textDecoration: "none", fontWeight: 800, letterSpacing: "0.5px" }}>
                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#b8f020" }}>
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#8cba20" }}></span>
              </span>
              <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#b8f020" }}>
                <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#8cba20" }}></span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-md group-hover:translate-x-0" style={{ background: "#a8e020" }}></span>
              <span className="relative w-full text-center transition-colors duration-200 ease-in-out group-hover:text-white" style={{ fontWeight: 800 }}>Get Free Access</span>
              </Link>
              <a href={telegramLink} target="_blank" rel="noopener noreferrer" id="cta-telegram" className="relative inline-flex items-center overflow-hidden font-medium transition-all rounded-md group" style={{ padding: "14px 32px", fontSize: "14px", background: "#f5f0ff", color: "#7D39EB", textDecoration: "none", fontWeight: 700, letterSpacing: "0.3px" }}>
                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#ede5ff" }}>
                  <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#7D39EB" }}></span>
                </span>
                <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out rounded" style={{ background: "#ede5ff" }}>
                  <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2" style={{ background: "#7D39EB" }}></span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full rounded-md group-hover:translate-x-0" style={{ background: "#e5d5ff" }}></span>
                <span className="relative w-full text-center transition-colors duration-200 ease-in-out group-hover:text-white" style={{ fontWeight: 700 }}>Join Telegram</span>
              </a>
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px", marginTop: "28px" }}>
              {TRUST_BADGES.map((b) => (
                <span key={b} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--text2)", fontWeight: 500 }}>
                  <span style={{ color: "#34C759" }}><Icons.Check /></span>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
