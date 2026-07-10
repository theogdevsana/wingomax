import PredictionTool from "@/components/PredictionTool";
import { query } from '@/lib/db';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Wingo 30 Second Prediction | Live Period and History",
  description: "Review Wingo 30-second period timing, recent big-small history, colour context, and statistical signals in a responsive browser interface.",
  keywords: ["wingo 30 second prediction", "wingo 30s history", "wingo 30 second period", "wingo big small"],
  alternates: {
    canonical: "https://wingosignals.com/wingo-30-seconds-prediction",
  }
};

import JsonLd from "@/components/JsonLd";

export default async function Wingo30SecondsPrediction() {
  let telegramLink = "https://t.me/enzosrs";
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";
  } catch {}

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Wingo 30s Prediction", item: "/wingo-30-seconds-prediction" }
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} faq={[
        { question: "What does the 30-second page show?", answer: "It shows the current period, countdown and a compact table of recent generated signal entries." },
        { question: "Are 30-second signals guaranteed?", answer: "No. Signals are informational estimates and may differ from final results." }
      ]} page={{ name: "Wingo 30 Second Signal Overview", description: "A browser-based view of the current Wingo 30-second period, countdown and recent signal context. Outputs are estimates, not guarantees.", url: "https://wingosignals.com/wingo-30-seconds-prediction" }} />
      <PredictionTool mode="30s" telegramLink={telegramLink} />
    </>
  );
}
