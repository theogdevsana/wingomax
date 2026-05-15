"use client";

import { Shield, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function PrivacyClient({ telegramLink }) {
  const sections = [
    {
      title: "1. Introduction",
      content: "Wingo Signal (\"we\", \"our\", or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service."
    },
    {
      title: "2. Information We Collect",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>We may collect personal information that you provide directly to us, including:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Name and email address when you create an account</li>
            <li>Profile information you choose to provide</li>
            <li>Communication data when you contact us</li>
            <li>Payment information (processed securely by third-party processors)</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure."
    },
    {
      title: "4. Your Rights",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Depending on your location, you may have the following rights:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Access your personal information</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Delete your personal information</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p style={{ marginTop: "12px" }}>To exercise these rights, please contact our support team on Telegram.</p>
        </>
      )
    }
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px 0" }}>
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.85rem", fontWeight: "600", marginBottom: "32px", textDecoration: "none" }}>
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>

        <div style={{ padding: "0 4px", marginBottom: "32px" }}>
          <div style={{ fontSize: "clamp(22px, 5vw, 26px)", display: "flex", alignItems: "center", gap: "12px", fontWeight: "800", color: "#1e293b", tracking: "-0.01em" }}>
            <FileText style={{ color: "#8b5cf6", width: "26px", height: "26px" }} />
            Privacy Policy
          </div>
          <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "#64748b", marginTop: "8px", fontWeight: "500" }}>How we protect your data and privacy</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px", padding: "0 4px" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: "800", letterSpacing: "0.05em" }}>LAST UPDATED: MAY 1, 2026</p>
          {sections.map((section, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
            >
              <h2 style={{ fontSize: "clamp(18px, 4vw, 20px)", fontWeight: "800", marginBottom: "16px", color: "#1e293b", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "6px", height: "24px", background: "#8b5cf6", borderRadius: "3px" }}></div>
                {section.title}
              </h2>
              <div style={{ color: "#475569", lineHeight: "1.8", fontSize: "1.05rem", paddingLeft: "18px" }}>{section.content}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: "64px", padding: "32px 24px", borderTop: "2px solid rgba(0,0,0,0.05)", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: "600" }}>If you have any questions about this policy, please reach out to us.</p>
          <a href={telegramLink} style={{ color: "#8b5cf6", fontWeight: "800", textDecoration: "none", marginTop: "12px", display: "inline-block", fontSize: "1.1rem" }}>Contact Support →</a>
        </div>
      </main>
      <Footer className="!mt-12 -mx-4 w-[calc(100%+2rem)]" />
    </div>
  );
}
