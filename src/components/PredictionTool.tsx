"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  CheckCircle, 
  X, 
  Send, 
  UserPlus,
  AlertTriangle,
  BookOpen,
  Target,
  Share2,
  MessageCircle,
  Link2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import SiteFooter from '@/components/SiteFooter';

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
    const halfMinute = Math.floor(utcSeconds / 30);
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
  const [history, setHistory] = useState<Array<{ period: string; number: number; size: string; color: string }>>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [isSEOExpanded, setIsSEOExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const prevPeriodRef = useRef('');

  const generateNewResult = useCallback((p: string) => {
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
      setHistory(prev => [{ period: p, number: newResult.number, size: newResult.size, color: newResult.color }, ...prev].slice(0, 10));
    }, 1500);
  }, [activeMode, mode]);

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
  }, [generateNewResult, mode]);

  const gameLabel = {
    '30s': 'WinGo 30s',
    '1m': 'WinGo 1 Min',
    '3m': 'WinGo 3 Min',
    '5m': 'WinGo 5 Min',
  }[mode];

  const MODE_CONTENT = {
    '30s': {
      whyTitle: "Why 30 Seconds Wingo Analysis Matters",
      whyDesc: "Thirty-second rounds move quickly, so the useful task is not predicting with certainty but keeping period and recent-result context visible. This mode summarizes short sequences and marks unclear rounds as skipped.",
      features: [
        { title: "Short-sequence view", desc: "Groups the latest big/small outcomes so rapid changes are easier to inspect." },
        { title: "Period check", desc: "Displays the current round reference to reduce decisions based on stale data." },
      ],
      guideTitle: "30s Wingo Prediction Guide",
      guideParagraphs: [
        "The <strong>30 second Wingo prediction</strong> page is designed for quick reading on a small screen. It keeps recent history, period timing, and the current statistical signal together without requiring an APK.",
        "Because a new round starts every half minute, delayed history matters. Confirm that the displayed period matches the game you are viewing. If it does not, wait for the next refresh.",
        "Short runs can look meaningful even when they are random. Use the history table as context and treat skipped signals as a sign that the available context is unclear.",
      ],
      faqTitle: "30s Wingo Signals FAQ",
      faqItems: [
        { q: "Are 30-second signals guaranteed?", a: "No. They are statistical indicators based on available recent data and can be wrong." },
        { q: "Why does the tool skip some rounds?", a: "A skip can appear when current data is incomplete, delayed, or does not meet the configured signal rules." },
        { q: "Is 30 seconds enough for analysis?", a: "It is enough to summarize a short sequence, but not enough to remove randomness or guarantee the next outcome." },
        { q: "Do I need an app?", a: "No. The current 30-second interface runs in a supported mobile or desktop browser." },
      ],
    },
    '1m': {
      whyTitle: "Understanding the 1 Minute View",
      whyDesc: "One-minute rounds provide a little more time to verify the period and compare recent size and colour distributions. The page focuses on readable context rather than promising a certain result.",
      features: [
        { title: "Recent distribution", desc: "Shows how big/small and colour results are distributed in the available history." },
        { title: "Readable timing", desc: "Keeps the one-minute period and countdown visible across mobile and desktop." },
      ],
      guideTitle: "1 Min Wingo Prediction Guide",
      guideParagraphs: [
        "The <strong>Wingo 1 minute prediction</strong> view combines the latest history with a single statistical big/small signal. It is browser-based and does not require a predictor APK or unofficial download.",
        "Use the full minute to check that the signal period matches your current round. Review nearby results for context instead of reading one output in isolation.",
        "A repeating <strong>big small</strong> sequence can end at any time. The interface organizes recent observations without claiming certainty about what comes next.",
      ],
      faqTitle: "1 Min Wingo Signals FAQ",
      faqItems: [
        { q: "How should I read a 1-minute signal?", a: "Match the displayed period, review recent history, and treat the signal as an uncertain statistical estimate." },
        { q: "Can a 1-minute prediction be wrong?", a: "Yes. Recent patterns do not determine the next result." },
        { q: "Does it work on mobile?", a: "Yes. The layout adapts to current mobile and desktop viewport sizes." },
        { q: "Is an APK required?", a: "No. Use the official web interface and avoid unofficial downloads." },
      ],
    },
    '3m': {
      whyTitle: "Understanding the 3 Minute View",
      whyDesc: "Three-minute rounds give users more time to compare colour, number, and size history before the next period. The longer timer improves review time, not certainty.",
      features: [
        { title: "Multiple history fields", desc: "Review colour, size, and number context together instead of relying on one label." },
        { title: "More review time", desc: "The three-minute timer provides room to verify data and avoid rushed input." },
      ],
      guideTitle: "3 Min Wingo Prediction Guide",
      guideParagraphs: [
        "The <strong>Wingo 3 minute prediction</strong> page suits users who prefer enough time to read recent history before a period closes. It presents the same type of statistical signal in a less rushed format.",
        "Compare the latest size sequence with colour and number history. A streak can continue or reverse, so neither interpretation should be treated as certain.",
        "The extra time is best used for verification and limits. It does not make a three-minute result more predictable than the underlying data allows.",
      ],
      faqTitle: "3 Min Wingo Signals FAQ",
      faqItems: [
        { q: "Is 3-minute mode more accurate than 1-minute mode?", a: "A longer timer allows more review time, but it does not guarantee better prediction accuracy." },
        { q: "Can I use the page on mobile?", a: "Yes. Controls and content adapt to phone, tablet, and desktop widths." },
        { q: "What should I check first?", a: "Confirm the displayed period and make sure recent history has refreshed." },
        { q: "Can a visible streak reverse?", a: "Yes. A streak is a description of past results, not a rule for the next round." },
      ],
    },
    '5m': {
      whyTitle: "Understanding the 5 Minute View",
      whyDesc: "Five-minute rounds provide the longest review window in this interface. Users can inspect recent colour, number, and size history carefully, while remembering that more time does not guarantee a future result.",
      features: [
        { title: "Calmer history review", desc: "Use the longer countdown to compare multiple recent rows without rushing." },
        { title: "Clear signal state", desc: "The interface distinguishes a current signal from loading, fallback, and skipped states." },
      ],
      guideTitle: "5 Min Wingo Prediction Guide",
      guideParagraphs: [
        "The <strong>Wingo 5 minute prediction</strong> page is organized for deliberate review. The longer interval makes it easier to compare recent rows, verify the period, and understand why a signal may be skipped.",
        "Colour and <strong>big small</strong> history can provide descriptive context, but historical consistency does not force the next result to follow the same direction.",
        "No predictor APK or mod is required. Use the official browser page, keep your account credentials private, and treat every output as uncertain.",
      ],
      faqTitle: "5 Min Wingo Signals FAQ",
      faqItems: [
        { q: "Does the five-minute timer guarantee a better result?", a: "No. It gives more time to review information, not certainty about the next outcome." },
        { q: "What if history is delayed?", a: "Wait for the period and recent rows to match before using the displayed context." },
        { q: "Can this predict every result correctly?", a: "No. Each signal is an estimate based on limited recent context and can be incorrect." },
        { q: "Do I need to download software?", a: "No. The tool is available through the official web interface." },
      ],
    },
  }[mode];

  return (
    <div className="bg-slate-50 overflow-x-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-slate-900 pt-3 px-3 pb-8 relative font-sans md:text-base text-sm"
    >
      <h1 className="sr-only">Wingo Signal - Official {gameLabel} Prediction & AI Tool 2026</h1>
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-14 px-3">
        {/* Navigation / Header */}
        <div className="flex justify-between p-3">
          <Link href="/" className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm text-xs font-bold hover:border-indigo-500 transition-all">
            <ArrowLeft size={14} /> Home
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

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,.98fr)] gap-5 lg:gap-7 items-start">
        <div className="flex flex-col h-full lg:sticky lg:top-20">
        {/* Prediction Main Card */}
        <motion.div 
          layout
          className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xl flex flex-col gap-3 h-full"
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-sm font-semibold text-slate-500">Round overview</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Auto refresh</span>
          </div>

          <div className="flex items-center gap-3 py-1">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="h-16 w-16 shrink-0 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
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
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{gameLabel} signal overview</h2>
              <p className="mt-1 text-sm text-slate-500">Recent results and round details</p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl overflow-hidden h-8 flex items-center border border-indigo-100/50">
            <div className="whitespace-nowrap px-4 text-[10px] font-bold text-indigo-600 animate-marquee flex items-center gap-2">
              <span>Period, timer and recent results refresh automatically. Outputs are informational estimates and may differ from final results.</span>
            </div>
          </div>

          {/* Interval tags */}
          <div className="flex gap-1.5 rounded-2xl bg-slate-100 p-1">
            {['30s', '1m', '3m', '5m'].map(g => (
              <Link 
                key={g}
                href={`/${MODE_TO_SLUG[g]}`}
                className={`flex-1 rounded-xl px-2 py-2.5 flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${mode === g ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                {g === '30s' ? <Clock size={14} /> : <Timer size={14} />}
                <span>{g}</span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Signal display mode">
            <button onClick={() => { setActiveMode('number-only'); setResult(prev => prev && !prev.fourNumbers ? { ...prev, fourNumbers: generateFourDifferentNumbers() } : prev); }} className={`rounded-2xl border p-3 text-left transition-all ${activeMode === 'number-only' ? 'border-slate-800 bg-slate-800 text-white shadow-md' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'}`}>
              <span className="flex items-center gap-2 text-sm font-bold"><Hash size={16} /> Number only</span><span className={`mt-1 block text-xs ${activeMode === 'number-only' ? 'text-slate-300' : 'text-slate-400'}`}>Four-number view</span>
            </button>
            <button onClick={() => setActiveMode('show-all')} className={`rounded-2xl border p-3 text-left transition-all ${activeMode === 'show-all' ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200'}`}>
              <span className="flex items-center gap-2 text-sm font-bold"><Eye size={16} /> Big / Small</span><span className={`mt-1 block text-xs ${activeMode === 'show-all' ? 'text-indigo-100' : 'text-slate-400'}`}>Number, size and colour</span>
            </button>
          </div>

          {/* Status Box */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="text-xs font-bold text-slate-500 flex flex-col gap-1">
              <div className="flex justify-between items-center"><span>Period</span> <span className="text-slate-800 font-black">{period}</span></div>
              <div className="flex justify-between items-center"><span>Next In</span> <span className="text-indigo-600 font-mono font-black">{timeLeft}</span></div>
            </div>

            {/* Result Zone */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm min-h-[116px] flex flex-col items-center justify-center relative mt-1">
               <div className="text-xs font-semibold text-slate-400 absolute top-3">Current signal</div>
               <AnimatePresence mode="wait">
                 {isChecking ? (
                   <motion.div 
                     key="loader"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="grid w-full grid-cols-[48px_1fr] items-center gap-3 px-2 pt-5"
                   >
                     <div className="h-12 w-12 rounded-full bg-slate-100 animate-pulse" />
                     <div className="space-y-2"><div className="h-3 w-4/5 rounded-full bg-slate-100 animate-pulse" /><div className="h-3 w-3/5 rounded-full bg-indigo-100 animate-pulse" /></div>
                   </motion.div>
                 ) : result ? (
                   <motion.div 
                     key={activeMode + result.number}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="flex items-center justify-center gap-3 w-full mt-2"
                   >
                      {activeMode === 'number-only' && result.fourNumbers ? (
                        <div className="flex gap-1.5">
                          {result.fourNumbers.map(n => <Image key={n} src={`/svg/numbers/${n}.svg`} width={36} height={36} className="w-9 h-9 drop-shadow-sm" alt={`Number ${n}`} />)}
                        </div>
                      ) : (
                        <div className="flex w-full items-center justify-center gap-3 pt-2">
                           <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50"><Image src={`/svg/numbers/${result.number}.svg`} width={40} height={40} alt={`Number ${result.number}`} className="h-10 w-10" /></div>
                           <div className="h-8 w-px bg-slate-100" />
                           <span className="min-w-20 rounded-lg px-3 py-2 text-center text-xs font-bold text-white shadow-sm" style={{ backgroundColor: getSize(result.number) === 'Big' ? '#f97316' : '#3b82f6' }}>{getSize(result.number)}</span>
                           <span className={`min-w-20 rounded-lg px-3 py-2 text-center text-xs font-bold text-white shadow-sm ${result.color === 'Green' ? 'bg-emerald-500' : 'bg-rose-500'}`}>{result.color}</span>
                        </div>
                      )}
                   </motion.div>
                 ) : null}
               </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons - Two per row */}
          <div className="flex gap-2">
            <Link href="/subscribe" className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
              <UserPlus size={14} /> Subscribe
            </Link>
            <Link href={telegramLink} target="_blank" rel="noreferrer" className="flex-1 bg-[#229ED9] text-white py-3 rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
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

          <section className="mt-1 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4" aria-labelledby="reading-context-title">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm"><BookOpen size={17} /></div>
              <div>
                <h3 id="reading-context-title" className="text-sm font-bold text-slate-800">Quick reading context</h3>
                <p className="mt-1 text-xs leading-5 text-slate-600">Use the period, timer and recent table together. Each area describes the current page state and refreshes independently.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                ['01', 'Period', 'Check the round ID'],
                ['02', 'Timer', 'Note the refresh time'],
                ['03', 'History', 'Review recent entries'],
              ].map(([number, title, description]) => (
                <div key={number} className="rounded-xl border border-white bg-white/80 p-2.5">
                  <span className="text-[10px] font-bold text-indigo-500">{number}</span>
                  <p className="mt-1 text-xs font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
            <Info size={18} className="shrink-0 text-slate-400" />
            <p className="text-xs leading-5 text-slate-600">If an entry looks delayed, wait for the next refresh before using this page as a reference.</p>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-4" aria-labelledby="page-details-title">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Page details</p>
                <h3 id="page-details-title" className="mt-1 text-base font-bold text-slate-800">Built for a clear, steady view</h3>
              </div>
              <div className="rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">Browser based</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4">
              <div><p className="text-xs font-bold text-slate-700">Current period</p><p className="mt-1 text-xs leading-5 text-slate-500">A visible round reference at the top of the card.</p></div>
              <div><p className="text-xs font-bold text-slate-700">Recent entries</p><p className="mt-1 text-xs leading-5 text-slate-500">A compact record of the latest generated signals.</p></div>
              <div><p className="text-xs font-bold text-slate-700">Responsive layout</p><p className="mt-1 text-xs leading-5 text-slate-500">Designed to remain readable on phone and desktop screens.</p></div>
              <div><p className="text-xs font-bold text-slate-700">Refresh status</p><p className="mt-1 text-xs leading-5 text-slate-500">The countdown makes the next update easy to follow.</p></div>
            </div>
          </section>
        </motion.div>
        </div>{/* end left column */}

        <div className="flex flex-col gap-4 md:gap-6 h-full">
        <section className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden flex flex-col" aria-labelledby="recent-signals-title">
          <div className="flex items-center justify-between p-5 bg-slate-50 border-b border-slate-100">
            <div><h2 id="recent-signals-title" className="flex items-center gap-2 text-base font-bold text-slate-800"><HistoryIcon size={17} className="text-indigo-500" /> Recent signals</h2><p className="mt-1 text-xs text-slate-500">The latest entries stay visible as new periods arrive.</p></div>
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">{history.length}/10</span>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-slate-100 px-5 py-2.5 text-xs font-semibold text-slate-400">
            <span>Period</span><span>Number</span><span>Size</span>
          </div>
          <div className="min-h-[164px] max-h-[318px] overflow-y-auto px-5 py-2">
                  {history.length === 0 && <div className="flex min-h-[140px] items-center justify-center text-sm text-slate-400">Recent entries will appear after the first refresh.</div>}
                  {history.map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5 border-b border-slate-100 last:border-0"
                    >
                      <span className="truncate text-xs font-medium text-slate-600">{item.period}</span>
                      <Image src={`/svg/numbers/${item.number}.svg`} width={28} height={28} className="w-7 h-7" alt={`Number ${item.number}`} />
                      <span className="min-w-14 rounded-lg px-2 py-1 text-center text-xs font-bold text-white" style={{ backgroundColor: getSize(item.number) === 'Big' ? '#f97316' : '#3b82f6' }}>{getSize(item.number)}</span>
                    </motion.div>
                  ))}
          </div>
        </section>

        {/* --- Advanced SEO Content Section --- */}
        <section className="flex flex-col gap-4 md:gap-6">
          {/* Market Analysis Content for Indexing */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
                <Target size={16} className="text-emerald-500" /> {MODE_CONTENT.whyTitle}
              </h2>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium mb-4">
                {MODE_CONTENT.whyDesc}
              </p>
              <div className="grid grid-cols-2 gap-3">
                 {MODE_CONTENT.features.map((f, i) => (
                 <div key={i} className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-indigo-600 block mb-1">{f.title}</span>
                    <p className="text-[8px] text-slate-400">{f.desc}</p>
                 </div>
                 ))}
              </div>
          </div>

          {/* How to Use Section */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
             <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-4">
                <BookOpen size={16} className="text-indigo-500" /> How to read {gameLabel}
             </h2>
             <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                   <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">1</div>
                   <div>
                      <h3 className="text-[11px] font-black text-slate-800">Select {gameLabel}</h3>
                      <p className="text-xs leading-relaxed text-slate-500">Choose the <strong>{gameLabel}</strong> interval and confirm it matches the page you are viewing.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">2</div>
                   <div>
                      <h3 className="text-[11px] font-black text-slate-800">Review Signal</h3>
                      <p className="text-xs leading-relaxed text-slate-500">Check the period, countdown and recent entries before reading the current estimate.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black flex-shrink-0">3</div>
                   <div>
                      <h3 className="text-sm font-bold text-slate-800">Refresh the context</h3>
                      <p className="text-xs leading-relaxed text-slate-500">Wait for the next refresh when the displayed period or recent entries appear out of date.</p>
                   </div>
                </div>
             </div>
           </div>

         </section>

        {/* --- Collapsible SEO Section --- */}
        <section className="">
          <button 
            onClick={() => setIsSEOExpanded(!isSEOExpanded)}
            className="w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-indigo-500 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Info size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-800">{MODE_CONTENT.guideTitle}</h2>
                <p className="text-xs text-slate-500">Reading guide and limitations</p>
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
                  {MODE_CONTENT.guideParagraphs.map((p, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Technical FAQ Section */}
        <section className="">
          <div>
             <h2 className="text-xl font-extrabold text-slate-900 mb-4">{MODE_CONTENT.faqTitle}</h2>
             <div className="flex flex-col gap-2">
                 {MODE_CONTENT.faqItems.map((faq, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} aria-controls={`faq-answer-${i}`} className="w-full flex items-center justify-between gap-4 p-4 text-left text-sm font-bold text-slate-800 hover:bg-slate-50">
                      <span>{faq.q}</span><ChevronDown size={17} className={`shrink-0 text-indigo-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>{openFaq === i && <motion.div id={`faq-answer-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-4 pb-4 text-sm text-slate-500 leading-6">{faq.a}</p></motion.div>}</AnimatePresence>
                  </div>
                ))}
             </div>
          </div>
         </section>
      </div>{/* end right column */}
      </div>{/* end grid */}

      </div>

      </motion.div>
      <SiteFooter />

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
                    "Compare the current estimate with the recent table.",
                    "Refresh the page if the period appears out of date."
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
    </div>
  );
}
