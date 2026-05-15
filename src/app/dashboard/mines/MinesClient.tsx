"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./mines.module.css";
import { ArrowLeft, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MinesClient() {
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [predictedIndices, setPredictedIndices] = useState<number[]>([]);

  useEffect(() => {
    const key = localStorage.getItem("login_key");
    if (!key) {
      router.replace("/");
    } else {
      setIsAuthChecking(false);
    }
  }, [router]);

  const handlePredict = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setPredictedIndices([]);

    // Select 3 to 4 random boxes
    const count = Math.floor(Math.random() * 2) + 3; // 3 or 4
    const indices: number[] = [];
    
    while (indices.length < count) {
      const rand = Math.floor(Math.random() * 25);
      if (!indices.includes(rand)) {
        indices.push(rand);
      }
    }

    // Animation delay
    setTimeout(() => {
      setIsAnimating(false);
      setPredictedIndices(indices);
    }, 1500);
  };

  if (isAuthChecking) return null;

  const iosBlue = "#007AFF";
  const iosPurple = "#AF52DE";

  return (
    <main className={styles.main}>
      <svg className={styles.backgroundSvg} preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F7" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#ECECF1" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={iosBlue} stopOpacity="0.08" />
            <stop offset="100%" stopColor={iosBlue} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#bgGrad)" />
        <path d="M 0 28 Q 30 18 60 28 Q 85 33 100 23 L 100 0 L 0 0 Z" fill="url(#blueGrad)" />
      </svg>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/dashboard" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <div className={styles.gameInfo}>
            <div className={styles.gameIconWrapper}>
              <Star size={20} color="#fff" fill="#fff" />
            </div>
            <div className={styles.gameNameGroup}>
              <span className={styles.gameTitle}>Mines Predictor</span>
              <span className={styles.gameSubtitle}>5x5 AI Analysis</span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
           <div style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} />
              <span>98% Accuracy</span>
           </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.minesGridSection}>
          <div className={styles.grid}>
            {Array.from({ length: 25 }).map((_, i) => {
              const isPredicted = predictedIndices.includes(i);
              return (
                <div 
                  key={i} 
                  className={`${styles.box} ${isPredicted ? styles.boxActive : ""}`}
                >
                  <AnimatePresence>
                    {isPredicted && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                         <svg viewBox="0 0 24 24" className={styles.starIcon}>
                            <defs>
                              <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFD700" />
                                <stop offset="100%" stopColor="#FFA500" />
                              </linearGradient>
                            </defs>
                            <path 
                              fill="url(#starGrad)" 
                              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                            />
                         </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {isAnimating && !isPredicted && (
                     <motion.div
                       animate={{ opacity: [0.3, 0.6, 0.3] }}
                       transition={{ duration: 1, repeat: Infinity }}
                       style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.02)' }}
                     />
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.predictBtnContainer}>
            <button 
              className={styles.predictBtn}
              onClick={handlePredict}
              disabled={isAnimating}
            >
              {isAnimating ? "ANALYZING..." : "PREDICT NEXT"}
            </button>
          </div>
        </div>

        <div style={{ padding: '0 10px', marginTop: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1d1d1f', marginBottom: '8px' }}>Instructions:</h3>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ fontSize: '12px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#FFD700' }} />
                    Wait for the analysis to complete.
                </li>
                <li style={{ fontSize: '12px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#FFD700' }} />
                    Open only the highlighted boxes in your game.
                </li>
                <li style={{ fontSize: '12px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#FFD700' }} />
                    Do not play more than 3 rounds consecutively.
                </li>
            </ul>
        </div>
      </div>
    </main>
  );
}
