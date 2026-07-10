import { Metadata } from "next";
import DownloadClient from "./download/DownloadClient";
import JsonLd from "@/components/JsonLd";
import { query } from '@/lib/db';

export const metadata: Metadata = {
  title: "Wingo Signal | Period Timer, Result History and Signal Context",
  description:
    "A browser-based Wingo reference page for period timing, recent result history, colour context and statistical signal estimates across 30-second, 1-minute, 3-minute and 5-minute views.",
  keywords: [
    "wingo signals",
    "wingo signal",
    "winggo signals",
    "wingo period timer",
    "wingo 1 minute history",
    "wingo colour context",
    "wingo signal online",
    "wingo big small patterns",
    "wingo statistical estimates",
    "wingo colour history",
    "wingo result history",
    "wingo round reference",
  ],
  alternates: {
    canonical: "https://wingosignals.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wingosignals.com",
    siteName: "Wingo Signal",
    title: "Wingo Signal | Period Timer and Recent Result Context",
    description:
      "Review Wingo period timing, recent result history, colour context and statistical estimates in a browser-based interface.",
    images: [
      {
        url: "https://wingosignals.com/logo/hero_main.png",
        width: 1200,
        height: 630,
        alt: "Wingo Signal period timer and result-history dashboard",
      },
    ],
    countryName: "India",
    phoneNumbers: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wingo Signal | Period Timer and Result History",
    description:
      "Review Wingo period timing, recent result history and statistical signal context in your browser.",
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
  classification: "Wingo period and result-history reference",
  other: {
    "application-name": "Wingo Signal",
    "apple-mobile-web-app-title": "Wingo Signal",
  },
};

const faqData = [
  {
    question: "What is Wingo Signal?",
    answer: "Wingo Signal is a browser-based reference interface that keeps period timing, recent history, colour context and statistical estimates together in one place."
  },
  {
    question: "How do Wingo signals work?",
    answer: "The page presents the current period, countdown and recent entries as context. Any displayed signal is an estimate and does not determine a future result."
  },
  {
    question: "Do I need to download an APK to use Wingo Signal?",
    answer: "No. The interface runs in a modern browser and does not require an APK download."
  },
  {
    question: "What game prediction intervals are available?",
    answer: "The site provides dedicated views for 30-second, 1-minute, 3-minute and 5-minute intervals."
  },
  {
    question: "Are Wingo signals guaranteed?",
    answer: "No. Signals are limited statistical estimates and may differ from final results."
  },
  {
    question: "What should I check on the page?",
    answer: "Check that the period, countdown and recent entries are current before using the page as a reference."
  },
  {
    question: "What should I check before applying any signal?",
    answer: "Review the current period, countdown and recent rows together. If the information looks delayed, wait for the next refresh."
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
      <JsonLd breadcrumbs={[{ name: "Home", item: "/" }]} faq={faqData} page={{ name: "Wingo Signal: Period Timer and Result History", description: "A browser-based Wingo reference page for period timing, recent result history, colour context and statistical signal estimates.", url: "https://wingosignals.com" }} />
      <DownloadClient telegramLink={telegramLink} />
    </>
  );
}
