"use client";

import { RefreshCcw, ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

export default function RefundClient({ telegramLink }) {
  const sections = [
    {
      title: "1. Our Honest Refund Philosophy",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>At Wingo Signal, we want you to pay for something that actually works for you, and we want to ensure you get exactly what you paid for. Unlike massive, faceless corporations that hide behind automated bots and endless ticketing systems, we handle every single refund request personally.</p>
          <p style={{ marginBottom: "12px" }}>However, the nature of our product requires a very specific refund framework. We sell access to live proprietary data, complex algorithmic computations, and immediate server access. Because digital goods of this nature cannot be "returned" in the traditional physical sense, and because the data is consumed in real-time, we have to enforce strict guidelines regarding when refunds are applicable to prevent system abuse.</p>
          <p>Our goal is fairness. We will never keep your money if our system fails to deliver the technical access you purchased. Conversely, we cannot act as an insurance policy against statistical variance or user error. Please read the following guidelines carefully before making a purchase.</p>
        </>
      )
    },
    {
      title: "2. The Nature of Live Statistical Data",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>To understand our refund policy, you must understand what you are buying. You are purchasing a license to access our high-speed analytics servers and view our AI-generated probability models. You are NOT purchasing guaranteed winning outcomes.</p>
          <p>Our algorithms analyze historical data to find the highest mathematical probability for the next draw. While our accuracy is industry-leading, it is statistically impossible to achieve a 100% win rate infinitely. Patterns change, anomalies occur, and the underlying game mechanics dictate that losses are an inevitable part of the mathematical curve. Because we deliver the statistical data perfectly, the occurrence of a losing signal does not constitute a defect in the product.</p>
        </>
      )
    },
    {
      title: "3. When We Can NOT Issue a Refund",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>To maintain fairness for all users and keep our server costs manageable, we absolutely cannot issue refunds under the following scenarios:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Signal Inaccuracy (Statistical Variance):</strong> You experienced a losing streak or the signals did not match the actual game outcomes during a specific timeframe. As stated everywhere on our platform, signals are statistical probabilities, not guarantees.</li>
            <li><strong>Change of Mind:</strong> You purchased the license, used it for a few hours or days, and simply decided you no longer want to play or use the tool.</li>
            <li><strong>Account Bans for Policy Violation:</strong> Your account was suspended because our security systems detected you sharing your private license key with multiple users, or attempting to scrape our data with bots. If you violate the Terms of Service, your payment is forfeit.</li>
            <li><strong>Failure to Prove Payment:</strong> You claim to have sent payment but cannot provide a valid screenshot, UTR (Unique Transaction Reference) number, or the payment was sent to an unauthorized, fraudulent UPI ID not officially provided by our Telegram support.</li>
            <li><strong>Third-Party Issues:</strong> Your internet connection is too slow to load the 30-second signals in time, or the game platform itself is down. We are only responsible for the uptime of Wingo Signal.</li>
          </ul>
        </>
      )
    },
    {
      title: "4. When We DO Issue Refunds (Eligibility)",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>We stand by the technical integrity of our platform. You are absolutely entitled to a full refund, or a compensatory extension of your license, in the following scenarios:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Failed Activation:</strong> You successfully made a payment, the UTR is verified on our end, but due to a database error, your activation key fails to unlock the premium dashboard features.</li>
            <li><strong>Catastrophic Server Failure:</strong> Our main servers go offline or experience critical database corruption that prevents you from accessing the dashboard for a continuous period exceeding 24 hours during your active license timeframe.</li>
            <li><strong>Duplicate Billing:</strong> Due to a technical glitch or network stutter, you were accidentally charged twice for a single license period. We will immediately refund the duplicate transaction.</li>
          </ul>
        </>
      )
    },
    {
      title: "5. The Step-by-Step Refund Process",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>If you meet the eligibility criteria for a technical refund, we want to resolve it as quickly as possible. Please follow these exact steps to ensure a smooth process:</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>Step 1:</strong> Contact our official support team on Telegram (@enzosrs) within 24 hours of the technical failure or duplicate charge occurring.</li>
            <li><strong>Step 2:</strong> Provide your Wingo Signal username or associated email address so we can locate your account.</li>
            <li><strong>Step 3:</strong> Submit clear proof of payment. This must include a high-resolution screenshot of the successful transaction showing the UTR (12-digit reference number for UPI) or the blockchain hash (for crypto).</li>
            <li><strong>Step 4:</strong> Briefly describe the technical issue (e.g., "Key says invalid," or "Charged twice").</li>
          </ul>
          <p>Once you submit this information, our admin will verify the logs. We do not use bots; Enzo or a senior team member will review your case personally.</p>
        </>
      )
    },
    {
      title: "6. Processing Time and Methods",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Once a refund is approved by our team, we initiate the transfer from our end within 24 hours. However, the time it takes for the funds to reflect in your account depends entirely on your bank or payment provider.</p>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", marginBottom: "12px" }}>
            <li><strong>UPI Refunds:</strong> Typically settle within 3 to 5 business days, depending on NPCI and bank processing queues.</li>
            <li><strong>Crypto Refunds:</strong> Processed almost instantly once approved, minus any network gas fees which are non-refundable.</li>
          </ul>
          <p>Refunds will ONLY be sent back to the exact original payment source. For security and anti-money laundering reasons, we will never refund a payment to a different UPI ID or wallet address than the one used for the initial purchase.</p>
        </>
      )
    },
    {
      title: "7. Fraudulent Chargebacks and Disputes",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>We monitor all payment disputes very closely. If you attempt to file a fraudulent chargeback with your bank or payment provider while continuing to use our service, or file a dispute claiming "item not received" after we have server logs showing you actively consuming our signals, severe action will be taken.</p>
          <p>Filing a false chargeback will result in an immediate, permanent ban of your IP address, device ID, and associated accounts from the entire Wingo Signal ecosystem. We also reserve the right to submit our server access logs to the payment provider as evidence to contest the fraudulent dispute.</p>
        </>
      )
    },
    {
      title: "8. Alternatives to Refunds (License Pausing)",
      content: (
        <>
          <p style={{ marginBottom: "12px" }}>Sometimes life gets in the way. If you purchased a premium license but unexpectedly have to travel or cannot play for a few weeks, we cannot offer a refund for "unused time."</p>
          <p>However, we are human. If you message us on Telegram BEFORE your period of inactivity begins, we may, at our sole discretion, offer to "pause" your license. This allows you to freeze the remaining days on your account and reactivate them when you return. This is a courtesy service, not a guaranteed right, and is handled on a case-by-case basis.</p>
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
