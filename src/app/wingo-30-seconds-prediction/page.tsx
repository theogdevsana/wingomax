import PredictionTool from "@/components/PredictionTool";
import { query } from '@/lib/db';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Wingo 30 Seconds Prediction - Official AI Pattern Analyst",
  description: "Get the most accurate Wingo 30 seconds prediction signals. Our AI tool provides real-time WinGo 30s color and number patterns for Tiranga and 91Club.",
  keywords: ["wingo 30s prediction", "wingo prediction telegram link", "wingo mod apk", "wingo 30s signal app"],
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
      <JsonLd breadcrumbs={breadcrumbs} />
      <PredictionTool mode="30s" telegramLink={telegramLink} />
    </>
  );
}
