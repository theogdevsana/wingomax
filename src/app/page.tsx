import { Metadata } from "next";
import DownloadClient from "./download/DownloadClient";
import JsonLd from "@/components/JsonLd";
import { query } from '@/lib/db';

export const metadata: Metadata = {
  title: "Wingo Prediction | Wingo Signal AI Colour Prediction Dashboard",
  description:
    "Use Wingo Signal to check Wingo prediction, Wingo 1 minute prediction, colour prediction, AI signals, period timing, and recent result history.",
  keywords: [
    "wingo prediction",
    "wingo 1 minute prediction",
    "wingo signals",
    "wingo colour prediction",
    "wingo ai prediction",
    "wingo signal",
    "wingo big small prediction",
    "wingo 30 seconds prediction",
    "wingo 3 minute prediction",
    "wingo 5 minute prediction",
    "91club wingo prediction",
    "tiranga wingo prediction",
    "bdg win wingo prediction",
    "wingo prediction website",
    "wingo history",
  ],
  alternates: {
    canonical: "https://wingosignals.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wingosignals.com",
    siteName: "Wingo Signal",
    title: "Wingo Prediction | Official Wingo Signal AI Dashboard",
    description:
      "Official Wingo Signal website for Wingo prediction, 1 minute colour prediction, recent history, and AI signals.",
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
    title: "Wingo Prediction | Wingo Signal AI Dashboard",
    description:
      "Check Wingo prediction, colour signals, 1 minute history, and AI signals on the official mobile-friendly website.",
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
  authors: [{ name: "Wingo Signal Editorial Team", url: "https://wingosignals.com/about" }],
  creator: "Wingo Signal",
  publisher: "Wingo Signal",
  category: "Technology",
  classification: "Statistical Wingo Prediction Dashboard",
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
    answer: "Wingo Signal has pages for 30 second, Wingo 1 minute prediction, 3 minute, and 5 minute rounds."
  },
  {
    question: "Can Wingo signals be wrong?",
    answer: "Signals are estimates based on history and patterns. They can be wrong, so no result is guaranteed."
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
          "description": "Wingo Signal helps users check Wingo prediction, Wingo 1 minute prediction, colour prediction, recent history, and AI signals in a browser.",
          "url": "https://wingosignals.com",
          "sameAs": ["https://wingosignals.com"],
          "featureList": [
            "Wingo prediction",
            "Wingo 1 minute prediction history",
            "Wingo colour prediction",
            "AI big small signal view",
            "30 second, 1 minute, 3 minute, and 5 minute round pages"
          ]
        })
      }} />
      <DownloadClient telegramLink={telegramLink} />
    </>
  );
}
