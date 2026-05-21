"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./aviator.module.css";
import { ArrowLeft, Plane } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AviatorClient() {
  const router = useRouter();
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
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
      min = 0.2;
      max = 2.5;
    } else if (rand < 0.9) {
      min = 2.5;
      max = 6.0;
    } else {
      min = 6.0;
      max = 7.8;
    }

    const val = Math.random() * (max - min) + min;

    return val.toFixed(2);
  };

  const handlePredict = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setPrediction(null);

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
      }
    }, 60);
  };

  if (isAuthChecking) return null;

  return (
    <main className={styles.main}>
      {/* Background SVG */}
      <svg
        className={styles.backgroundSvg}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F7" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#ECECF1" />
          </linearGradient>

          <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff2d55" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ff2d55" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="url(#bgGrad)" />

        <path
          d="M 0 28 Q 30 18 60 28 Q 85 33 100 23 L 100 0 L 0 0 Z"
          fill="url(#redGrad)"
        />
      </svg>

      {/* Header */}
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
              <span className={styles.gameTitle}>
                Aviator Predictor
              </span>

              <span className={styles.gameSubtitle}>
                AI Multiplier Analysis
              </span>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div
            style={{
              background: "#f1f5f9",
              padding: "4px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "800",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>

            <span>97% Accuracy</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Circle */}
        <div
          className={`${styles.circleContainer} ${isAnimating ? styles.animatingCircle : ""
            }`}
        >
          {/* Pulse Rings */}
          {isAnimating && (
            <>
              <div className={styles.pulseRing1} />
              <div className={styles.pulseRing2} />
              <div className={styles.pulseRing3} />
            </>
          )}

          <AnimatePresence mode="wait">
            {isAnimating ? (
              <motion.div
                key="shuffling"
                initial={{ opacity: 0.6, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`${styles.multiplier} ${styles.animatingMultiplier}`}
              >
                {shuffleValue}x
              </motion.div>
            ) : (
              <motion.div
                key={prediction || "initial"}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                }}
                className={styles.multiplier}
              >
                {prediction ? `${prediction}x` : "0.00x"}
              </motion.div>
            )}
          </AnimatePresence>

          <span className={styles.predictionLabel}>
            {isAnimating ? "Analyzing..." : "Next Signal"}
          </span>
        </div>

        {/* SPACE ADDED HERE */}
        <div style={{ height: "55px" }} />

        {/* Button */}
        <button
          className={styles.predictBtn}
          onClick={handlePredict}
          disabled={isAnimating}
        >
          {isAnimating ? "ANALYZING..." : "GET SIGNAL"}
        </button>
      </div>
    </main>
  );
}