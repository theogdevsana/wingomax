import { Metadata } from "next";
import DownloadClient from "./download/DownloadClient";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Download Wingo Signal - #1 AI Color Prediction Tool 2026 | Free Access",
  description:
    "Download Wingo Signal — the most accurate AI-powered color prediction tool for 91Club, Tiranga, BDG Win, 82 Lottery & 10+ platforms. Get 95%+ accuracy signals for 30-sec, 1-min, 3-min & 5-min Wingo rounds. No APK needed — works in your browser instantly. Join 50,000+ users.",
  keywords: [
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
    title: "Download Wingo Signal - #1 AI Wingo Prediction Tool 2026 | 95%+ Accuracy",
    description:
      "Get free access to Wingo Signal — the most trusted AI color prediction platform for 91Club, Tiranga, BDG Win & 10+ platforms. 95%+ accuracy. No APK download required. Works on any device.",
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
    title: "Download Wingo Signal - AI Prediction Tool 2026 | 95%+ Accuracy",
    description:
      "Download & use Wingo Signal free — AI-powered predictions for 91Club, Tiranga, BDG Win and 10+ platforms. 50,000+ users trust us daily. No APK required.",
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
];

export default function HomePage() {
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
      <DownloadClient />
    </>
  );
}
