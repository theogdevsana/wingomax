"use client";

import { RefreshCcw, ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteFooter from "@/components/SiteFooter";

export default function RefundClient({ telegramLink }) {
  const sections = [
    {
      title: "1. Our Honest Refund Philosophy",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>At Wingo Signal, we stand for transparency and absolute honesty. Unlike massive, automated portals, we personally review every user transaction and support query to ensure fair treatment.</p>
          <p style={{ marginBottom: "12px" }}>However, since we provide real-time digital access keys, complex probability computations, and server bandwidth, we must maintain a highly structured policy. This policy protects our server infrastructure from exploiters while guaranteeing fair resolution for genuine users.</p>
          <p>By purchasing any plan on our platform, you explicitly agree to all terms, constraints, and conditions detailed in this refund document.</p>
        </>
      )
    },
    {
      title: "2. The Nature of Live Gambling & Manual Trends",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}><strong>Critical Notice:</strong> Wingo is inherently a gambling game. The platform operator/operators handle and manage the game trends manually. We have absolutely <strong>zero control</strong> over their internal server outcomes, manual trend adjustments, or sudden system shifts.</p>
          <p style={{ marginBottom: "12px" }}>Because of this, we <strong>absolutely do not guarantee</strong> that the accuracy mentioned for any plan will be stable or consistent 100% of the time. Losing streaks, pattern variances, and sudden algorithm changes are natural parts of gambling games, and we are not responsible for any financial losses incurred.</p>
          <p>Accuracy levels are high-end estimations calculated over massive past data volumes, not a promise of future winning streaks.</p>
        </>
      )
    },
    {
      title: "3. Plans Breakdown & Accuracy Stability",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>To maintain complete transparency, here is the breakdown of all our subscription plans. The accuracy shown below is not constantly stable and will fluctuate according to live operator trends:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Wingo Starter:</strong> 45%+ Accuracy (Subject to trend volatility and manual platform overrides)</li>
            <li><strong>Wingo Elite:</strong> 70%+ Accuracy (Subject to trend volatility and manual platform overrides)</li>
            <li><strong>Wingo Max Pro:</strong> 83%+ Accuracy (Subject to trend volatility and manual platform overrides)</li>
            <li><strong>Wingo Smart AI:</strong> 95%+ Accuracy (AI auto-corrected, subject to trend volatility and manual platform overrides)</li>
            <li><strong>Wingo Neural Pro:</strong> 98%+ Accuracy (Deep neural analyzed, subject to trend volatility and manual platform overrides)</li>
            <li><strong>Wingo Lifetime Quantum:</strong> 99% Max Accuracy (Advanced Quantum analyzed, subject to trend volatility and manual platform overrides)</li>
          </ul>
        </>
      )
    },
    {
      title: "4. Key Replacement & Device Issue Conditions",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>We do not issue key replacements for simple change-of-mind. A key replacement will <strong>only</strong> be reviewed and issued under the following strict conditions:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Premature Key Expiration:</strong> Your license key expires before the duration promised by your purchased plan.</li>
            <li><strong>Premature Ban:</strong> Your license is suspended or banned by our system database due to a technical error.</li>
            <li><strong>Device Lost or Device Issue:</strong> If you lost your device or purchased a new one and need to transfer your key to a new hardware environment.</li>
          </ul>
          <p><strong>Required Proof:</strong> To get a replacement key or device transfer, you must provide solid, clear proof of payment (UPI transaction screenshot with UTR or block hash) along with your original valid key details. Support will decline requests lacking proper verification.</p>
        </>
      )
    },
    {
      title: "5. Server Uptime & Downtime Refund Policy",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Refunds are strictly eligible only under system failure or undelivered service scenarios. Please review the exact uptime rules below:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Undelivered Service:</strong> You already completed the payment, but due to our system's fault, the service key was never delivered to you or was completely unusable from day one.</li>
            <li><strong>Full Refund Rule:</strong> A full refund is <strong>only</strong> issued if our service remains completely down/offline for the <strong>entire duration</strong> of your purchased plan (e.g., if you bought a 7-day access plan, the service must be down/offline for the full 7 days continuously).</li>
            <li><strong>Partial Downtime (Key Review & Extension):</strong> If the service goes down for 2 or 3 days during your subscription, you are <strong>not</strong> eligible for a refund. Instead, your key will be reviewed by support and we will <strong>extend/renew</strong> your license key days to compensate for the exact downtime.</li>
          </ul>
        </>
      )
    },
    {
      title: "6. When We Can NOT Issue a Refund",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>To maintain fairness for all users and keep our server costs manageable, we absolutely cannot issue refunds under the following scenarios:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Signal Inaccuracy:</strong> You experienced a losing streak. Wingo is a gambling game managed manually by operator trends; accuracy varies and is never 100% stable.</li>
            <li><strong>Change of Mind:</strong> You purchased the license, used it, and simply decided you no longer want to play or use the tool.</li>
            <li><strong>Security Bans:</strong> Your key was banned because you shared it with other players or attempted to bypass our security.</li>
          </ul>
        </>
      )
    },
    {
      title: "7. Step-by-Step Support Process",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>If you face any key issue, device loss, or undelivered service, please follow these steps to contact us:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Step 1:</strong> Contact our official support team on Telegram (@enzosrs) immediately.</li>
            <li><strong>Step 2:</strong> Provide your Wingo Signal username or associated email address.</li>
            <li><strong>Step 3:</strong> Send a high-resolution payment screenshot displaying the 12-digit UPI UTR reference number or crypto hash.</li>
            <li><strong>Step 4:</strong> Submit proof of the issue (e.g. key error details or device loss proof).</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <>
    <div style={{ minHeight: "100vh", padding: "24px 16px 0", overflowX: "hidden" }}>
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

        <div style={{ marginTop: "64px", padding: "32px 24px", borderTop: "2px solid rgba(0,0,0,0.05)", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <p style={{ color: "#64748b", fontSize: "1.05rem", fontWeight: "600", margin: "0" }}>Have a refund request or questions? Reach out officially.</p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
            <a href={telegramLink} target="_blank" rel="noopener noreferrer" style={{ color: "#ef4444", fontWeight: "800", textDecoration: "none", fontSize: "1.1rem" }}>
              Contact Support →
            </a>
            <a href="https://t.me/+stsY5CXgrkM2MWY1" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontWeight: "800", textDecoration: "none", fontSize: "1.1rem" }}>
              Join Telegram Channel →
            </a>
          </div>
        </div>
      </main>
    </div>
    <SiteFooter />
    </>
  );
}
