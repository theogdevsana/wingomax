"use client";

import { Shield, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function TermsClient({ telegramLink }) {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Wingo Signal (\"the Service\"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service."
    },
    {
      title: "2. Description of Service",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Wingo Signal provides predictive analytics and data analysis tools. The Service may include, but is not limited to:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Data prediction and analysis features</li>
            <li>Statistical modeling tools</li>
            <li>Visualization dashboards</li>
            <li>Export and reporting capabilities</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Acceptable Use",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>You agree not to:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Use the Service for any illegal purposes</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Copy, modify, or create derivative works of the Service</li>
            <li>Share your account credentials with others</li>
          </ul>
        </>
      )
    },
    {
      title: "4. Limitation of Liability",
      content: "In no event shall Wingo Signal be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or other intangible losses."
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
            <Shield style={{ color: "#10b981", width: "26px", height: "26px" }} />
            Terms and Conditions
          </div>
          <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "#64748b", marginTop: "8px", fontWeight: "500" }}>Rules and guidelines for our service</p>
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
                <div style={{ width: "6px", height: "24px", background: "#10b981", borderRadius: "3px" }}></div>
                {section.title}
              </h2>
              <div style={{ color: "#475569", lineHeight: "1.8", fontSize: "1.05rem", paddingLeft: "18px" }}>{section.content}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: "64px", padding: "32px 24px", borderTop: "2px solid rgba(0,0,0,0.05)", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: "600" }}>By using our service, you agree to follow these rules.</p>
          <a href={telegramLink} style={{ color: "#10b981", fontWeight: "800", textDecoration: "none", marginTop: "12px", display: "inline-block", fontSize: "1.1rem" }}>Contact Support →</a>
        </div>
      </main>
      <Footer className="!mt-12 -mx-4 w-[calc(100%+2rem)]" />
    </div>
  );
}
