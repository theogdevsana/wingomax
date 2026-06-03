"use client";

import { Shield, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import SiteFooter from "@/components/SiteFooter";

export default function PrivacyClient({ telegramLink }) {
  const sections = [
    {
      title: "1. Our Honest Approach to Privacy",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Let’s keep things simple and completely transparent. When you use Wingo Signal, you're placing your trust in us not just to provide accurate statistical data, but also to handle your session footprint with the utmost respect. We firmly believe that privacy policies shouldn't be buried in confusing, fifty-page legal jargon designed to trick you into giving away your digital life.</p>
          <p style={{ marginBottom: "12px" }}>Our philosophy is built on data minimization. This means we consciously choose to collect only the absolute minimum amount of information required to keep the dashboard running fast, securely, and accurately. We do not operate in the business of data brokering. We have never, and will never, sell your personal information, session habits, or contact details to third-party marketers, advertisers, or data aggregators. Your use of our prediction tool is your business; our business is simply providing you with the best mathematical edge possible.</p>
        </>
      )
    },
    {
      title: "2. The Very Few Things We Collect",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Because our platform is designed around direct, manual activations via Telegram rather than an automated, data-hungry user registration system, our footprint on your personal data is exceptionally small. Here is exactly what we store, and why:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Communication Data:</strong> The Telegram handle, username, or email address you use to contact our support team for license activation or troubleshooting. This is solely used to identify you as a legitimate customer and to provide support.</li>
            <li><strong>Anonymous Prediction History:</strong> We log the statistical outcomes of games and the times our tool was queried. This data is entirely stripped of personal identifiers. We use this aggregated, anonymous data to feed back into our AI neural networks, helping the algorithm identify shifting patterns and improve global accuracy for all users.</li>
            <li><strong>Payment Verification:</strong> When you purchase a premium license, you provide us with a UTR (Unique Transaction Reference) number or a screenshot of the transaction. We keep this on record temporarily to verify the payment against our bank/crypto ledger. Once your license is activated and verified, the screenshot is no longer needed for active processing.</li>
            <li><strong>Technical Device Information:</strong> To prevent license sharing and abuse, our servers log your IP address, browser type, and a randomized session hash. This ensures that a single-user license isn't being simultaneously accessed by fifty different devices across the globe.</li>
          </ul>
        </>
      )
    },
    {
      title: "3. How We Keep You Secure",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Security isn't just an afterthought for us; it is the foundation of the Wingo Signal infrastructure. We host our platform on premium, highly encrypted cloud servers that utilize state-of-the-art DDoS protection and firewalls. All data transmitted between your browser and our servers is secured using AES-256 encryption via TLS 1.3 protocols. This means that even if someone were to intercept the traffic, they would only see scrambled, unreadable data.</p>
          <p style={{ marginBottom: "12px" }}>Furthermore, we intentionally avoid storing highly sensitive financial information. We do not ask for your credit card numbers, CVV codes, or bank account passwords directly on our website. All transactions are handled securely peer-to-peer via official UPI channels or verified cryptocurrency ledgers during our direct Telegram chats. By keeping payment processing off our main web server, we drastically reduce the risk of any financial data breaches.</p>
        </>
      )
    },
    {
      title: "4. Third-Party Services and Analytics",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>While we build and maintain our own core prediction engine, we do rely on a few trusted third-party services to keep the platform operational. We want you to know exactly who they are and what they do:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Telegram:</strong> We use Telegram as our primary communication and support hub. When you interact with us there, your data is subject to Telegram's own privacy policy. We recommend adjusting your Telegram privacy settings to your comfort level.</li>
            <li><strong>Cloudflare:</strong> We route our traffic through Cloudflare to ensure fast load times worldwide and to block malicious bot attacks. Cloudflare may process your IP address strictly for security and routing purposes.</li>
            <li><strong>Vercel & Next.js:</strong> Our front-end application is hosted on modern edge networks to provide you with millisecond-latency updates, which is crucial for 30-second and 1-minute prediction modes.</li>
          </ul>
          <p>We do not use invasive third-party tracking pixels like Facebook Pixel or aggressive Google Ads trackers that follow you around the internet.</p>
        </>
      )
    },
    {
      title: "5. Cookies and Local Storage",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Unlike platforms that force you to accept hundreds of tracking cookies, we use browser storage purely for functional reasons. We use Local Storage and Session Storage in your browser to remember your preferences—such as whether you prefer the 'Number Only' or 'Show All' view, your selected game mode (1m, 3m, 5m), and to keep your session active so you don't have to constantly reload the page during a fast-paced game.</p>
          <p>We do not use cookies to track your browsing history on other websites. If you clear your browser cache and cookies, the only thing you will lose is your local preferences and you may need to re-enter your dashboard via your original link.</p>
        </>
      )
    },
    {
      title: "6. Data Retention: How Long We Keep Your Info",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>We believe in cleaning up after ourselves. We do not hoard data indefinitely. Here is our retention schedule:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Active Session Data:</strong> Deleted immediately upon closing your browser or when the session token expires.</li>
            <li><strong>Payment Screenshots:</strong> Kept only as long as necessary to resolve any accounting discrepancies, typically no longer than 30 days.</li>
            <li><strong>Support Chat Logs:</strong> Maintained on Telegram to provide context for your future support requests, but you are free to delete the chat history on your end at any time, which wipes it for both of us.</li>
          </ul>
        </>
      )
    },
    {
      title: "7. You're Always in Control (Your Rights)",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Regardless of where you live—be it under the jurisdiction of GDPR in Europe, CCPA in California, or anywhere else—we grant all our users the same fundamental rights over their data. It’s your data, after all. You have the explicit right to:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>The Right to be Forgotten:</strong> Request a full, irreversible wipe of your account data, license key associations, and support logs.</li>
            <li><strong>The Right to Access:</strong> Ask us exactly what information we currently hold associated with your Telegram handle.</li>
            <li><strong>The Right to Correction:</strong> Update any incorrect information regarding your license or contact details.</li>
          </ul>
          <p style={{ marginTop: "12px" }}>To make any of these requests, simply drop us a message on Telegram. You won't have to fill out complex web forms or deal with automated bots; a real human will handle your request promptly.</p>
        </>
      )
    },
    {
      title: "8. Policy Updates and Contact",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>The digital landscape moves fast, and as our AI models and platform features evolve, we may occasionally need to update this Privacy Policy. When we make significant changes, we won't just silently change the text; we will post an announcement in our official Telegram channel so you are always in the loop.</p>
          <p>If you have any questions, concerns, or simply want to chat about how we handle data, our door is always open. The fastest and only official way to reach us is through our Telegram support handle. We value your privacy as much as we value the accuracy of our predictions.</p>
        </>
      )
    }
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "24px 16px 0", overflowX: "hidden" }}>
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
      <SiteFooter className="!mt-12 -mx-4 w-[calc(100%+2rem)]" />
    </div>
  );
}
