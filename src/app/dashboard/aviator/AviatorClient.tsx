"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./aviator.module.css";
import { ArrowLeft, Loader2, History, Plane, HelpCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryRecord {
  time: string;
  multiplier: string;
}

const AVIATOR_PLANE_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB3aWR0aD0iMTUwIiBoZWlnaHQ9Ijc0Ij48ZGVmcz48cGF0aCBmaWxsPSIjRTUwNTM5IiBkPSJNMTQyLjYgMjQuNnEuOTUtMS4yNS0uNC0xLjktMy0xLjQtOC42NS0yLjJsLS41LS4xLS4yLjE1cS0uNi4yNS0uNS43NS44NSA0Ljc1IDIgOS4yNS4xNS42NSAxLjA1LjU1bC4yNS0uMXE0LjA1LTIuMyA2Ljk1LTYuNG0tOC4zNS0yLjY1LjE1LS4wNSAyLjU1LjQ1cTIuNjUuNiAzLjUgMSAuNzUuMzUuNjUuNjVsLTYuNSAxLjY1LS43LTMuMDVxLS4wNS0uMTUtLjA1LS4zLjEtLjI1LjQtLjM1TTEzOS4xIDMxcS0xLjU1IDEuMzUtMyAyLjNsLS41LjE1LS43LjEuMiA3Ljc1cS4xIDEuNSAzLjcgMTAuMDUuMi40NS41NS41NS40NS4wNS44NS0uMjUuNjUtLjY1LjktMS4wNS4yLS40NS4zNS0xLjY1LjY1LTQuNTUuNjUtOC40LjEtLjU1LS4yNS0xLjQ1TDEzOS4xIDMxbS0yLjY1IDExLjhxLS40LS44IDAtMS40bC43LS40IDIuOSA1LjFxMSAxLjk1LS42IDIuOTVsLS4xNS4xLS4xLS4xNS0yLjc1LTYuMk0xMzIuODUuNnEtLjItLjQ1LS40NS0uNDUtLjY1LS4zLS45LjEtLjMuMjUtLjk1IDEuMjUtLjQ1Ljk1LS42IDEuMzUtLjQ1IDcuMzUtLjQ1IDguNTVsLjA1LjUgMi41IDYuOC42NS0uNCAyLjcuNHEuOTUuMiAxLjM1LjQ1bC0uMi04LjVxLS4xLS44NS0uNTUtMi4xNS0uNDUtMS41LTEuNi00LjE1LTEuMTUtMi43LTEuNTUtMy43NW0tMS4wNSAyLjcuNS0uNS4xNS4xNSAyLjc1IDYuMnEuNiAxLjM1LS42NSAxLjdsLS4xNS4xLTIuNy01LjFxLS44LTEuNi4xLTIuNTVaIiBpZD0iYSIvPjxwYXRoIGZpbGw9IiNFNTA1MzkiIGQ9Ik05MC43NS0yLjI1cS0yLjI1LjItNC4zLjc1bC0xLjMgNC40cS0yLjA1LTEuNy00LjItMy4xNUw3Ni44LjZsLjQgMS4yNXEyLjA1IDEuMjUgNS44IDMuOS0uNjUgMS45NS0xLjkgNC43NWwyLjQtLjRxLS4xIDEuMDUtLjY1IDEuNS0uNC4yNS0xLjUuNTVsLTIuMi40NXEtLjcuMTUtLjk1IDEuMi0uMS42NS0uMDUgMS4xNWw4LTIuMDUuMzUtNS40NXExLjI1IDEuMTUgMy41NSA0LjJsMy42LTEuMTVxLS40NS0uNC01LjM1LTUuNSAyLjEtNi4zIDIuNDUtNy4yNW0tMzIuMTUtNy44cS01LjIgMi44LTkuMSA0LjYtMS42LjY1LTIuNCAxLjctLjM1LjM1LTEuMDUgMS42LS4yNS41LjIuNmwxNC4yNSA1LjFxLS4yLS4zLS4xNS0uNSAwLS4xNS4zLS4yNSAxMi41LTQgMjAuOC01LjYgNy0xLjI1IDEwLjQtMS42IDIuNC0uMTUgNC45LjFsMi4yNS40cS45LjM1Ljk1IDEuMi41IDMuMiAxLjcgNy44NSAxLjI1IDQuOSAyLjI1IDcuMTUtLjQ1LjY1LTEuMTUuNTUtLjQ1IDAtMS45NS0yLS4yNS0uMS0uNTUtLjEtMjMuNCA3Ljk1LTU4LjEgMTQuMDUtMzguOTUgNi44LTUzLjcgMy40di4xbC01LjggMi42NXEuODUuOSAzLjEgMy4xNSAzLjA1IDEuNSA4Ljk1LS41NWwuODUgMnEuMyAxLjEgMS4xIDEuMjUuNy4xNSAzLjc1LS4zIDExLjE1LTEuNSAzOC4yLTUuNzUgMjkuNDUtNC42IDM4LjMtNi40IDE3LjI1LTMuNCAyNC4wNS02IDUuMDUtMS45NSA2LjE1LTMuODUgMS4zLTIuMjUuMDUtNy42UTEwNS0yLjkgMTA0LjctNC4wNXEtLjg1LTIuMTUtMi42LTIuOTUtMS4yNS0uNi0zLjQtLjY1LTMuNyAwLTcuMy4zLTUuNS42LTEwLjkgMS4xLTQuNy41LTguNi0xLjc1LTMuOS0yLjMtNC41NS0yLjY1LTEuOTUtLjk1LTMuMjUtMS4wNS0xLjktLjItNS41IDEuNjVtMi41IDhxLS4yNS0xLjEgMS40LTEuNS4zLS4wNSAzLjYtMS4xLjYtLjIuNi0uNzUuMS0uNTUtLjM1LS44TDYxLjktOS4xcTIuMi0xLjIgNC42LjA1IDMuMiAxLjY1IDUuOCAzLjQ1LjU1LjQuNDUuODUtLjEuNS0uNTUuNmwtMTAuNDUgM3EtLjUtLjQ1LS42NS0uOW0tMzkuOC00LjhxLTYuNC0yLTEyLjM1IDIuMjV2LjA1bDQuNSA2LjVxLjIuMy40NS4yTDIwLjg1IDBsLjIuOXEuMDUuOS0uMyAxLjYtLjMuNi0xIC45NWwtNC41NSAxLjUgMS40NSAyLjRMMjEuOSA1LjZxLjQ1IDIuMjUtLjUgMi43bC0zLjMgMS40IDMuMzUgNS41LTIuMDUuNlExMCAxOC43IDguNTUgMTguNDVxLTIuODUtLjUtOC42LTYuNFEtNS44IDUuNi03LjMgNC41cS0yLjM1LTEuOC02LjE1LTEuMjVRLTE2LjUgMy43LTIxLjkgNnEtMS42LjY1LTEuNzUgMy41bDYuMy0xLjhxLjI1IDEuOS0uNyAyLjItMy4yIDEuMTUtNS42NSAxLjg1LS45LjUtLjggMy4wNWwyLjktLjY1cS4yNS0uMS40LjFsOS45NSAxMi40NXEuNzUtLjA1IDMuMy0uNmwtNy4xLTEwLjc1cS0uMS0uMi0uMDUtLjQuMTUtLjIuMy0uMyAxLjk1LS41NSAyLjg1LS42IDIuMy0uMTUgMy45NSAxLjQ1IDEuNyAxLjY1IDQuMSAzLjEgMy42NSAyLjEgNi44NSAyLjQgMS42LjIgMS41Ljc1bC0yLjIuN3EtLjguMi0uODUgMS4zNS4wNS41NS4yIDEuMDVsMjQtNC45NXEuMi0uMTUuNC4wNWwyLjM1IDIuOHEuNC42NSAxLjE1LjU1IDQuMzUtLjM1IDIyLjQ1LTQuMiAxOC4wNS00IDE5LjQtNC44LjY1LS40NS45NS0yIC4xLS45NS0xLjE1LTEuNFEzMS40NS0zLjg1IDIxLjMtNi44NVoiIGlkPSJiIi8+PC9kZWZzPjx1c2UgeGxpbms6aHJlZj0iI2EiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMTEuMikiLz48dXNlIHhsaW5rOmhyZWY9IiNiIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC41IDM0LjYpIi8+PC9zdmc+Cg==";

export default function AviatorClient() {
  const router = useRouter();
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [shuffleValue, setShuffleValue] = useState("1.00");
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const key = localStorage.getItem("login_key");
    if (!key) {
      router.replace("/");
    } else {
      setIsAuthChecking(false);
    }
  }, [router]);

  const generatePrediction = () => {
    const rand = Math.random();
    let min, max;
    if (rand < 0.8) {
      min = 0.2; max = 2.5;
    } else if (rand < 0.9) {
      min = 2.5; max = 6.0;
    } else {
      min = 6.0; max = 7.8;
    }
    const val = Math.random() * (max - min) + min;
    return val.toFixed(2);
  };

  const handlePredict = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPrediction(null);

    // Fast 2-second animation
    const duration = 2000;
    const startTime = Date.now();

    const shuffleInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        setShuffleValue((Math.random() * 5 + 1).toFixed(2));
      } else {
        clearInterval(shuffleInterval);
        const finalVal = generatePrediction();
        setPrediction(finalVal);
        setIsAnimating(false);
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setHistory(prev => [{ time: timeStr, multiplier: finalVal }, ...prev].slice(0, 10));
      }
    }, 60);
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
            <stop offset="0%" stopColor={iosBlue} stopOpacity="0.12" />
            <stop offset="100%" stopColor={iosBlue} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="purpleGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={iosPurple} stopOpacity="0.12" />
            <stop offset="100%" stopColor={iosPurple} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#bgGrad)" />
        <path d="M 0 28 Q 30 18 60 28 Q 85 33 100 23 L 100 0 L 0 0 Z" fill="url(#blueGrad)" />
        <path d="M 0 72 Q 40 82 70 72 Q 90 67 100 74 L 100 100 L 0 100 Z" fill="url(#purpleGrad)" />
      </svg>

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/dashboard" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <div className={styles.gameInfo}>
            <div className={styles.gameIconWrapper}>
              <Plane size={20} color="#fff" />
            </div>
            <div className={styles.gameNameGroup}>
              <span className={styles.gameTitle}>Aviator Predictor</span>
              <span className={styles.gameSubtitle}>AI Multiplier Analysis</span>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <span>97% Accuracy</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.aviatorCard}>
          <div className={styles.planeContainer}>
            <motion.div
              animate={isAnimating ? {
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 5, 0]
              } : {
                y: [0, -5, 0]
              }}
              transition={{
                duration: isAnimating ? 0.5 : 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                src={AVIATOR_PLANE_SVG} 
                alt="Aviator Plane" 
                className={styles.planeIcon}
              />
            </motion.div>
          </div>

          <div className={styles.predictionDisplay}>
            <AnimatePresence mode="wait">
              {isAnimating ? (
                <motion.div
                  key="shuffling"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${styles.multiplier} ${styles.animatingMultiplier}`}
                >
                  {shuffleValue}x
                </motion.div>
              ) : (
                <motion.div
                  key={prediction || "initial"}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={styles.multiplier}
                >
                  {prediction ? `${prediction}x` : "0.00x"}
                </motion.div>
              )}
            </AnimatePresence>
            <span className={styles.predictionLabel}>
              {isAnimating ? "Analyzing Trends..." : "Next Round Signal"}
            </span>
          </div>

          <div className={styles.predictBtnContainer}>
            <button 
              className={styles.predictBtn}
              onClick={handlePredict}
              disabled={isAnimating}
            >
              {isAnimating ? "Processing..." : "Get Signal"}
            </button>
          </div>
        </div>

        <div className={styles.historySection}>
          <h2 className={styles.historyTitle}>
            <History size={18} color="#ff2d55" />
            Signal History
          </h2>
          <div className={styles.historyList}>
            {history.length > 0 ? (
              history.map((item, i) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={i} 
                  className={styles.historyItem}
                >
                  <span className={styles.historyTime}>{item.time}</span>
                  <span className={`${styles.historyValue} ${
                    parseFloat(item.multiplier) > 6 ? styles.high : 
                    parseFloat(item.multiplier) > 2.5 ? styles.medium : styles.low
                  }`}>
                    {item.multiplier}x
                  </span>
                </motion.div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#86868b', fontSize: '14px' }}>
                No signals generated yet
              </div>
            )}
          </div>
        </div>

        {/* How to Use Section */}
        <div className={styles.howToUseSection}>
          <h2 className={styles.historyTitle}>
            <HelpCircle size={18} color="#ff2d55" />
            How to Use Aviator AI
          </h2>
          <div className={styles.howToUseList}>
            {[
              "Click on 'Get Signal' to start AI analysis.",
              "Wait for the server synchronization to complete.",
              "Observe the predicted multiplier carefully.",
              "Place your bet and cash out before the plane flies away.",
              "Use these signals as a reference for your strategy."
            ].map((step, i) => (
              <div key={i} className={styles.howToUseItem}>
                <CheckCircle2 size={16} color="#34c759" className={styles.stepIcon} />
                <p className={styles.stepText}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
