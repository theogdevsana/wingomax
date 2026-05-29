"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import Link from "next/link";
import Image from "next/image";
import { GAMES, Game } from "@/lib/games";

import BackgroundSvg from "@/components/BackgroundSvg";

export default function DashboardPage() {
  const router = useRouter();
  const games = GAMES;
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const key = localStorage.getItem("login_key");
    if (!key) {
      window.location.replace("/");
    } else {
      setIsAuthChecking(false);
    }
  }, [router]);

  const handleGameTap = (game: Game) => {
    setSelectedGame(game);
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setTimeout(() => setSelectedGame(null), 300);
  };

  const iosBlue = "#007AFF";
  const iosPurple = "#AF52DE";

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAuthChecking) return null;

  return (
    <main className={styles.main}>
      <BackgroundSvg blueColor={iosBlue} purpleColor={iosPurple} />

      <div className={styles.content}>
        {/* Section: Game Header from demo.tsx */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px 8px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ boxSizing: "border-box" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "20px",
                fontWeight: "700",
                color: "rgb(23, 32, 50)",
                position: "relative",
              }}
            >
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  width: "26px",
                  height: "26px",
                  color: "rgb(249, 115, 22)",
                  flexShrink: 0,
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>{" "}
              Games{" "}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "rgb(139, 147, 167)",
                marginTop: "4px",
                fontWeight: "500",
              }}
            >
              Fresh applications and tools
            </div>
          </div>
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "14px",
              fontWeight: "600",
              color: "rgb(249, 115, 22)",
              textDecoration: "none",
              transition: "0.3s",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "rgba(249, 115, 22, 0.05)",
              whiteSpace: "nowrap",
            }}
          >
            {" "}
            Ai Tools
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: "4px" }}
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              <path d="M19 3v4" />
              <path d="M21 5h-4" />
            </svg>
          </Link>
        </div>

        {/* Section: Search Bar */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.searchIcon}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search your favorite game..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search games"
            />
          </div>
        </div>

        <div className={styles.grid}>
          {filteredGames.length > 0 ? (
            filteredGames.map((game, index) => (
              <div 
                key={game.id} 
                className={styles.card}
                onClick={() => handleGameTap(game)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: game.color,
                  color: game.name === "Tashan Win" ? "#1e293b" : "#fff",
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '500',
                  zIndex: 10,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {game.tag || "New"}
                </div>
                <Image
                  src={game.image}
                  alt={game.alt}
                  className={styles.cardImage}
                  width={400}
                  height={225}
                  priority={index < 12}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={60}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                <div className={styles.overlay}>
                  <div className={styles.cardFooter}>
                    <h3 className={styles.gameName}>{game.name}</h3>
                    <button 
                      className={styles.playButton}
                      aria-label={`Get ${game.name} app`}
                      style={{ 
                        background: game.color,
                        color: game.name === "Tashan Win" ? "#1e293b" : "#fff",
                        boxShadow: game.color.includes("gradient") 
                          ? "0 4px 10px rgba(255, 153, 51, 0.4)" 
                          : `0 4px 8px ${game.color}55` 
                      }}
                      onClick={(e) => { e.stopPropagation(); handleGameTap(game); }}
                    >
                      Get App
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div 
              style={{ 
                gridColumn: "1 / -1", 
                textAlign: "center", 
                padding: "40px 0",
                color: "#8b93a7",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              No games found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet */}
      <div 
        className={`${styles.sheetOverlay} ${sheetOpen ? styles.sheetOverlayVisible : ""}`}
        onClick={closeSheet}
      />
      <div className={`${styles.bottomSheet} ${sheetOpen ? styles.bottomSheetOpen : ""}`}>
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
          {/* Paper-cut abstract shapes */}
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
              { 
                label: "Wingo Signal", 
                color: "#007AFF", 
                glow: "rgba(0, 122, 255, 0.45)", 
                href: "/dashboard/wingo" 
              },
              { 
                label: "Number Signal", 
                color: "#00E676", 
                glow: "rgba(0, 230, 118, 0.45)", 
                href: "/dashboard/number" 
              },
              { 
                label: "Mines", 
                color: "#FFB300", 
                glow: "rgba(255, 179, 0, 0.45)",
                href: "/dashboard/mines"
              },
              { 
                label: "Aviator", 
                color: "#FF1744", 
                glow: "rgba(255, 23, 68, 0.45)",
                href: "/dashboard/aviator"
              },
              { 
                label: "TRX Wingo", 
                color: "#7C4DFF", 
                glow: "rgba(124, 77, 255, 0.45)" 
              },
              { 
                label: "Chicken Road", 
                color: "#FF4081", 
                glow: "rgba(255, 64, 129, 0.45)" 
              }
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
    </main>
  );
}
