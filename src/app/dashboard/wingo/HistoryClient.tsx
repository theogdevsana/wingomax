"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./history.module.css";
import { ArrowLeft, Loader2, Timer } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GAMES } from "@/lib/games";
import HistoryCanvas from "./HistoryCanvas";

interface HistoryItem {
  issueNumber: string;
  number: string;
  colour: string;
  premium: string;
}

const PERIODS_MAP: Record<"30sec" | "1 Min", number> = {
  "30sec": 30,
  "1 Min": 60
};

const START_HOUR = 5;
const START_MINUTE = 30;

function getTimerData(periodName: "30sec" | "1 Min") {
  const now = new Date();
  const startTime = new Date();
  startTime.setHours(START_HOUR, START_MINUTE, 0, 0);

  if (now < startTime) {
    startTime.setDate(startTime.getDate() - 1);
  }

  const elapsedSeconds = Math.floor(
    (now.getTime() - startTime.getTime()) / 1000
  );

  const secondsPerPeriod = PERIODS_MAP[periodName];
  const totalPeriods = Math.floor(elapsedSeconds / secondsPerPeriod);
  const upcomingPeriod = totalPeriods + 1;

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const periodNumber = `${year}${month}${day}1000020${String(upcomingPeriod).padStart(3, '0')}`;
  let remainingSeconds = secondsPerPeriod - (elapsedSeconds % secondsPerPeriod);

  if (remainingSeconds === secondsPerPeriod) {
    remainingSeconds = 0;
  }

  return {
    periodNumber,
    remainingSeconds
  };
}

export default function HistoryClient({ slug }: { slug: string }) {
  const router = useRouter();
  const game = GAMES.find(g => g.slug === slug);

  const [selectedGame, setSelectedGame] = useState<"30sec" | "1 Min">("1 Min");
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [shuffleNumbers, setShuffleNumbers] = useState<number[]>([]);
  const [shuffleTick, setShuffleTick] = useState(0);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [lastPredictedPeriod, setLastPredictedPeriod] = useState<string>("");

  useEffect(() => {
    const key = localStorage.getItem("login_key");
    if (!key) {
      router.replace("/");
    } else if (!game) {
      router.replace("/dashboard");
    } else {
      setIsAuthChecking(false);
    }
  }, [router, game]);

  const historyApi = "/api/history";

  const fetchHistory = async () => {
    if (isAuthChecking || !game) return;
    try {
      const periodParam = selectedGame === "30sec" ? "30s" : "1m";
      const res = await fetch(`${historyApi}/${periodParam}`);
      const data = await res.json();
      if (data?.status === "success" && data?.data?.data?.list) {
        const list = data.data.data.list;
        setHistoryData(list);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthChecking || !game) return;
    fetchHistory();
    const interval = setInterval(() => {
      fetchHistory();
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedGame, isAuthChecking, game]);

  useEffect(() => {
    if (isAuthChecking || !game) return;
    const updateTimer = () => {
      const data = getTimerData(selectedGame);
      setTimeLeft(data.remainingSeconds);
      setCurrentPeriod(prev => {
        if (prev !== data.periodNumber) {
          // New period started — reset prediction & lock
          setPrediction(null);
          setLastPredictedPeriod("");
        }
        return data.periodNumber;
      });

      if (data.remainingSeconds === PERIODS_MAP[selectedGame] - 1) {
        fetchHistory();
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [selectedGame, isAuthChecking, game]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        setShuffleTick(prev => prev + 1);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const handlePredict = async () => {
    if (isAnimating || lastPredictedPeriod === currentPeriod) return;

    setIsAnimating(true);
    setLastPredictedPeriod(currentPeriod);
    setPrediction(null);

    const ANIMATION_MS = 3000;
    const startTime = Date.now();

    let finalVal: number | null = null;

    // 2.8s client timeout — safety net if server is slow
    const controller = new AbortController();
    const clientTimeout = setTimeout(() => controller.abort(), 2800);

    try {
      const res = await fetch("/api/predict", { signal: controller.signal });
      clearTimeout(clientTimeout);
      const data = await res.json();

      if (data?.predictionResult) {
        const { gameType, period, prediction: apiPred } = data.predictionResult;
        const expectedGameType = selectedGame === "1 Min" ? "Wingo 1 Min" : "Wingo 30 Sec";

        if (gameType === expectedGameType && period === currentPeriod) {
          finalVal = apiPred.toUpperCase() === "BIG" ? 7 : 2;
        } else {
          console.log("Mismatch. API Period:", period, "Local:", currentPeriod);
        }
      }
    } catch (err) {
      clearTimeout(clientTimeout);
      console.error("Prediction API Fetch Error:", err);
    }

    if (finalVal === null) {
      finalVal = Math.floor(Math.random() * 10);
    }

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, ANIMATION_MS - elapsed);

    setTimeout(() => {
      setIsAnimating(false);
      setPrediction(finalVal);
    }, remaining);
  };

  if (isAuthChecking || !game) return null;

  const gameName = game.name;
  const gameImg = game.image.replace("/duner/", "/logo/");
  const iosBlue = "#007AFF";
  const iosPurple = "#AF52DE";
  const timerBg = selectedGame === "30sec" ? "#7810d2" : "linear-gradient(135deg, #007AFF, #3c4de5)";

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
              <Image
                src={gameImg}
                alt={gameName}
                width={48}
                height={48}
                priority
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  display: 'block'
                }}
              />
            </div>
            <div className={styles.gameNameGroup}>
              <span className={styles.gameTitle}>{gameName}</span>
              <span className={styles.gameSubtitle}>WinGo AI Prediction</span>
            </div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.miniSwitch}>
            <button
              className={`${styles.miniBtn} ${selectedGame === "30sec" ? styles.miniActive : ""}`}
              onClick={() => setSelectedGame("30sec")}
            >
              30s
            </button>
            <button
              className={`${styles.miniBtn} ${selectedGame === "1 Min" ? styles.miniActive : ""}`}
              onClick={() => setSelectedGame("1 Min")}
            >
              1m
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.lotteryRow} style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', maxHeight: '90px' }}>
          <img
            src={`/svg/png/wingo_${selectedGame === "30sec" ? "30sec" : "1min"}.png`}
            alt="Wingo Background"
            style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '0 20px 0 39%', justifyContent: 'center', paddingTop: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>Win Go {selectedGame}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ background: timerBg, color: '#fff', width: '22px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>{Math.floor(Math.floor(timeLeft / 60) / 10)}</div>
                <div style={{ background: timerBg, color: '#fff', width: '22px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>{Math.floor(timeLeft / 60) % 10}</div>
                <div style={{ color: '#000', fontWeight: '900', fontSize: '16px', marginTop: '-2px' }}>:</div>
                <div style={{ background: timerBg, color: '#fff', width: '22px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>{Math.floor((timeLeft % 60) / 10)}</div>
                <div style={{ background: timerBg, color: '#fff', width: '22px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>{timeLeft % 60 % 10}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '9px' }}>
              <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                {historyData.slice(0, 3).map((item, idx) => (
                  <Image
                    key={idx}
                    src={parseInt(item.number) >= 5 ? '/svg/png/result_big.png' : '/svg/png/result_small.png'}
                    alt={parseInt(item.number) >= 5 ? 'Big' : 'Small'}
                    width={24}
                    height={24}
                    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                  />
                ))}
              </div>
              <div className={isLoading ? styles.skeletonPeriod : styles.issueNumber} style={{ color: '#000', margin: 0, fontSize: '13px' }}>{isLoading ? "" : currentPeriod}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'none' }}>
          <Image src="/svg/png/what_is_result.png" alt="" width={36} height={36} priority />
          <Image src="/svg/png/what_is_result_v2.png" alt="" width={36} height={36} priority />
          <Image src="/svg/png/result_small.png" alt="" width={36} height={36} priority />
          <Image src="/svg/png/result_big.png" alt="" width={36} height={36} priority />
        </div>
        <div className={styles.drawResultSection} style={{ marginTop: '-12px' }}>
          <Image
            className={styles.resultBg}
            src="/svg/png/draw_result_bg.svg"
            alt="Wingo Game History Draw Result Background"
            width={400}
            height={100}
            priority
          />
          <div className={styles.resultNumbers}>
            <div className={styles.historyRow}>
              {isAnimating ? (
                [...Array(7)].map((_, i) => (
                  <div key={i} className={styles.resultItem}>
                    <motion.div
                      key={shuffleTick + i}
                      initial={{ opacity: 0.9, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.05 }}
                    >
                      <Image
                        className={styles.resultImg}
                        src={`/svg/png/what_is_result${(shuffleTick + i) % 2 === 0 ? "" : "_v2"}.png`}
                        alt="Shuffling"
                        width={36}
                        height={36}
                      />
                    </motion.div>
                  </div>
                ))
              ) : (
                historyData.length > 0 && !isLoading ? (
                  <>
                    {[1, 2, 3].map((_, idx) => (
                      <div key={`mystery-pre-${idx}`} className={styles.resultItem}>
                        <Image
                          className={`${styles.resultImg} ${prediction !== null ? styles.grayscale : ""}`}
                          src={`/svg/png/what_is_result${idx % 2 === 0 ? "" : "_v2"}.png`}
                          alt="Mystery Result Placeholder"
                          width={36}
                          height={36}
                        />
                      </div>
                    ))}

                    <div className={styles.resultItem}>
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={prediction !== null ? `size-${prediction}` : "size-default"}
                      >
                        <Image
                          className={styles.resultImg}
                          src={prediction !== null ? (prediction >= 5 ? "/svg/png/result_big.png" : "/svg/png/result_small.png") : "/svg/png/what_is_result.png"}
                          alt={prediction !== null ? (prediction >= 5 ? "Big" : "Small") : "Random Prediction State"}
                          width={36}
                          height={36}
                        />
                        {prediction !== null && (
                          <Image
                            className={styles.firstBadge}
                            src="/svg/png/first_num_bg.svg"
                            alt="Result Badge"
                            width={18}
                            height={18}
                          />
                        )}
                      </motion.div>
                    </div>

                    {[1, 2, 3].map((_, idx) => (
                      <div key={`mystery-post-${idx}`} className={styles.resultItem}>
                        <Image
                          className={`${styles.resultImg} ${prediction !== null ? styles.grayscale : ""}`}
                          src={`/svg/png/what_is_result${idx % 2 === 0 ? "_v2" : ""}.png`}
                          alt="Mystery Result Placeholder"
                          width={36}
                          height={36}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '4px', width: '100%', justifyContent: 'center' }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className={styles.resultItem}>
                        <Image
                          className={styles.resultImg}
                          src={`/svg/png/what_is_result${i % 2 === 0 ? "" : "_v2"}.png`}
                          alt="Loading"
                          width={36}
                          height={36}
                          style={{ opacity: 0.5 }}
                        />
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', marginTop: '-12px', borderRadius: '12px', overflow: 'hidden' }}>
          <img 
            src="/svg/png/predict_bg.jpg" 
            alt="AI Prediction" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
          <div style={{ position: 'absolute', top: '12px', left: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ color: '#000', fontSize: '14px', fontWeight: 'bold' }}>AI Prediction</span>
            <span style={{ color: '#333', fontSize: '10px', lineHeight: '1.2' }}>
              Get highly accurate predictions based<br/>
              on our advanced AI algorithms.
            </span>
          </div>
          <div style={{ position: 'absolute', bottom: '12px', left: '16px' }}>
            <button 
              className={styles.predictBtn}
              onClick={handlePredict}
              disabled={isAnimating || lastPredictedPeriod === currentPeriod}
              style={{ 
                padding: '0 30px', 
                height: '36px', 
                fontSize: '12px',
                cursor: (isAnimating || lastPredictedPeriod === currentPeriod) ? 'not-allowed' : 'pointer',
                opacity: (isAnimating || lastPredictedPeriod === currentPeriod) ? 0.7 : 1
              }}
            >
              {lastPredictedPeriod === currentPeriod && !isAnimating ? "Predicted" : "Predict"}
            </button>
          </div>
        </div>

        <div className={styles.historyContainer}>
          <div className={styles.tableHeader}>
            <h2>Game History</h2>
          </div>
          <div key={selectedGame}>
            <HistoryCanvas data={historyData} loading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
