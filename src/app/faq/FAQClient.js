'use client';

import { useState } from "react";
import { HelpCircle, ChevronLeft, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SiteFooter from "@/components/SiteFooter";

export default function FAQClient({ telegramLink }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is Wingo Signal?",
      answer: "Wingo Signal is an advanced analytics platform that uses state-of-the-art algorithms to provide real-time predictions and data analysis for various systems. It helps users make informed decisions based on statistical modeling."
    },
    {
      question: "How accurate are the signals?",
      answer: "Our system maintains a high accuracy rate (averaging 89-98%) by constantly updating its models with live data. However, please note that all signals are statistical in nature and should be used as a guidance tool rather than a guarantee."
    },
    {
      question: "How do I unlock the premium features?",
      answer: "Premium features can be unlocked by completing a one-time activation. Go to the Checkout page, complete the payment via UPI, and submit your UTR number. Once verified, your account will be upgraded automatically."
    },
    {
      question: "What should I do if my payment is pending?",
      answer: "Verification usually takes 5-30 minutes during business hours. If your payment has been pending for more than 2 hours, please contact our support team on Telegram with your transaction screenshot."
    },
    {
      question: "Can I use the tool on multiple devices?",
      answer: "Yes, once your account is activated, you can log in from any mobile device. However, for security reasons, we limit concurrent sessions to ensure the best performance for all users."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and secure processing for all user data and transactions. We do not store your sensitive payment information directly on our servers."
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
            <HelpCircle style={{ color: "#f59e0b", width: "26px", height: "26px" }} />
            Frequently Asked Questions
          </div>
          <p style={{ fontSize: "clamp(13px, 3vw, 15px)", color: "#64748b", marginTop: "8px", fontWeight: "500" }}>Everything you need to know about our service</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                background: 'white',
                borderRadius: '24px',
                border: '2px solid rgba(0,0,0,0.03)',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                style={{
                  width: '100%',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ 
                  fontSize: 'clamp(15px, 3.5vw, 17px)', 
                  fontWeight: '700', 
                  color: '#1e293b',
                  paddingRight: '16px'
                }}>
                  {faq.question}
                </span>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: openIndex === index ? '#10b981' : '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: openIndex === index ? 'white' : '#64748b',
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}>
                  {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ 
                      padding: '0 24px 24px', 
                      color: '#475569',
                      lineHeight: '1.8',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <div style={{ marginTop: '64px', textAlign: 'center', padding: '32px 24px', borderTop: '2px solid rgba(0,0,0,0.05)' }}>
          <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>Still have questions?</p>
          <a 
            href={telegramLink} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#10b981',
              fontWeight: '800',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
          >
            Contact Support →
          </a>
        </div>
      </main>
    </div>
    <SiteFooter />
    </>
  );
}
