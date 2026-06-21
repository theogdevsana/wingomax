import PredictionTool from "@/components/PredictionTool";
import { query } from '@/lib/db';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Wingo 1 Minute Prediction | History and Big-Small Signal",
  description: "View Wingo 1-minute recent results, period timing, big-small distribution, and an uncertain statistical signal without downloading an APK.",
  keywords: ["wingo 1 minute prediction", "wingo 1 minute history", "wingo big small signal", "wingo period"],
  alternates: {
    canonical: "https://wingosignals.com/wingo-1-minute-prediction",
  }
};

import JsonLd from "@/components/JsonLd";

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

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} />
      <PredictionTool mode="1m" telegramLink={telegramLink} />
    </>
  );
}
