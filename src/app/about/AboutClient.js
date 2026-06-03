"use client";

import { ChevronLeft, Shield, Zap, Brain, Target, Users, Sparkles, BarChart3, Clock, Globe, Award } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteFooter from "@/components/SiteFooter";

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "10+", label: "Platforms Supported" },
  { value: "99%", label: "Max Accuracy" },
  { value: "24/7", label: "Support" },
];

const features = [
  { icon: <BarChart3 size={24} />, title: "High Accuracy", desc: "Up to 99%+ accuracy with Quantum analysis for precise predictions every round." },
  { icon: <Globe size={24} />, title: "Multi-Platform", desc: "Works with 91Club, Tiranga, BDG Win, and 10+ major gaming platforms seamlessly." },
  { icon: <Clock size={24} />, title: "Real-Time Signals", desc: "Instant predictions for 30s, 1 Min, 3 Min, and 5 Min rounds with zero delay." },
  { icon: <Shield size={24} />, title: "Secure & Private", desc: "Enterprise-grade encryption protects your data, license keys, and transactions." },
];

const techStack = [
  { icon: <Brain size={28} />, title: "Neural Networks", desc: "Deep learning models trained on millions of historical game rounds for pattern recognition." },
  { icon: <Zap size={28} />, title: "Quantum Analysis", desc: "Quantum-inspired algorithms detect complex patterns invisible to traditional analysis." },
  { icon: <Target size={28} />, title: "Real-Time Engine", desc: "Sub-second prediction generation with minimal latency for timely signals." },
];

export default function AboutClient({ telegramLink }) {
  return (
    <>
      <main style={{overflowX:"hidden"}}>
        {/* Back button top-left */}
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px 24px 0" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#007AFF", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
            <ChevronLeft size={16} /> Back
          </Link>
        </div>

        {/* ── Hero ── */}
        <section style={{ textAlign: "center", padding: "20px 24px 40px", maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 900, color: "#111827", marginBottom: "16px", letterSpacing: "-0.03em" }}>
            About <span style={{ color: "#007AFF" }}>Wingo Signal</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2.5vw, 18px)", color: "#5a6070", lineHeight: 1.7, maxWidth: "640px", margin: "0 auto" }}>
            The most trusted AI-powered prediction platform — helping thousands of players make informed decisions with data-driven signals.
          </p>
        </section>

        {/* ── Stats Bar ── */}
        <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ textAlign: "center", padding: "20px 8px", background: "#f8f9fb", borderRadius: "14px", border: "1px solid #e2e5ec" }}>
                <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 900, color: "#111827", margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "#5a6070", fontWeight: 600, marginTop: "4px" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Who We Are ── */}
        <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 56px" }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "8px", height: "28px", background: "#C6FF33", borderRadius: "4px" }}></div>
            Who We Are
          </h2>
          <article style={{ color: "#5a6070", lineHeight: 1.9, fontSize: "1.05rem" }}>
            <p style={{ marginBottom: "16px" }}>
              Wingo Signal is a cutting-edge <strong>AI-powered prediction platform</strong> designed for gaming enthusiasts who play Wingo, Aviator, Mines, and other color prediction games. We provide real-time signals with high accuracy rates to help users make informed decisions.
            </p>
            <p style={{ marginBottom: "16px" }}>
              Founded by a team of <strong>data scientists and gaming analysts</strong>, our platform combines machine learning algorithms with extensive historical game data to generate precise predictions.
            </p>
            <p>
              Today, <strong>thousands of active users</strong> across 10+ gaming platforms including 91Club, Tiranga, BDG Win, and more trust Wingo Signal for their daily predictions.
            </p>
          </article>
        </section>

        {/* ── Our Mission ── */}
        <section style={{ background: "#f8f9fb", padding: "56px 24px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "8px", height: "28px", background: "#24A1DE", borderRadius: "4px" }}></div>
              Our Mission
            </h2>
            <article style={{ color: "#5a6070", lineHeight: 1.9, fontSize: "1.05rem" }}>
              <p style={{ marginBottom: "16px" }}>
                Our mission is to <strong>democratize access</strong> to advanced prediction technology. We believe every player deserves the same analytical power that professional traders and analysts use.
              </p>
              <p style={{ marginBottom: "16px" }}>
                We strive to maintain the <strong>highest accuracy standards</strong> while keeping our platform accessible, transparent, and user-friendly for beginners and experts alike.
              </p>
              <p>
                Through continuous research and development, we aim to push the boundaries of what AI-driven game prediction can achieve.
              </p>
            </article>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section style={{ maxWidth: "800px", margin: "0 auto", padding: "56px 24px" }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, color: "#111827", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "8px", height: "28px", background: "#34C759", borderRadius: "4px" }}></div>
            Why Choose Us
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {features.map((f, i) => (
              <motion.article key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                style={{ padding: "24px", background: "#f8f9fb", borderRadius: "16px", border: "1px solid #e2e5ec" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f0ffd0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", color: "#5a7a00" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: "16px", color: "#111827", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "13px", color: "#5a6070", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section style={{ background: "#111827", padding: "56px 24px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, color: "#ffffff", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "8px", height: "28px", background: "#f59e0b", borderRadius: "4px" }}></div>
              How It Works
            </h2>
            <ol style={{ display: "flex", flexDirection: "column", gap: "20px", padding: 0, listStyle: "none" }}>
              {[
                { step: "1", title: "Data Collection", desc: "Our AI models analyze thousands of historical game rounds, identifying patterns and trends invisible to the human eye." },
                { step: "2", title: "Pattern Recognition", desc: "Advanced algorithms detect recurring sequences and probability distributions across multiple timeframes simultaneously." },
                { step: "3", title: "Prediction Generation", desc: "Multi-factor cross-verification produces highly accurate signals delivered instantly to your dashboard." },
                { step: "4", title: "Real-Time Delivery", desc: "Signals are pushed to your device in real-time — choose from 30s, 1 Min, 3 Min, or 5 Min prediction intervals." },
              ].map((item, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#C6FF33", color: "#111827", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "16px", flexShrink: 0 }}>
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: "16px", color: "#ffffff", marginBottom: "4px" }}>{item.title}</h3>
                    <p style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Technology ── */}
        <section style={{ maxWidth: "800px", margin: "0 auto", padding: "56px 24px" }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, color: "#111827", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "8px", height: "28px", background: "#7D39EB", borderRadius: "4px" }}></div>
            Our Technology
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {techStack.map((t, i) => (
              <motion.article key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                style={{ padding: "24px", borderRadius: "16px", border: "1px solid #e2e5ec", textAlign: "center" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#f5f0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#7D39EB" }}>
                  {t.icon}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: "15px", color: "#111827", marginBottom: "8px" }}>{t.title}</h3>
                <p style={{ fontSize: "13px", color: "#5a6070", lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ── Our Community ── */}
        <section style={{ background: "#f8f9fb", padding: "56px 24px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, color: "#111827", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "8px", height: "28px", background: "#FF9500", borderRadius: "4px" }}></div>
              Our Community
            </h2>
            <article style={{ color: "#5a6070", lineHeight: 1.9, fontSize: "1.05rem" }}>
              <p style={{ marginBottom: "16px" }}>
                Wingo Signal has grown into a vibrant community of prediction enthusiasts. Our Telegram channel serves as a hub for daily free signals, community discussions, strategy sharing, and live support.
              </p>
              <p style={{ marginBottom: "16px" }}>
                Whether you are a beginner exploring prediction tools or an experienced trader, our community offers <strong>valuable insights and real-time updates</strong> to enhance your experience.
              </p>
            </article>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
              <a href="https://t.me/+stsY5CXgrkM2MWY1" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "#24A1DE", color: "#fff", borderRadius: "10px", fontWeight: 800, fontSize: "14px", textDecoration: "none" }}>
                <Users size={18} /> Join Telegram Channel
              </a>
              <a href={telegramLink} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "#f5f0ff", color: "#7D39EB", borderRadius: "10px", fontWeight: 800, fontSize: "14px", textDecoration: "none" }}>
                Contact Support
              </a>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "56px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 900, color: "#111827", marginBottom: "12px" }}>
              Ready to Get Started?
            </h2>
            <p style={{ fontSize: "15px", color: "#5a6070", lineHeight: 1.7, marginBottom: "24px" }}>
              Experience the power of AI predictions. Start with our free tier and upgrade as you grow.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
               <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: "#C6FF33", color: "#1a202c", borderRadius: "10px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
                <Award size={20} /> Download Now
              </Link>
              <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: "#f5f0ff", color: "#7D39EB", borderRadius: "10px", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
                Read Our Blog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
