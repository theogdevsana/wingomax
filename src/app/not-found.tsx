"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Home, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full text-center"
        >
          {/* Animated 404 Text */}
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              style={{
                fontSize: "140px",
                fontWeight: "900",
                background: "linear-gradient(135deg, #007AFF 0%, #AF52DE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: "1",
                letterSpacing: "-0.05em",
              }}
            >
              404
            </motion.div>
          </div>
          {/* Content (Directly on BG) */}
          <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
              Page Not Found
            </h1>
            
            <p className="text-slate-500 font-bold text-base mb-10 leading-relaxed max-w-[320px] mx-auto">
              The page you are looking for doesn't exist or has been moved to a new location.
            </p>

            <div className="flex flex-col gap-4 max-w-[280px] mx-auto">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 py-4.5 bg-[#007AFF] hover:bg-[#0066D6] text-white rounded-[1.25rem] font-bold text-base shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98]"
              >
                <Home size={20} /> Back to Dashboard
              </Link>
              
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 py-4.5 bg-white hover:bg-slate-50 text-slate-600 rounded-[1.25rem] font-bold text-base border border-slate-200 transition-all active:scale-[0.98] shadow-sm"
              >
                <ChevronLeft size={20} /> Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
