import { Metadata } from "next";
import DownloadClient from "./download/DownloadClient";
import JsonLd from "@/components/JsonLd";
import { query } from '@/lib/db';

export const metadata: Metadata = {
  title: "Wingo Prediction | Colour Prediction, 1 Min, Big Small & AI Signal — Wingo Signal",
  description:
    "Wingo Prediction tool for 1 minute, 3 minute, 5 minute and 30 second intervals. Get Wingo colour prediction, big small prediction and AI-assisted period signals — free, browser-based, no APK needed.",
  keywords: [
    "wingo prediction",
    "wingo 1 minute prediction",
    "wingo colour prediction",
    "wingo big small prediction",
    "wingo 30 second prediction",
    "wingo 3 minute prediction",
    "wingo 5 minute prediction",
    "wingo ai prediction",
    "wingo prediction tool",
    "wingo period prediction",
    "wingo prediction today",
    "how to predict wingo colour",
    "best wingo prediction site",
    "wingo signal",
    "wingo signals",
    "wingo prediction online",
    "wingo colour signal",
    "wingo period tracker",
    "wingo result history",
    "wingo big small signal",
    "wingo prediction app",
    "91club wingo prediction",
    "tiranga wingo prediction",
    "wingo colour pattern",
  ],
  alternates: {
    canonical: "https://wingosignals.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://wingosignals.com",
    siteName: "Wingo Signal",
    title: "Wingo Prediction | Colour, Big Small & AI Signal — Wingo Signal",
    description:
      "Free Wingo Prediction tool. Check colour prediction, big small signals, period timer and recent result history for 30 sec, 1 min, 3 min and 5 min Wingo intervals.",
    images: [
      {
        url: "https://wingosignals.com/logo/hero_main.png",
        width: 1200,
        height: 630,
        alt: "Wingo Prediction dashboard — colour signal, period timer and result history",
      },
    ],
    countryName: "India",
    phoneNumbers: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wingo Prediction | Colour, Big Small & AI Signal",
    description:
      "Get Wingo colour prediction, big small signals and period history in one free browser-based tool. No APK needed.",
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
  classification: "Wingo Prediction and colour signal reference tool",
  other: {
    "application-name": "Wingo Signal",
    "apple-mobile-web-app-title": "Wingo Signal",
  },
};

const faqData = [
  {
    question: "What is Wingo Prediction?",
    answer: "Wingo Prediction refers to using statistical context — period history, recent colour entries and size patterns — to estimate the likely outcome of the next Wingo round. Wingo Signal provides a browser-based dashboard that displays this context across 30-second, 1-minute, 3-minute and 5-minute intervals."
  },
  {
    question: "How does Wingo colour prediction work?",
    answer: "Wingo colour prediction analyses recent colour results (Red, Green, Violet) and size patterns (Big/Small) to generate a statistical signal estimate. The Wingo Signal tool displays the last 10 results alongside a colour signal for the current period — no app download required."
  },
  {
    question: "What is the best Wingo prediction site?",
    answer: "Wingo Signal (wingosignals.com) is a free, browser-based Wingo prediction tool that provides colour signals, big-small estimates, period tracking and result history for 30-second, 1-minute, 3-minute and 5-minute Wingo games — available on 91Club, Tiranga, BDG Win and more."
  },
  {
    question: "How to predict Wingo colour today?",
    answer: "Open the Wingo Signal dashboard, choose your interval (30 sec, 1 min, 3 min or 5 min), and check the current period colour signal. The signal is based on recent colour and size history. Always verify that the displayed period matches your live game before acting on any signal."
  },
  {
    question: "What is Wingo big small prediction?",
    answer: "Wingo big small prediction estimates whether the next number will be Big (5–9) or Small (0–4) based on the recent result pattern. Wingo Signal displays both the colour signal and the big/small estimate together for each interval period."
  },
  {
    question: "Which Wingo prediction intervals are available?",
    answer: "Wingo Signal offers four dedicated prediction views: 30 Seconds, 1 Minute, 3 Minutes and 5 Minutes. Each view shows the active period, countdown timer, colour signal, big/small signal and the last 10 result entries."
  },
  {
    question: "Is Wingo prediction accurate?",
    answer: "Wingo prediction signals are statistical estimates based on recent result history — they are not guaranteed outcomes. No tool can predict a random result with certainty. Use Wingo Signal as a reference context, not as a guaranteed guide."
  },
  {
    question: "Do I need to download an APK for Wingo prediction?",
    answer: "No. Wingo Signal runs entirely in your mobile or desktop browser. There is no APK to download and no app installation required."
  },
  {
    question: "Does Wingo Signal work with 91Club and Tiranga?",
    answer: "Yes. Wingo Signal works as a companion reference for Wingo games on 91Club, Tiranga Games, BDG Win, 82 Lottery, Jai Club, Yarr Win and other platforms that offer Wingo-style colour prediction games."
  },
  {
    question: "What is Wingo AI prediction?",
    answer: "Wingo AI prediction refers to using algorithmic signal estimation — analysing colour sequences, size patterns and period timing — to suggest a likely next outcome. Wingo Signal applies this statistical approach to display colour and big/small signals for each active period."
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
      <JsonLd
        breadcrumbs={[{ name: "Home", item: "/" }]}
        faq={faqData}
        page={{
          name: "Wingo Prediction | Colour, Big Small & AI Signal Tool — Wingo Signal",
          description: "Free Wingo Prediction tool for colour prediction, big small signals, period tracking and result history across 30 sec, 1 min, 3 min and 5 min Wingo intervals.",
          url: "https://wingosignals.com"
        }}
      />
      <DownloadClient telegramLink={telegramLink} />
    </>
  );
}
