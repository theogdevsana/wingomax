import { Metadata } from "next";
import DownloadClient from "./download/DownloadClient";
import JsonLd from "@/components/JsonLd";
import { query } from '@/lib/db';

export const metadata: Metadata = {
  title: "Wingo Signal | Live Wingo History and Statistical Signals",
  description:
    "Track Wingo periods, inspect recent colour and big-small history, and view statistical signals for 30-second, 1-minute, 3-minute, and 5-minute rounds.",
  keywords: [
    "wingo signal",
    "wingo signals",
    "wingo signal prediction",
    "wingo colour prediction",
    "wingo prediction",
    "wingo signal download",
    "wingo prediction tool download",
    "wingo predictor app",
    "91club prediction tool download",
    "tiranga prediction tool download",
    "bdg win prediction",
    "color prediction tool 2026",
    "wingo signal apk",
    "wingo color prediction formula",
    "wingo big small prediction",
    "wingo signal free",
    "wingo predictor online",
    "wingo signal app download",
    "wingo signal login",
    "wingo signal telegram",
    "ai color prediction tool india",
    "82 lottery prediction signal",
    "jai club prediction tool",
    "wingo 1 minute prediction",
    "wingo 3 minute prediction",
    "wingo 5 minute prediction",
    "wingo 30 seconds prediction",
    "wingo signal 91club",
    "wingo prediction website",
    "best color prediction tool",
    "wingo signal online free",
    "prediction tool for tiranga",
    "wingo colour prediction",
    "wingo big small prediction tool",
    "wingo predictor online free",
    "wingo winning tricks",
    "wingo signal 1 minute",
    "91club wingo prediction",
    "tiranga colour prediction",
    "wingo telegram signal",
    "wingo panel",
    "best wingo prediction site",
    "wingo mod apk",
    "wingo ai prediction bot",
  ],
  alternates: {
    canonical: "https://wingosignals.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wingosignals.com",
    siteName: "Wingo Signal",
    title: "Wingo Signal | Wingo Period, History and Signal Dashboard",
    description:
      "A responsive Wingo dashboard for period timing, recent result history, and uncertain statistical big-small signals. No APK required.",
    images: [
      {
        url: "https://wingosignals.com/logo/hero_main.png",
        width: 1200,
        height: 630,
        alt: "Wingo Signal AI Color Prediction Tool Dashboard Preview",
      },
    ],
    countryName: "India",
    phoneNumbers: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wingo Signal | Period and Result History Dashboard",
    description:
      "Review Wingo period timing, recent results, and statistical signal context from a mobile-friendly browser dashboard.",
    images: ["https://wingosignals.com/logo/hero_main.png"],
    creator: "@enzosrs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "Wingo Signal Team", url: "https://wingosignals.com" }],
  creator: "Wingo Signal",
  publisher: "Wingo Signal",
  category: "Technology",
  classification: "AI Prediction Tool",
  other: {
    "application-name": "Wingo Signal",
    "apple-mobile-web-app-title": "Wingo Signal",
  },
};

const faqData = [
  {
    question: "Is Wingo Signal safe to use?",
    answer: "Wingo Signal is browser based, so no APK is required. Use only the official site and keep your account credentials private."
  },
  {
    question: "Which platforms does Wingo Signal support?",
    answer: "We support 91Club, Tiranga Games, BDG Win, 82 Lottery, Jai Club, Yarr Win, Raja Game, Jalwa Game, GOA Game, Sikkim Games, and Tashan Win, with more platforms added regularly."
  },
  {
    question: "What prediction intervals are available?",
    answer: "Wingo Signal covers 30 second, 1 minute, 3 minute, and 5 minute Wingo rounds. Each interval runs on a dedicated model fine tuned for that round duration."
  },
  {
    question: "How accurate are the predictions?",
    answer: "Signals are statistical estimates based on available data and can be wrong. No accuracy percentage or future result is guaranteed."
  },
  {
    question: "Do I need to download an app?",
    answer: "No download is needed. Wingo Signal runs entirely in your browser. Open wingosignals.com on any device, Android, iPhone, tablet, or desktop, and start immediately."
  },
  {
    question: "How do I get a license key for Wingo Signal?",
    answer: "Contact our support team on Telegram to purchase your license key. Once activated, your access works instantly across all devices — no installation or APK required."
  },
  {
    question: "Is Wingo Signal free to use?",
    answer: "Yes, Wingo Signal offers a free tier that gives you access to live predictions with real time signals. Premium plans are available for users who want additional features, dedicated support, and higher priority access."
  },
];

export default async function HomePage() {
  let telegramLink = "https://t.me/enzosrs";
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";
  } catch {}

  return (
    <>
      <JsonLd faq={faqData} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Wingo Signal",
          "operatingSystem": "Web, Android, iOS",
          "applicationCategory": "GameApplication",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
          "description": "Wingo Signal provides browser-based period tracking, recent result history, and statistical signal context.",
          "url": "https://wingosignals.com",
        })
      }} />
      <DownloadClient telegramLink={telegramLink} />
    </>
  );
}
