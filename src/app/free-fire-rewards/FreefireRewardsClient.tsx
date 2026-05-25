"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ───────────────────────────── Types ───────────────────────────── */
interface Reward {
  id: string;
  image_url: string;
  slot_id: string;
}
interface AppSettings {
  claim_mode: "popup" | "redirect";
  redirect_url: string;
  popup_message: string;
}
interface ApiResponse {
  status: string;
  settings: AppSettings;
  rewards: Reward[];
}

declare global {
  interface Window {
    confetti?: (opts: object) => void;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Skeleton Card
══════════════════════════════════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="relative aspect-square rounded-xl overflow-hidden skeleton-shimmer border border-white/5" />
      <div className="mt-2 h-7 rounded-lg skeleton-shimmer" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Reward Card
══════════════════════════════════════════════════════════════════════ */
function RewardCard({
  reward,
  index,
  isSelected,
  onToggle,
  onClaim,
}: {
  reward: Reward;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
  onClaim: (e: React.MouseEvent) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={onToggle}
      className="flex-1 flex flex-col cursor-pointer group"
      style={{
        animation: `popIn 0.45s cubic-bezier(0.175,0.885,0.32,1.275) ${0.1 + index * 0.07}s both`,
      }}
    >
      {/* Image wrapper */}
      <div
        className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 shine-card ${
          isSelected
            ? "border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.7),0_0_40px_rgba(255,150,0,0.3)] scale-[1.06] z-10"
            : "border-white/10 group-hover:border-[#FFD700]/50 group-hover:shadow-[0_0_12px_rgba(255,215,0,0.25)]"
        }`}
        style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e)" }}
      >
        {/* Shimmer while loading */}
        {!imgLoaded && <div className="absolute inset-0 skeleton-shimmer" />}

        <Image
          src={reward.image_url}
          alt={`Reward ${reward.slot_id}`}
          fill
          priority={index < 6}
          quality={90}
          className={`object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          sizes="(max-width: 390px) 30vw, (max-width: 512px) 33vw, (max-width: 768px) 28vw, 170px"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Selected tick badge */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FFD700] flex items-center justify-center z-20 shadow-md animate-[popIn_0.2s_ease]">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Mini claim button */}
      <button
        onClick={onClaim}
        className={`w-full mt-2 py-1.5 rounded-xl text-base uppercase font-bold tracking-widest border-2 transition-all duration-200 leading-none ${
          isSelected
            ? "bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black border-[#FFD700] shadow-[0_2px_12px_rgba(255,215,0,0.5)]"
            : "bg-white/5 text-[#aaa] border-white/10 group-hover:bg-gradient-to-r group-hover:from-[#FFD700] group-hover:to-[#FF8C00] group-hover:text-black group-hover:border-[#FFD700]"
        }`}
        style={{ fontFamily: "'Teko', sans-serif" }}
      >
        Claim
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Main Client Component
══════════════════════════════════════════════════════════════════════ */
export default function FreefireRewardsClient() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [uid, setUid] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [uidError, setUidError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Load confetti ── */
  useEffect(() => {
    if (typeof window !== "undefined" && !window.confetti) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
      document.head.appendChild(s);
    }
  }, []);

  /* ── Fetch API — fast with AbortController + timeout ── */
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    fetch("https://app.nexapk.in/rajesh/api.php", {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        clearTimeout(timer);
        if (data.status === "success") {
          setSettings(data.settings);
          setRewards(data.rewards.filter(Boolean));
        } else {
          setLoadError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoadError(true);
        setLoading(false);
      });

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  /* ── UID validate ── */
  const validateUID = useCallback(() => {
    if (!/^\d{5,13}$/.test(uid.trim())) {
      setUidError(true);
      setTimeout(() => setUidError(false), 600);
      inputRef.current?.focus();
      return false;
    }
    return true;
  }, [uid]);

  /* ── Confetti burst ── */
  const fireConfetti = useCallback(() => {
    if (!window.confetti) return;
    const end = Date.now() + 2200;
    (function frame() {
      window.confetti?.({ particleCount: 8, angle: 60,  spread: 65, origin: { x: 0 }, colors: ["#FFD700","#FF4500","#fff"] });
      window.confetti?.({ particleCount: 8, angle: 120, spread: 65, origin: { x: 1 }, colors: ["#FFD700","#FF4500","#fff"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  /* ── Claim ── */
  const handleClaim = useCallback(
    (single = false) => {
      if (settings?.claim_mode === "redirect") {
        const url = settings.redirect_url?.trim();
        if (url) { window.location.href = url; return; }
        alert("Redirect URL not set by admin.");
        return;
      }
      if (!validateUID()) return;
      if (!single && selectedIds.size === 0) {
        alert("Please select at least one reward!");
        return;
      }
      setShowToast(true);
      fireConfetti();
    },
    [settings, validateUID, selectedIds, fireConfetti]
  );

  /* ── Close toast ── */
  const closeToast = useCallback(() => {
    setShowToast(false);
    setUid("");
    setSelectedIds(new Set());
  }, []);

  /* ── Toggle ── */
  const toggleCard = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  /* ── Build rows ── */
  const rows: Reward[][] = [];
  for (let i = 0; i < rewards.length; i += 3) rows.push(rewards.slice(i, i + 3));

  const skeletonRows = Array.from({ length: 3 });

  /* ═══════════════════════════════ Render ═════════════════════════ */
  return (
    <>
      {/* ── Fixed BG ── */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://dl.dir.freefiremobile.com/common/web_event/official2.ff.garena.all/20261/73b117baddfddfe357aabb723e4c9c4d.jpg')`,
        }}
      />
      {/* Dark overlay */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/60 to-black/85" />

      {/* ── Main container ── */}
      <main className="relative z-0 min-h-screen flex justify-center">
        <div className="w-full max-w-lg flex flex-col min-h-screen px-4 pt-6 pb-4 glass-panel">

          {/* ── Header ── */}
          <header className="text-center mb-5" style={{ animation: "fadeInDown 0.7s ease both" }}>
            {/* Top badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 mb-2"
                 style={{ animation: "fadeIn 0.5s ease both" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700] animate-pulse" />
              <span className="text-[#FFD700] text-xs font-semibold tracking-widest uppercase"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                Limited Time Event
              </span>
            </div>

            <h1
              className="text-6xl font-extrabold tracking-widest text-white leading-none uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Teko', sans-serif" }}
            >
              FREE FIRE
            </h1>
            <h2
              className="text-3xl font-bold tracking-[5px] uppercase leading-tight mt-0.5"
              style={{
                fontFamily: "'Teko', sans-serif",
                background: "linear-gradient(90deg,#FFD700,#FF8C00,#FFD700)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradientShift 3s linear infinite",
              }}
            >
              Premium Rewards
            </h2>

            {/* Decorative divider */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#FFD700]/50" />
              <span className="text-[#FFD700] text-lg">✦</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#FFD700]/50" />
            </div>
          </header>

          {/* ── UID Input ── */}
          <div
            className={`relative flex items-center mb-6 px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
              uidError
                ? "border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.4)] animate-[shake_0.4s_ease]"
                : "border-white/15 bg-white/5 focus-within:border-[#FFD700]/70 focus-within:shadow-[0_0_20px_rgba(255,215,0,0.2)] focus-within:bg-white/8"
            }`}
            style={{ backdropFilter: "blur(12px)" }}
          >
            {/* Icon */}
            <svg className="w-5 h-5 text-[#FFD700]/60 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter your Player UID"
              maxLength={13}
              value={uid}
              onChange={(e) => setUid(e.target.value.replace(/[^0-9]/g, "").slice(0, 13))}
              onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
              className="bg-transparent border-none text-white text-xl font-bold tracking-widest w-full outline-none placeholder:text-white/25 placeholder:font-normal placeholder:tracking-normal"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            />
            {uid.length > 0 && (
              <button
                onClick={() => setUid("")}
                className="text-white/30 hover:text-white/60 transition-colors ml-2 text-lg leading-none"
              >
                ✕
              </button>
            )}
          </div>

          {/* ── Rewards Grid ── */}
          <div className="flex flex-col gap-3 flex-1">

            {/* Error state */}
            {loadError && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="text-4xl">⚠️</div>
                <p className="text-red-400 font-semibold text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  Connection Failed. Please try again.
                </p>
                <button
                  onClick={() => { setLoadError(false); setLoading(true); }}
                  className="px-6 py-2 rounded-xl border border-[#FFD700]/40 text-[#FFD700] text-sm font-bold uppercase tracking-widest hover:bg-[#FFD700]/10 transition-colors"
                  style={{ fontFamily: "'Teko', sans-serif" }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Skeleton rows */}
            {loading && !loadError &&
              skeletonRows.map((_, ri) => (
                <div key={ri} className="flex gap-3">
                  {[0, 1, 2].map((ci) => <SkeletonCard key={ci} />)}
                </div>
              ))
            }

            {/* Real reward rows */}
            {!loading && rows.map((row, ri) => (
              <div key={ri} className="flex gap-3">
                {Array.from({ length: 3 }).map((_, ci) => {
                  const reward = row[ci];
                  if (!reward)
                    return <div key={ci} className="flex-1 opacity-0 pointer-events-none" />;
                  return (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      index={ri * 3 + ci}
                      isSelected={selectedIds.has(reward.id)}
                      onToggle={() => toggleCard(reward.id)}
                      onClaim={(e) => { e.stopPropagation(); handleClaim(true); }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* ── Sticky Claim Button ── */}
          <div className="sticky bottom-0 pt-4 pb-2 z-20 mt-5">
            {/* Selection count badge */}
            {selectedIds.size > 0 && (
              <div className="text-center mb-2 animate-[fadeIn_0.3s_ease]">
                <span className="text-xs font-bold text-[#FFD700]/80 tracking-widest uppercase"
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                  {selectedIds.size} Reward{selectedIds.size > 1 ? "s" : ""} Selected
                </span>
              </div>
            )}

            <button
              onClick={() => handleClaim(false)}
              disabled={loading}
              className="claim-btn relative block mx-auto w-4/5 max-w-xs py-3 rounded-2xl font-bold text-2xl uppercase tracking-[3px] text-black overflow-hidden transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Teko', sans-serif",
                background: "linear-gradient(135deg,#FFD700 0%,#FF8C00 50%,#FF4500 100%)",
                boxShadow: "0 0 25px rgba(255,215,0,0.4), 0 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              <span className="relative z-10">{loading ? "Loading..." : "Claim Now"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── Toast Popup ── */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          showToast ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
        onClick={closeToast}
      >
        <div
          className={`relative w-[88%] max-w-sm flex flex-col items-center text-center rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
            showToast ? "scale-100 translate-y-0" : "scale-75 translate-y-8"
          }`}
          style={{
            background: "linear-gradient(135deg,#0d0d1a 0%,#1a1a2e 50%,#0d0d1a 100%)",
            borderColor: "#FFD700",
            boxShadow: "0 0 60px rgba(255,215,0,0.5), inset 0 1px 0 rgba(255,215,0,0.15)",
            padding: "30px 20px 24px",
            fontFamily: "'Teko', sans-serif",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

          <h2 className="shine-text text-3xl font-extrabold tracking-widest uppercase mb-1">
            CONGRATULATIONS!
          </h2>

          <div className="text-6xl my-3 drop-shadow-lg animate-[bounce_1s_ease_3]">🎁</div>

          <div className="flex items-center gap-2 w-full mb-3">
            <div className="flex-1 h-px bg-[#FFD700]/20" />
            <span className="text-[#FFD700]/50 text-xs">✦</span>
            <div className="flex-1 h-px bg-[#FFD700]/20" />
          </div>

          <p
            className="shine-text w-full px-2 break-words text-center leading-snug mb-5 text-lg"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {settings?.popup_message ?? "Your Rewards Will Be Sent to Your Mail Box"}
          </p>

          <button
            onClick={closeToast}
            className="relative overflow-hidden px-10 py-2 rounded-xl font-extrabold text-2xl uppercase tracking-widest text-black transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg,#FFD700,#FF8C00)",
              fontFamily: "'Teko', sans-serif",
              boxShadow: "0 4px 20px rgba(255,215,0,0.5)",
            }}
          >
            <span className="relative z-10">OKAY</span>
            {/* Shine */}
            <span className="toast-btn-shine absolute inset-0" />
          </button>
        </div>
      </div>

      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Teko:wght@600;700&display=swap');

        /* ---------- Keyframes ---------- */
        @keyframes fadeInDown {
          from { opacity:0; transform:translateY(-24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
        @keyframes popIn {
          from { opacity:0; transform:scale(0.55); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position:-600px 0; }
          100% { background-position:600px 0; }
        }
        @keyframes textShine {
          0%   { background-position:-300% center; }
          100% { background-position:300% center; }
        }
        @keyframes gradientShift {
          0%   { background-position:0% center; }
          100% { background-position:200% center; }
        }
        @keyframes cardShine {
          0%   { left:-150%; }
          60%  { left:150%; }
          100% { left:150%; }
        }
        @keyframes claimShine {
          0%   { left:-150%; }
          25%  { left:150%; }
          100% { left:150%; }
        }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          20%,60% { transform:translateX(-6px); }
          40%,80% { transform:translateX(6px); }
        }
        @keyframes bounce {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-12px); }
        }

        /* ---------- Skeleton shimmer ---------- */
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.04) 0%,
            rgba(255,255,255,0.10) 30%,
            rgba(255,255,255,0.04) 60%
          );
          background-size: 600px 100%;
          animation: shimmer 1.4s linear infinite;
        }

        /* ---------- Glass panel ---------- */
        .glass-panel {
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255,255,255,0.06);
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        /* ---------- Shine text ---------- */
        .shine-text {
          background: linear-gradient(to right,#FFD700 0%,#fff 30%,#FFD700 50%,#FF8C00 70%,#FFD700 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: textShine 4s linear infinite;
        }

        /* ---------- Card shine pseudo ---------- */
        .shine-card::before {
          content:'';
          position:absolute;
          top:0; left:-150%;
          width:50%; height:100%;
          background:linear-gradient(to right,transparent 0%,rgba(255,255,255,0.18) 50%,transparent 100%);
          transform:skewX(-20deg);
          z-index:2;
          animation:cardShine 5s infinite;
          pointer-events:none;
        }

        /* ---------- Claim button shine ---------- */
        .claim-btn::after {
          content:'';
          position:absolute;
          inset:0;
          left:-150%;
          width:80%;
          background:linear-gradient(to right,transparent 0%,rgba(255,255,255,0.35) 50%,transparent 100%);
          transform:skewX(-20deg);
          animation:claimShine 3s infinite;
        }
        .claim-btn:active { transform:translateY(3px) scale(0.98); }
        .claim-btn:hover:not(:disabled) { filter:brightness(1.1); }

        /* ---------- Toast btn shine ---------- */
        .toast-btn-shine::after {
          content:'';
          position:absolute;
          inset:0; left:-150%;
          width:60%;
          background:linear-gradient(to right,transparent,rgba(255,255,255,0.35),transparent);
          transform:skewX(-20deg);
          animation:claimShine 2.5s infinite;
        }

        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </>
  );
}
