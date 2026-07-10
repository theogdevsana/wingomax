import PredictionTool from "@/components/PredictionTool";
import { query } from '@/lib/db';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Wingo 5 Minute Prediction | Period and History Analysis",
  description: "Review Wingo 5-minute period timing, recent result history, colour and size context, plus a browser-based statistical signal.",
  keywords: ["wingo 5 minute prediction", "wingo 5 minute history", "wingo period analysis", "wingo size trend"],
  alternates: {
    canonical: "https://wingosignals.com/wingo-5-minute-prediction",
  }
};

import JsonLd from "@/components/JsonLd";

export default async function Wingo5mPage() {
  let telegramLink = "https://t.me/enzosrs";
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";
  } catch {}

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Wingo 5 Min Prediction", item: "/wingo-5-minute-prediction" }
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} faq={[
        { question: "What does the 5-minute page show?", answer: "It presents the active period, countdown and recent signal context for a five-minute interval." },
        { question: "Can the page predict every result correctly?", answer: "No. Each displayed signal is an informational estimate based on limited recent context." }
      ]} page={{ name: "Wingo 5 Minute Signal Overview", description: "A browser-based view of the current Wingo five-minute period, countdown and recent signal context. Outputs are estimates, not guarantees.", url: "https://wingosignals.com/wingo-5-minute-prediction" }} />
      <PredictionTool mode="5m" telegramLink={telegramLink} />
    </>
  );
}
