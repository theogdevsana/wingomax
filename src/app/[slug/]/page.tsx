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
  History, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  X, 
  Send, 
  Headset,
  UserPlus,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// --- Logic Helpers ---

const SLUG_MAP: Record<string, '30s' | '1m' | '3m' | '5m'> = {
  'wingo-30-seconds-prediction': '30s',
  'wingo-1-minute-prediction': '1m',
  'wingo-3-minute-prediction': '3m',
  'wingo-5-minute-prediction': '5m'
};

const MODE_TO_SLUG: Record<string, string> = {
  '30s': 'wingo-30-seconds-prediction',
  '1m': 'wingo-1-minute-prediction',
  '3m': 'wingo-3-minute-prediction',
  '5m': 'wingo-5-minute-prediction'
};

const getSize = (number: number) => (number >= 5 ? 'BIG' : 'SMALL');
const getColor = (number: number) => (number % 2 === 1 ? 'GREEN' : 'RED');
const isOdd = (number: number) => number % 2 === 1;

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

function generateFourDifferentNumbers(period: string, mode: string) {
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

// --- Components ---

export default function PredictionPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const activeGame = SLUG_MAP[slug] || '1m';

  const [activeMode, setActiveMode] = useState<'number-only' | 'show-all'>('show-all');
  const [period, setPeriod] = useState('');
  const [timeLeft, setTimeLeft] = useState('00:00');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{number: number, size: string, color: string, fourNumbers?: number[]} | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(12456);

  const prevPeriodRef = useRef('');

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const update = () => {
      const currentPeriod = calculatePeriod(activeGame);
      setPeriod(currentPeriod);
      
      const seconds = calculateRemainingSeconds(activeGame);
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
  }, [activeGame, activeMode]);

  const generateNewResult = (p: string) => {
    setIsChecking(true);
    setTimeout(() => {
      const num = generateSmartResult(activeGame);
      const newResult = {
        number: num,
        size: getSize(num),
        color: getColor(num),
        fourNumbers: activeMode === 'number-only' ? generateFourDifferentNumbers(p, activeGame) : undefined
      };
      setResult(newResult);
      setIsChecking(false);
      
      const historyItem = {
        period: p,
        ...newResult,
        mode: activeGame,
        displayMode: activeMode,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [historyItem, ...prev].slice(0, 15));
    }, 1500);
  };

  const gameLabel = {
    '30s': 'WinGo 30s',
    '1m': 'WinGo 1 Min',
    '3m': 'WinGo 3 Min',
    '5m': 'WinGo 5 Min',
  }[activeGame];

  if (slug && !SLUG_MAP[slug]) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-3 relative font-sans overflow-x-hidden">
      <h1 className="sr-only">Wingo AI Prediction Tool - {gameLabel} - Free Version</h1>
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[420px] mx-auto pt-14">
        <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
          <Link href="/" className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-sm font-semibold hover:border-indigo-500 transition-all">
            <ArrowLeft size={16} /> Premium Version
          </Link>
          <button onClick={() => setShowHelp(true)} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-sm font-semibold hover:border-indigo-500 transition-all">
            <HelpCircle size={16} /> How to Use
          </button>
        </div>

        <div className="mb-4 flex justify-center">
          <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border border-amber-200 shadow-sm flex items-center gap-2 uppercase">
            <Zap size={12} fill="currentColor" /> This is the FREE Version
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-400">FREE ANALYST MOD</span>
            <span className="text-xs font-bold text-green-500">Live Users: {onlineUsers.toLocaleString()}</span>
          </div>

          <div className="flex flex-col items-center gap-2 py-2 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg border-2 border-indigo-400">
              <span className="text-white text-3xl font-black">AI</span>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">Wingo {activeGame} Prediction</h2>
              <p className="text-[10px] font-bold text-slate-400">Powered by Neural Pattern Recognition</p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl overflow-hidden h-9 flex items-center border border-indigo-100/50">
            <div className="whitespace-nowrap px-4 text-xs font-semibold text-indigo-600 animate-marquee flex items-center gap-2">
              <span>🚀 1000% Indexing Guaranteed • Always maintain level 3-5 funds</span>
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px]">TIPS</span>
              <span>• For 100% accuracy, visit our Premium Version on Home.</span>
            </div>
          </div>

          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl justify-between overflow-x-auto">
            {['30s', '1m', '3m', '5m'].map(g => (
              <Link 
                key={g}
                href={`/${MODE_TO_SLUG[g]}`}
                className={`flex-1 min-w-[75px] h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${activeGame === g ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                {g === '30s' ? <Clock size={20} /> : <Timer size={20} />}
                <span className="text-[10px] font-bold text-center leading-tight whitespace-pre-line">{g === '30s' ? 'WinGo\n30s' : g === '1m' ? 'WinGo\n1 Min' : g === '3m' ? 'WinGo\n3 Min' : 'WinGo\n5 Min'}</span>
              </Link>
            ))}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setActiveMode('number-only')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border ${activeMode === 'number-only' ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-400' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
            >
              <Hash size={14} /> Number Only
            </button>
            <button 
              onClick={() => setActiveMode('show-all')}
              className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all border ${activeMode === 'show-all' ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-400' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
            >
              <Eye size={14} /> Show All
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <Zap size={64} />
            </div>
            <div className="text-sm font-bold text-slate-600">Game: {gameLabel}</div>
            <div className="text-sm font-bold text-slate-800">Current Period: {period}</div>
            <div className="text-sm font-bold text-slate-500">Next Result In: <span className="text-indigo-600 font-mono tracking-wider">{timeLeft.replace(':', ' : ')}</span></div>

            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm min-h-[110px] flex flex-col items-center justify-center gap-2 mt-2 relative z-10">
              <div className="text-[10px] font-black text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <div className="h-px w-8 bg-slate-200" /> AI GENERATED RESULT <div className="h-px w-8 bg-slate-200" />
              </div>
              {isChecking ? (
                <div className="flex flex-col items-center gap-2">
                   <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                   <span className="text-[10px] font-bold text-indigo-500 animate-pulse uppercase tracking-widest">Analyzing Patterns...</span>
                </div>
              ) : result ? (
                <div className="flex flex-wrap justify-center items-center gap-3 w-full animate-in fade-in zoom-in duration-500">
                  {activeMode === 'number-only' && result.fourNumbers ? (
                    <div className="flex gap-2">
                      {result.fourNumbers.map(n => (
                        <div key={n} className="transition-all hover:scale-110">
                          <img src={`/svg/numbers/${n}.svg`} alt={n.toString()} className="w-12 h-12 drop-shadow-md" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4 w-full">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Number</span>
                        <div className="transition-all hover:scale-110">
                          <img src={`/svg/numbers/${result.number}.svg`} alt={result.number.toString()} className="w-14 h-14 drop-shadow-xl" />
                        </div>
                      </div>
                      <div className="h-10 w-px bg-slate-100" />
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Size</span>
                        <div className={`px-4 py-2 rounded-lg text-xs font-black text-white shadow-md min-w-[70px] text-center ${result.size === 'BIG' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>
                          {result.size}
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Color</span>
                        <div className={`px-4 py-2 rounded-lg text-xs font-black text-white shadow-md min-w-[70px] text-center ${result.color === 'GREEN' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-rose-400 to-rose-600'}`}>
                          {result.color}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
              
              <button 
                onClick={() => setShowHowItWorks(true)}
                className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest"
              >
                <Info size={12} /> How it works?
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <Link href="/" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 group">
              <UserPlus size={20} className="group-hover:animate-bounce" /> GO TO PREMIUM VERSION
            </Link>
            <div className="flex gap-2">
              <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all">
                <Send size={14} /> Telegram
              </button>
              <button className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all">
                <Headset size={14} /> Support
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden transition-all">
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 font-bold text-slate-700 text-sm"
          >
            <div className="flex items-center gap-2">
              <History size={16} className="text-indigo-500" /> Analysis History
            </div>
            {isHistoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <div className={`transition-all duration-300 overflow-hidden ${isHistoryOpen ? 'max-h-[400px] border-t border-slate-100' : 'max-h-0'}`}>
            <div className="p-4 flex flex-col gap-3 max-h-[350px] overflow-y-auto">
              {history.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic">
                  Calculating initial history... Please wait.
                </div>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0 animate-in slide-in-from-right duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-slate-800 tracking-tighter">{item.period}</span>
                      <span className="text-[9px] font-bold text-indigo-500 uppercase">{item.mode} Prediction</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      {item.displayMode === 'number-only' && item.fourNumbers ? (
                        <div className="flex gap-1">
                          {item.fourNumbers.map((n: number) => (
                            <img key={n} src={`/svg/numbers/${n}.svg`} alt={n.toString()} className="w-7 h-7" />
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-1.5 items-center">
                          <img src={`/svg/numbers/${item.number}.svg`} alt={item.number.toString()} className="w-8 h-8" />
                          <div className={`px-2 py-0.5 rounded text-[8px] font-black text-white flex items-center justify-center min-w-[40px] ${item.size === 'BIG' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                            {item.size}
                          </div>
                          <div className={`px-2 py-0.5 rounded text-[8px] font-black text-white flex items-center justify-center min-w-[40px] ${item.color === 'GREEN' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                            {item.color}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          width: fit-content;
        }
      `}</style>
    </div>
  );
}
