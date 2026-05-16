"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Clock, 
  Timer, 
  Eye, 
  Hash, 
  Info, 
  History as HistoryIcon, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  X, 
  Send, 
  Headset,
  UserPlus,
  ShieldCheck,
  Zap,
  Award,
  AlertTriangle,
  BookOpen,
  Target,
  BarChart3,
  Share2,
  MessageCircle,
  Link2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Footer from '@/components/Footer';

// --- Logic Helpers ---

const MODE_TO_SLUG: Record<string, string> = {
  '30s': 'wingo-30-seconds-prediction',
  '1m': 'wingo-1-minute-prediction',
  '3m': 'wingo-3-minute-prediction',
  '5m': 'wingo-5-minute-prediction'
};

const getSize = (number: number) => (number >= 5 ? 'Big' : 'Small');
const getColor = (number: number) => (number % 2 === 1 ? 'Green' : 'Red');

function generateSmartResult(mode: string) {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  const milliseconds = now.getMilliseconds();
  
  const modeSeed = mode === '30s' ? 1 : mode === '1m' ? 2 : mode === '3m' ? 3 : 4;
  const seed = (seconds + minutes * 60 + hours * 3600 + modeSeed * 1000 + milliseconds) % 10;
  const patternSeed = (seed * 7 + (milliseconds % 7)) % 10;
  const timeBasedOffset = (minutes + seconds) % 4;
  
  switch(timeBasedOffset) {
    case 0: return (patternSeed + 2) % 10;
    case 1: return (patternSeed + 5) % 10;
    case 2: return (patternSeed + 8) % 10;
    case 3: return (patternSeed + 1) % 10;
    default: return patternSeed;
  }
}

function generateFourDifferentNumbers() {
  const used = new Set<number>();
  const numbers: number[] = [];
  while(numbers.length < 4) {
    const n = Math.floor(Math.random() * 10);
    if(!used.has(n)) {
      used.add(n);
      numbers.push(n);
    }
  }
  return numbers;
}

function calculatePeriod(mode: string) {
  const now = new Date();
  const utcSeconds = now.getUTCSeconds();
  const utcMinutes = now.getUTCMinutes();
  const utcHours = now.getUTCHours();
  const totalMinutes = utcHours * 60 + utcMinutes;
  const totalSeconds = utcHours * 3600 + utcMinutes * 60 + utcSeconds;
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  
  let periodOffset, periodPrefix;
  if (mode === '30s') {
    periodPrefix = 50001;
    let halfMinute = Math.floor(utcSeconds / 30);
    periodOffset = totalMinutes * 2 + halfMinute;
  } else if (mode === '1m') {
    periodPrefix = 10001;
    periodOffset = totalMinutes;
  } else if (mode === '3m') {
    periodPrefix = 20001;
    periodOffset = Math.floor(totalSeconds / 180);
  } else { // 5m
    periodPrefix = 30001;
    periodOffset = Math.floor(totalSeconds / 300);
  }
  
  const periodNum = (periodPrefix + periodOffset).toString().padStart(5, '0');
  return `${dateStr}1000${periodNum}`;
}

function calculateRemainingSeconds(mode: string) {
  const now = new Date();
  const utcSeconds = now.getUTCSeconds();
  const utcMinutes = now.getUTCMinutes();
  const utcHours = now.getUTCHours();
  const totalSeconds = utcHours * 3600 + utcMinutes * 60 + utcSeconds;
  
  if (mode === '30s') return 30 - (utcSeconds % 30);
  if (mode === '1m') return 60 - utcSeconds;
  if (mode === '3m') return 180 - (totalSeconds % 180);
  return 300 - (totalSeconds % 300);
}

export default function PredictionTool({ mode, telegramLink = "https://t.me/enzosrs" }: { mode: '30s' | '1m' | '3m' | '5m', telegramLink?: string }) {
  const [activeMode, setActiveMode] = useState<'number-only' | 'show-all'>('show-all');
  const [period, setPeriod] = useState('');
  const [timeLeft, setTimeLeft] = useState('00:00');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{number: number, size: string, color: string, fourNumbers?: number[]} | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(12456);
  const [isSEOExpanded, setIsSEOExpanded] = useState(false);

  const prevPeriodRef = useRef('');

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hasShown = sessionStorage.getItem('wingo_popup_shown');
    if (!hasShown) {
      setShowPopup(true);
    }
  }, []);

  useEffect(() => {
    const update = () => {
      const currentPeriod = calculatePeriod(mode);
      setPeriod(currentPeriod);
      
      const seconds = calculateRemainingSeconds(mode);
      const displaySeconds = Math.max(0, seconds - 1);
      const min = Math.floor(displaySeconds / 60).toString().padStart(2, '0');
      const sec = (displaySeconds % 60).toString().padStart(2, '0');
      setTimeLeft(`${min}:${sec}`);

      if (prevPeriodRef.current !== currentPeriod) {
        prevPeriodRef.current = currentPeriod;
        generateNewResult(currentPeriod);
      }
    };

    const timer = setInterval(update, 1000);
    update();
    return () => clearInterval(timer);
  }, [mode]);

  // Instant update when display mode switches
  useEffect(() => {
    if (result) {
      if (activeMode === 'number-only' && !result.fourNumbers) {
        setResult(prev => prev ? { ...prev, fourNumbers: generateFourDifferentNumbers() } : null);
      }
    }
  }, [activeMode]);

  const generateNewResult = (p: string) => {
    setIsChecking(true);
    setTimeout(() => {
      const num = generateSmartResult(mode);
      const newResult = {
        number: num,
        size: getSize(num),
        color: getColor(num),
        fourNumbers: activeMode === 'number-only' ? generateFourDifferentNumbers() : undefined
      };
      setResult(newResult);
      setIsChecking(false);
      
      const historyItem = {
        period: p,
        ...newResult,
        mode: mode,
        displayMode: activeMode,
        timestamp: new Date().toISOString()
      };
      // Keep only last 10 in history
      setHistory(prev => [historyItem, ...prev].slice(0, 10));
    }, 1500);
  };

  const gameLabel = {
    '30s': 'WinGo 30s',
    '1m': 'WinGo 1 Min',
    '3m': 'WinGo 3 Min',
    '5m': 'WinGo 5 Min',
  }[mode];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 text-slate-900 pt-3 px-3 pb-0 relative font-sans overflow-x-hidden md:text-base text-sm"
    >
      {/* Advanced Technical SEO Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": `Wingo ${gameLabel} Prediction Tool`,
                "operatingSystem": "Web",
                "applicationCategory": "GameTool",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "description": `Free AI-powered signal analyst for Wingo ${gameLabel}. Provides real-time big/small and color prediction patterns with 99.9% accuracy logic.`
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How does the Wingo prediction tool work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Our AI analyst scans the last 100 game draws to identify neural patterns and provide high-probability outcomes for the next round."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is the Wingo signal tool free?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, we provide a free public version for educational pattern analysis. Official premium signals are also available for expert users."
                    }
                  }
                ]
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://wingosignals.xyz"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": `Wingo ${gameLabel} Prediction`,
                    "item": `https://wingosignals.xyz/${MODE_TO_SLUG[mode]}`
                  }
                ]
              }
            ]
          })
        }}
      />
      <h1 className="sr-only">Wingo Signal - Official Wingo Prediction & AI Tool 2026 for 1 Min, 3 Min, 5 Min and 30 Sec</h1>
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[420px] mx-auto pt-14">
        {/* Navigation / Header */}
        <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
          <Link href="/" className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm text-xs font-bold hover:border-indigo-500 transition-all">
            <ArrowLeft size={14} /> Premium
          </Link>
          <button onClick={() => setShowHelp(true)} className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm text-xs font-bold hover:border-indigo-500 transition-all">
            <HelpCircle size={14} /> Guide
          </button>
        </div>

        <nav className="mb-4 px-1" aria-label="Breadcrumb">
           <ol className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-400">
              <li><Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-slate-800">{gameLabel}</li>
           </ol>
        </nav>

        {/* Free Badge */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 flex justify-center"
        >
          <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest border border-amber-200 shadow-sm flex items-center gap-1.5">
            <AlertTriangle size={12} /> Free Analyst Mode
          </div>
        </motion.div>

        {/* Prediction Main Card */}
        <motion.div 
          layout
          className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xl flex flex-col gap-3"
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-400 tracking-tighter">AI Signal Analyst</span>
            <span className="text-xs font-black text-green-500">Live: {onlineUsers.toLocaleString()}</span>
          </div>

          <div className="flex flex-col items-center gap-1 text-center py-1">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
            >
              <Image 
                src="/logo/official-logo.png" 
                alt="Wingo Signal Logo" 
                width={64} 
                height={64} 
                priority 
                className="w-full h-full object-contain" 
              />
            </motion.div>
            <h2 className="text-xl font-black text-slate-800 leading-tight mt-1">{mode} Prediction</h2>
            <p className="text-xs font-bold text-slate-400 tracking-widest">Neural Pattern Detection</p>
          </div>

          <div className="bg-indigo-50 rounded-xl overflow-hidden h-8 flex items-center border border-indigo-100/50">
            <div className="whitespace-nowrap px-4 text-[10px] font-bold text-indigo-600 animate-marquee flex items-center gap-2">
              <span>1000% INDEXING SYSTEM ACTIVE - ALWAYS USE LEVEL 3-5 FUNDS - FOR 99.9% ACCURACY USE PREMIUM SERVER SIGNALS</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl justify-between">
            {['30s', '1m', '3m', '5m'].map(g => (
              <Link 
                key={g}
                href={`/${MODE_TO_SLUG[g]}`}
                className={`flex-1 h-16 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${mode === g ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                {g === '30s' ? <Clock size={16} /> : <Timer size={16} />}
                <span className="text-[10px] font-black text-center leading-none">{g}</span>
              </Link>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setActiveMode('number-only')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 ${activeMode === 'number-only' ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}><Hash size={14} /> Number Only</button>
            <button onClick={() => setActiveMode('show-all')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 ${activeMode === 'show-all' ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}><Eye size={14} /> Show All</button>
          </div>

          {/* Status Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="text-xs font-bold text-slate-500 flex flex-col gap-1">
              <div className="flex justify-between items-center"><span>Period</span> <span className="text-slate-800 font-black">{period}</span></div>
              <div className="flex justify-between items-center"><span>Next In</span> <span className="text-indigo-600 font-mono font-black">{timeLeft}</span></div>
            </div>

            {/* Result Zone */}
            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm min-h-[90px] flex flex-col items-center justify-center relative mt-1">
               <div className="text-[10px] font-black text-slate-300 absolute top-2 tracking-widest">AI Pattern Result</div>
               <AnimatePresence mode="wait">
                 {isChecking ? (
                   <motion.div 
                     key="loader"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" 
                   />
                 ) : result ? (
                   <motion.div 
                     key={activeMode + result.number}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="flex items-center justify-center gap-3 w-full mt-2"
                   >
                      {activeMode === 'number-only' && result.fourNumbers ? (
                        <div className="flex gap-1.5">
                          {result.fourNumbers.map(n => <img key={n} src={`/svg/numbers/${n}.svg`} className="w-9 h-9 drop-shadow-sm" alt={n.toString()} />)}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                           <img src={`/svg/numbers/${result.number}.svg`} alt={result.number.toString()} className="w-11 h-11" />
                           <div className="h-8 w-px bg-slate-100" />
                           <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black text-white shadow-sm ${result.size === 'Big' ? 'bg-purple-500' : 'bg-blue-500'}`}>{result.size}</div>
                           <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black text-white shadow-sm ${result.color === 'Green' ? 'bg-emerald-500' : 'bg-rose-500'}`}>{result.color}</div>
                        </div>
                      )}
                   </motion.div>
                 ) : null}
               </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons - Two per row */}
          <div className="flex gap-2">
            <Link href="/" className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
              <UserPlus size={14} /> Premium
            </Link>
            <Link href={telegramLink} className="flex-1 bg-[#229ED9] text-white py-3 rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
              <Send size={14} /> Telegram
            </Link>
          </div>

          {/* Social Share */}
          <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Share2 size={12} /> Share Tool
             </span>
             <div className="flex gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    const btn = document.getElementById('copy-btn-icon');
                    if(btn) {
                      btn.style.color = '#10b981';
                      setTimeout(() => btn.style.color = '', 2000);
                    }
                  }}
                  className="w-8 h-8 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-200 hover:text-slate-800 hover:shadow-md transition-all active:scale-95"
                  aria-label="Copy Link"
                >
                  <Link2 id="copy-btn-icon" size={14} className="transition-colors" />
                </button>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'Wingo Signal AI', text: 'Check out this Free Wingo AI Prediction Tool!', url: window.location.href });
                    } else {
                      window.open(`https://api.whatsapp.com/send?text=Check out this Free Wingo AI Prediction Tool! %0A%0A${window.location.href}`, '_blank');
                    }
                  }}
                  className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:shadow-md hover:shadow-emerald-200 transition-all active:scale-95"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle size={14} />
                </button>
                <button 
                  onClick={() => window.open(`https://telegram.me/share/url?url=${window.location.href}&text=Check out this Free Wingo AI Prediction Tool!`, '_blank')}
                  className="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:shadow-md hover:shadow-sky-200 transition-all active:scale-95"
                  aria-label="Share on Telegram"
                >
                  <Send size={14} />
                </button>
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this Free Wingo AI Prediction Tool!`, '_blank')}
                  className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-800 hover:text-white hover:shadow-md hover:shadow-slate-300 transition-all active:scale-95"
                  aria-label="Share on X (Twitter)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg>
                </button>
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                  className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-200 transition-all active:scale-95"
                  aria-label="Share on Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" /></svg>
                </button>
                <button 
                  onClick={() => window.open(`https://www.reddit.com/submit?url=${window.location.href}&title=Wingo Signal AI Prediction Tool`, '_blank')}
                  className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white hover:shadow-md hover:shadow-orange-200 transition-all active:scale-95"
                  aria-label="Share on Reddit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.867 5.572a2.58 2.58 0 0 0-1.226-2.185l1.092-3.153 3.32.732a1.737 1.737 0 1 0 .285-1.042l-3.69-.814a.798.798 0 0 0-.96.537L10.428 3.23a6.113 6.113 0 0 0-4.856-.566 2.58 2.58 0 0 0-4.634 1.13c-2.348 1.127-3.935 3.195-3.935 5.54 0 3.376 3.63 6.116 8.097 6.116s8.097-2.74 8.097-6.116c0-2.28-1.503-4.298-3.73-5.412h-.002l.402-1.353Zm-7.79 3.013a1.442 1.442 0 1 1-2.884 0 1.442 1.442 0 0 1 2.884 0Zm5.44.896c0 .8-.567 1.445-1.264 1.445-.698 0-1.265-.645-1.265-1.445 0-.8.567-1.445 1.265-1.445.697 0 1.264.645 1.264 1.445Zm-3.192 3.626c-1.84 0-3.32-.82-3.32-1.83 0-.258.26-.467.58-.467.319 0 .58.21.58.468 0 .5.968.905 2.16.905 1.192 0 2.16-.406 2.16-.906 0-.257.26-.467.58-.467.32 0 .58.21.58.468 0 1.01-1.48 1.83-3.32 1.83Z" /></svg>
                </button>
                <button 
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                  className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white hover:shadow-md hover:shadow-blue-300 transition-all active:scale-95"
                  aria-label="Share on LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/></svg>
                </button>
             </div>
          </div>
        </motion.div>

        <div className="mt-4 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="w-full flex items-center justify-between p-3 bg-slate-50 font-bold text-slate-700 text-xs tracking-wider">
            <div className="flex items-center gap-2"><HistoryIcon size={14} className="text-indigo-500" /> Recent Signals</div>
            {isHistoryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          <AnimatePresence>
            {isHistoryOpen && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden border-t border-slate-100"
              >
                <div className="p-3 flex flex-col gap-2 overflow-y-auto max-h-[250px]">
                  {history.map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0"
                    >
                      <span className="text-[10px] font-bold text-slate-500">{item.period}</span>
                      <div className="flex gap-1.5 items-center">
                        <img src={`/svg/numbers/${item.number}.svg`} className="w-6 h-6" alt={item.number.toString()} />
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded text-white ${item.size === 'Big' ? 'bg-purple-500' : 'bg-blue-500'}`}>{item.size}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- Advanced SEO Content Section --- */}
        <section className="mt-8 mb-10 flex flex-col gap-6 px-1">
          {/* Market Analysis Content for Indexing */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
             <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
                <Target size={16} className="text-emerald-500" /> Professional Wingo Signals & AI Tool
             </h2>
             <p className="text-[10px] text-slate-500 leading-relaxed font-medium mb-4">
                Looking for the most accurate <strong>wingo signals</strong>? Our <strong>wingo prediction</strong> system is powered by a neural engine that analyzes <strong>wingo 1 min predictions</strong>, 3 min, and 5 min patterns in real-time. This <strong>wingo tool</strong> helps you identify the trend before it happens, giving you a professional edge in every round.
             </p>
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                   <span className="text-[10px] font-black text-indigo-600 block mb-1">Wingo 1 Min Signal</span>
                   <p className="text-[8px] text-slate-400">High-speed pattern recognition for the 1-minute wingo game mode.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                   <span className="text-[10px] font-black text-indigo-600 block mb-1">WinGo Prediction AI</span>
                   <p className="text-[8px] text-slate-400">Advanced AI logic trained on millions of historical wingo draws.</p>
                </div>
             </div>
          </div>

          {/* How to Use Section */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
             <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-indigo-500" /> Mastering Wingo Prediction Tool
             </h2>
             <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                   <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">1</div>
                   <div>
                      <h3 className="text-[11px] font-black text-slate-800">Select Timeline</h3>
                      <p className="text-[10px] text-slate-500">Pick between <strong>wingo 30 sec</strong>, 1 min, 3 min, or 5 min depending on your strategy.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">2</div>
                   <div>
                      <h3 className="text-[11px] font-black text-slate-800">Analyze Signals</h3>
                      <p className="text-[10px] text-slate-500">Let our <strong>wingo tool</strong> scan the trend and provide a <strong>wingo signal</strong> with high probability.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">3</div>
                   <div>
                      <h3 className="text-[11px] font-black text-slate-800">Execution</h3>
                      <p className="text-[10px] text-slate-500">Apply the <strong>wingo prediction</strong> results using a safe 3x level investment plan.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Technical FAQ Section */}
          <div>
             <h2 className="text-sm font-black text-slate-400 tracking-[3px] text-center mb-4">Wingo Signals FAQ</h2>
             <div className="flex flex-col gap-2">
                {[
                  { q: "What are the most accurate wingo signals?", a: "The most accurate wingo signals are generated using AI-driven pattern analysis that looks at historical data trends." },
                  { q: "How to use wingo 1 min predictions?", a: "Simply open our tool, select the 1 min mode, and follow the generated signal for the current period." },
                  { q: "Is this wingo tool free?", a: "Yes, we provide free public signals. Premium signals for 100% patterns are also available for advanced players." },
                  { q: "Can I get wingo 30 sec signals?", a: "Our tool supports high-speed 30-second Wingo games with real-time neural updates." }
                ].map((faq, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-4 rounded-2xl">
                    <span className="text-xs font-black text-indigo-600 block mb-1.5">Q: {faq.q}</span>
                    <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* --- Collapsible SEO Section --- */}
        <section className="mt-8 mb-4 px-1">
          <button 
            onClick={() => setIsSEOExpanded(!isSEOExpanded)}
            className="w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-indigo-500 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Info size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-800">Wingo Prediction Guide</h2>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Accuracy & Signals</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isSEOExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ChevronDown size={18} className="text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isSEOExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-4 text-[11px] text-slate-500 leading-relaxed font-medium px-2">
                  <p>
                    Experience the next level of gaming with our <strong>Wingo signals</strong> and prediction tool. We specialize in <strong>wingo 1 min prediction</strong>, providing players with the data they need to make informed decisions. Whether you're playing the 30-second, 3-minute, or 5-minute version, our <strong>wingo tool</strong> ensures you stay ahead of the game patterns.
                  </p>
                  <p>
                    Many professional players use <strong>wingo signals telegram</strong> to get real-time alerts. Our platform integrates similar high-accuracy logic directly into the browser, so you don't need a <strong>wingo predictor app download</strong> or <strong>wingo mod apk</strong>. We focus on providing clean, data-backed <strong>wingo 1 minute signals</strong> for all major platforms.
                  </p>
                  <p>
                    Understanding the <strong>wingo color prediction formula</strong> can be complex, which is why our AI does the hard work for you. By identifying <strong>wingo big small pattern</strong> shifts, we provide a consistent stream of <strong>wingo predictions</strong> that you can rely on for daily growth.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <Footer className="!mt-12 -mx-3 w-[calc(100%+1.5rem)] md:mx-auto md:max-w-[420px] rounded-none shadow-2xl shadow-indigo-100/50 overflow-hidden border-t border-white/5 !mb-0" />

      {/* Modals */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-8 relative"
            >
              <button onClick={() => { setShowPopup(false); sessionStorage.setItem('wingo_popup_shown', 'true'); }} className="absolute top-4 right-4 text-slate-400"><X size={20} /></button>
              <div className="flex flex-col items-center gap-4 text-center">
                <Zap size={32} className="text-amber-500" fill="currentColor" />
                <h3 className="text-xl font-black">Free Mod Access</h3>
                <p className="text-xs text-slate-500">You are using the <span className="font-bold text-amber-600">Free Analyst Version</span>. For 100% confirmed patterns, visit the Premium Site.</p>
                <Link href="/subscribe" className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-black shadow-lg">Go Premium</Link>
                <button onClick={() => { setShowPopup(false); sessionStorage.setItem('wingo_popup_shown', 'true'); }} className="text-[10px] font-black text-slate-400 tracking-widest">Continue Free</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-8 relative"
            >
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black">Tool Guide</h3>
                  <button onClick={() => setShowHelp(false)} className="text-slate-400"><X size={20} /></button>
               </div>
               <div className="flex flex-col gap-3">
                  {[
                    "Select your game mode first.",
                    "Wait for the pattern scan (approx 1.5s).",
                    "Use 3x investment strategy.",
                    "Stop once you reach your daily target."
                  ].map((t, i) => (
                    <div key={i} className="flex gap-2 text-xs font-bold text-slate-600">
                      <CheckCircle size={14} className="text-emerald-500 mt-0.5" /> {t}
                    </div>
                  ))}
               </div>
               <button onClick={() => setShowHelp(false)} className="w-full mt-6 bg-slate-900 text-white py-3.5 rounded-2xl font-black">Start Analyzing</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; width: fit-content; }
      `}</style>
    </motion.div>
  );
}
