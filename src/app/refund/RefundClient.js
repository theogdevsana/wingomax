"use client";

import { RefreshCcw, ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function RefundClient({ telegramLink }) {
  const sections = [
    {
      title: "1. Refund Eligibility",
      content: "At Wingo Signal, we strive to provide a high-quality predictive tool. Refunds are only considered in cases of technical failure where the activation key fails to unlock the premium features despite successful payment verification."
    },
    {
      title: "2. No-Refund Policy",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Refunds will NOT be issued in the following scenarios:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>Signals did not match actual outcomes (signals are statistical, not guaranteed).</li>
            <li>User changed their mind after a successful activation.</li>
            <li>Account suspension due to violation of our Terms of Service.</li>
            <li>Failure to provide a valid UTR/Transaction screenshot for verification.</li>
          </ul>
        </>
      )
    },
    {
      title: "3. Refund Process",
      content: "If you believe you are eligible for a refund due to a technical error, please contact our support team on Telegram within 24 hours of payment. Provide your email, payment screenshot, and UTR number for investigation."
    },
    {
      title: "4. Processing Time",
      content: "Approved refunds are processed within 5-7 business days and will be credited back to the original payment source (UPI account) used during the transaction."
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
            <RefreshCcw style={{ color: "#ef4444", width: "26px", height: "26px" }} />
            Refund Policy
          </div>
          <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "#64748b", marginTop: "8px", fontWeight: "500" }}>Our commitment to fair transactions</p>
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
                <div style={{ width: "6px", height: "24px", background: "#ef4444", borderRadius: "3px" }}></div>
                {section.title}
              </h2>
              <div style={{ color: "#475569", lineHeight: "1.8", fontSize: "1.05rem", paddingLeft: "18px" }}>{section.content}</div>
            </motion.div>
          ))}

          <div style={{ marginTop: "12px", padding: "24px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "24px", border: "2px dashed rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <AlertCircle style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} size={24} />
              <div style={{ fontSize: "0.95rem", color: "#b91c1c", fontWeight: "600", lineHeight: "1.6" }}>
                Please ensure you provide accurate UTR details during checkout to avoid activation delays. We are not responsible for payments made to unauthorized UPI IDs.
              </div>
          </div>
        </div>

        <div style={{ marginTop: "64px", padding: "32px 24px", borderTop: "2px solid rgba(0,0,0,0.05)", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: "600" }}>Have a refund request? Message us on Telegram.</p>
          <a href={telegramLink} style={{ color: "#ef4444", fontWeight: "800", textDecoration: "none", marginTop: "12px", display: "inline-block", fontSize: "1.1rem" }}>Contact Support →</a>
        </div>
      </main>
      <Footer className="!mt-12 -mx-4 w-[calc(100%+2rem)]" />
    </div>
  );
}
