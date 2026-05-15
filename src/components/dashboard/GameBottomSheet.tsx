"use client";

import React from "react";
import Link from "next/link";
import styles from "@/app/dashboard/dashboard.module.css";
import { Game } from "@/lib/games";

interface GameBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGame: Game | null;
}

export default function GameBottomSheet({ isOpen, onClose, selectedGame }: GameBottomSheetProps) {
  return (
    <>
      <div 
        className={`${styles.sheetOverlay} ${isOpen ? styles.sheetOverlayVisible : ""}`}
        onClick={onClose}
      />
      <div className={`${styles.bottomSheet} ${isOpen ? styles.bottomSheetOpen : ""}`}>
        {/* Blob SVG Background */}
        <svg className={styles.sheetBgSvg} preserveAspectRatio="none" viewBox="0 0 400 300">
          <defs>
            <linearGradient id="sheetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5F5F7" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#ECECF1" />
            </linearGradient>
            <linearGradient id="cutBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007AFF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#34C759" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="cutPurple" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#AF52DE" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#FF2D55" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="cutOrange" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FF9500" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFCC00" stopOpacity="0.05" />
            </linearGradient>
            <filter id="cutShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.08" />
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#sheetGrad)" />
          <path d="M-40 60 C20 0 100 30 160 10 C220 -10 280 40 340 20 C400 0 440 50 420 80 L420 0 L0 0 Z" fill="url(#cutBlue)" filter="url(#cutShadow)" />
          <path d="M0 280 C60 240 120 270 180 250 C260 220 320 260 380 240 C420 230 450 270 440 300 L0 300 Z" fill="url(#cutPurple)" filter="url(#cutShadow)" />
          <path d="M280 120 C320 80 360 110 390 90 C420 70 440 120 420 150 C400 180 360 170 340 190 C310 220 270 180 260 150 C250 130 260 140 280 120 Z" fill="url(#cutOrange)" filter="url(#cutShadow)" />
          <path d="M40 180 C70 140 110 160 130 140 C160 110 200 150 190 180 C180 210 150 220 130 230 C100 250 60 220 50 200 C40 190 40 185 40 180 Z" fill="url(#cutBlue)" filter="url(#cutShadow)" opacity="0.6" />
        </svg>
        <div className={styles.sheetContent}>
          <div className={styles.sheetHandle} />
          
          {selectedGame && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
              <h2 className={styles.sheetTitle}>{selectedGame.name}</h2>
              <p className={styles.sheetSubtitle}>Choose your prediction tool</p>
            </div>
          )}

          <div className={styles.sheetOptions}>
            {[
              { label: "Wingo Signal", color: "#28CD41", glow: "rgba(40, 205, 65, 0.4)", href: "/dashboard/wingo" },
              { label: "Number Signal", color: "#007AFF", glow: "rgba(0, 122, 255, 0.4)", href: "/dashboard/number" },
              { label: "Mines", color: "#FF9500", glow: "rgba(255, 149, 0, 0.4)" },
              { label: "Aviator", color: "#FF2D55", glow: "rgba(255, 45, 85, 0.4)", href: "/dashboard/aviator" }
            ].map((btn, i) => {
              const content = (
                <>
                  <span className={styles.fold} />
                  <div className={styles.pointsWrapper}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <i key={j} className={styles.point} />
                    ))}
                  </div>
                  <span className={styles.inner}>
                    <svg
                      className={styles.btnIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    >
                      <polyline points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37" />
                    </svg>
                    {btn.label}
                  </span>
                </>
              );

              if (btn.href) {
                return (
                  <Link 
                    key={i}
                    href={`${btn.href}/${selectedGame?.slug || ""}`}
                    className={styles.sheetBtn}
                    style={{ 
                      "--btn-color": btn.color,
                      "--btn-glow": btn.glow,
                      textDecoration: 'none'
                    } as any}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button 
                  key={i}
                  className={styles.sheetBtn} 
                  style={{ 
                    "--btn-color": btn.color,
                    "--btn-glow": btn.glow
                  } as any}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
