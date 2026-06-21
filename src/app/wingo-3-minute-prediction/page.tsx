import PredictionTool from "@/components/PredictionTool";
import { query } from '@/lib/db';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Wingo 3 Minute Prediction | Trend and Result History",
  description: "Use the Wingo 3-minute page to compare recent colour, number, and big-small history with current period timing and statistical context.",
  keywords: ["wingo 3 minute prediction", "wingo 3 minute history", "wingo colour history", "wingo big small trend"],
  alternates: {
    canonical: "https://wingosignals.com/wingo-3-minute-prediction",
  }
};

import JsonLd from "@/components/JsonLd";

export default async function Wingo3mPage() {
  let telegramLink = "https://t.me/enzosrs";
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";
  } catch {}

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Wingo 3 Min Prediction", item: "/wingo-3-minute-prediction" }
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} />
      <PredictionTool mode="3m" telegramLink={telegramLink} />
    </>
  );
}
