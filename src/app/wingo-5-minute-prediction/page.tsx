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
      <JsonLd breadcrumbs={breadcrumbs} />
      <PredictionTool mode="5m" telegramLink={telegramLink} />
    </>
  );
}
