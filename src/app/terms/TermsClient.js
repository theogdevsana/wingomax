"use client";

import { Shield, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteFooter from "@/components/SiteFooter";

export default function TermsClient({ telegramLink }) {
  const sections = [
    {
      title: "1. The Deal Between Us: Acceptance of Terms",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Welcome to Wingo Signal. We want to start by being entirely upfront about the nature of our relationship. By accessing our website, loading our dashboard, or utilizing our statistical prediction tools, you are entering into a binding agreement with us. These Terms of Service dictate the rules of the road. If you find yourself disagreeing with any of the conditions laid out below, we politely ask that you close the website and do not use our services. By continuing to use Wingo Signal, you signify your complete acceptance of these terms.</p>
          <p>We’ve structured this document to be as clear and readable as possible. Our goal is to provide you with an elite, high-performance analytical tool, and your goal is to use it responsibly. Let's make sure we are on the same page.</p>
        </>
      )
    },
    {
      title: "2. What You're Actually Getting: Description of Service",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Wingo Signal is, at its core, an advanced data analytics and statistical modeling platform designed specifically for color and number pattern detection. It is crucial to understand what the service IS and what it IS NOT.</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>What it IS:</strong> A mathematical tool that scans recent historical data, applies complex algorithmic logic, and outputs the highest statistical probability for upcoming sequences (such as Big/Small or Green/Red) across various timeframes (30s, 1m, 3m, 5m).</li>
            <li><strong>What it IS NOT:</strong> A magic crystal ball, a guaranteed money-making scheme, or financial advice. We do not have insider access to any game servers. Our tool relies purely on probability and mathematics.</li>
          </ul>
          <p>When you use our service, you are granted access to these analytical dashboards, real-time visual tracking, and AI-generated signals. How you choose to apply this data is entirely your own decision and responsibility.</p>
        </>
      )
    },
    {
      title: "3. Eligibility and Account Registration",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>To use Wingo Signal, you must be of legal age in your jurisdiction (usually 18 years or older) to form a binding contract. By using the platform, you represent and warrant that you meet this age requirement. If you do not meet this requirement, you must not access or use the platform.</p>
          <p>Furthermore, because our premium access relies on manual verification via Telegram, you agree to provide accurate and current information during the activation process. Using fake payment receipts, forged UTR numbers, or attempting to deceive our support staff will result in a permanent, unappealable ban from our ecosystem.</p>
        </>
      )
    },
    {
      title: "4. Premium Licenses and Fair Usage",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Wingo Signal operates on a premium license model. When you purchase a license, you are buying a single-user, non-transferable right to access the premium server features. This means the license is strictly for you.</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>No Sharing:</strong> You are strictly prohibited from sharing your activation key, dashboard URL, or live screen with multiple users. Our system monitors concurrent IP access; if a single license is detected being used simultaneously from vastly different locations, the system will automatically suspend the key.</li>
            <li><strong>No Reselling:</strong> You may not act as a middleman, reselling our signals or dashboard access to third parties. Our service is intended for end-users only.</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Keeping the Community Safe: Acceptable Use",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>To ensure that our premium servers run smoothly, securely, and with zero latency for all our legitimate users, we enforce a strict Acceptable Use Policy. You agree that you will absolutely NOT:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li>Attempt to reverse-engineer, decompile, or disassemble the Wingo Signal application or its underlying algorithms.</li>
            <li>Use automated bots, scrapers, spiders, or any other automated means to extract data from our dashboard. Our signals are meant to be read by human eyes.</li>
            <li>Launch Denial of Service (DoS) attacks, flood our servers with artificial requests, or intentionally try to exploit vulnerabilities in our code.</li>
            <li>Use the service in any manner that violates local, national, or international laws regarding online gaming or data consumption.</li>
          </ul>
          <p>We employ sophisticated security monitoring. Any violation of these rules will trigger an automatic security lock on your account, and we reserve the right to report malicious activities to the relevant network authorities.</p>
        </>
      )
    },
    {
      title: "6. Service Availability and Interruptions",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>We pride ourselves on maintaining an exceptionally high uptime. However, the internet is unpredictable. We do not guarantee that the service will be uninterrupted, timely, secure, or completely error-free at all times.</p>
          <p>Occasionally, we must take the servers offline for critical maintenance, algorithm updates, or to scale our infrastructure. We will make every effort to announce planned downtime in our Telegram channel. In the event of unforeseen outages caused by third-party hosting providers, DDOS attacks, or force majeure events, Wingo Signal shall not be held liable for any missed opportunities or interruptions to your gameplay.</p>
        </>
      )
    },
    {
      title: "7. Intellectual Property Rights",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Every piece of code, every pixel of the UI design, the specific mathematical models, and the Wingo Signal branding belong exclusively to us. Using our service does not grant you any ownership rights over our intellectual property.</p>
          <p>You may not copy our website design, steal our logo, or attempt to clone our service under a different name. We actively monitor the web for copycats and will enforce our copyright protections aggressively to protect the integrity of our brand.</p>
        </>
      )
    },
    {
      title: "8. A Crucial Word on Risk and Liability",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>This is perhaps the most important section of these terms. <strong>Please read it carefully.</strong></p>
          <p style={{ marginBottom: "12px" }}>Wingo Signal provides statistical probabilities. We do not provide financial advice. You acknowledge and agree that any reliance on our signals is at your own sole risk. We expressly disclaim any liability for financial losses, damages, or emotional distress resulting from the use of our predictions.</p>
          <p>No algorithm is 100% perfect. Patterns break. Anomalies happen. You must exercise personal responsibility. Never risk capital that you cannot afford to lose. We strongly advise applying strict bankroll management, such as a disciplined 3x level investment strategy, and knowing when to walk away. By using this tool, you waive your right to hold Wingo Signal responsible for any negative outcomes.</p>
        </>
      )
    },
    {
      title: "9. Termination of Service",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>We reserve the right to terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever. The most common reasons for termination include:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li>Violation of these Terms (e.g., sharing license keys, using bots).</li>
            <li>Abusive, threatening, or disrespectful behavior toward our support staff on Telegram.</li>
            <li>Initiating fraudulent chargebacks with your payment provider.</li>
          </ul>
          <p>Upon termination, your right to use the premium Service will cease immediately, and no prorated refunds will be issued for violations of the Terms.</p>
        </>
      )
    },
    {
      title: "10. Final Provisions",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>We may update these Terms from time to time to reflect changes in our service or legal requirements. Your continued use of the platform after any changes indicates your acceptance of the new terms. If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect.</p>
          <p>If you have questions about these Terms, the rules of acceptable use, or need clarification on our liability policies, please reach out to our official support channel on Telegram.</p>
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
      <SiteFooter className="!mt-12 -mx-4 w-[calc(100%+2rem)]" />
    </div>
  );
}
