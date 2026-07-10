import PredictionTool from "@/components/PredictionTool";
import { query } from '@/lib/db';
import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Wingo 1 Min Prediction | Live Color Signals & Draw History",
  description: "Get real-time Wingo 1 min prediction outcomes, color patterns, and statistical big-small indicators. Analyze live Wingo 1 min signals without downloading an APK.",
  keywords: [
    "wingo 1 min", "wingo 1 min prediction", "wingo 1 min signals", 
    "wingo prediction", "wingo signals", "wingo color history", 
    "wingo prediction page", "91club wingo 1 min", "tiranga wingo 1 min",
    "wingo 1 min strategy", "wingo 1 min pattern", "wingo big small patterns",
    "wingo signals online", "wingo 1 min prediction app"
  ],
  alternates: {
    canonical: "https://wingosignals.com/wingo-1-minute-prediction",
  }
};

export default async function Wingo1mPage() {
  let telegramLink = "https://t.me/enzosrs";
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";
  } catch {}

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Wingo 1 Min Prediction", item: "/wingo-1-minute-prediction" }
  ];

  const faq = [
    { question: "How do 1-minute statistical signals work?", answer: "The tool evaluates the frequency of big, small, red, and green outcomes in recent periods to identify when outcomes deviate from standard random distribution." },
    { question: "Is it possible for the AI signal to be incorrect?", answer: "Yes. Every draw is independent, meaning past patterns never force a specific future outcome. All signals are statistical estimations." },
    { question: "Is there a Wingo prediction app download required?", answer: "No. This tool is completely browser-based, ensuring rapid load times, responsive rendering, and zero local device installation." },
    { question: "What is the best way to interpret consecutive color streaks?", answer: "Consecutive outcomes are common in random sequences. Tracking these streaks helps identify current trend skews but does not predict when the streak will end." },
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} faq={faq} page={{ name: "Wingo 1 Minute Signal Overview", description: "A browser-based view of the current Wingo one-minute period, countdown and recent signal context. Outputs are estimates, not guarantees.", url: "https://wingosignals.com/wingo-1-minute-prediction" }} />
      <PredictionTool mode="1m" telegramLink={telegramLink} />
    </>
  );
}
