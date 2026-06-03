import { Metadata } from "next";
import DownloadClient from "./download/DownloadClient";
import JsonLd from "@/components/JsonLd";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export const metadata: Metadata = {
  title: "Wingo Signal - Free AI Color Prediction Tool for 91Club & Tiranga 2026",
  description:
    "Wingo Signal is the #1 AI color prediction tool for 91Club, Tiranga & BDG Win. Get 95%+ accurate Wingo signals (30s-5min) instantly in your browser. No download needed. Trusted by 50,000+ users.",
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
    "wingo signal 95 accuracy",
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
    "wingo hack tool",
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
    canonical: "https://wingosignals.xyz",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wingosignals.xyz",
    siteName: "Wingo Signal",
    title: "Wingo Signal - Free AI Color Prediction Tool | 95%+ Accuracy for 91Club & Tiranga",
    description:
      "Wingo Signal - the #1 AI color prediction tool for 91Club, Tiranga & BDG Win. Get 95%+ accurate Wingo signals instantly in your browser. No APK required. 50,000+ users.",
    images: [
      {
        url: "https://wingosignals.xyz/logo/hero_main.png",
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
    title: "Wingo Signal - Free AI Color Prediction Tool | 95%+ Accuracy",
    description:
      "Wingo Signal — AI-powered color predictions for 91Club, Tiranga & BDG Win. 95%+ accuracy. No download needed. Trusted by 50,000+ users daily.",
    images: ["https://wingosignals.xyz/logo/hero_main.png"],
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
  authors: [{ name: "Wingo Signal Team", url: "https://wingosignals.xyz" }],
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
    answer: "Yes. Wingo Signal is a browser based tool. No APK or third party software required. Your account uses AES-256 encryption and we maintain a strict no log policy on user activity."
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
    answer: "Our verified accuracy across all platforms and intervals is 91 to 96%. Individual sessions will vary, but the engine is built to surface the highest probability outcome for each round."
  },
  {
    question: "Do I need to download an app?",
    answer: "No download is needed. Wingo Signal runs entirely in your browser. Open wingosignals.xyz on any device, Android, iPhone, tablet, or desktop, and start immediately."
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
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

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
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "50000" },
          "description": "Wingo Signal is the #1 AI color prediction tool for 91Club, Tiranga, BDG Win and 10+ platforms with 95%+ accuracy.",
          "url": "https://wingosignals.xyz",
        })
      }} />
      <DownloadClient telegramLink={telegramLink} />
    </>
  );
}
