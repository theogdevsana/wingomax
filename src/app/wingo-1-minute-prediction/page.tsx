import PredictionTool from "@/components/PredictionTool";
import { query } from '@/lib/db';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Wingo 1 Min Prediction - WinGo 1 Minute Formula & Signals",
  description: "Get the latest Wingo 1 min prediction signals and color prediction formula. Accurate WinGo 1 minute patterns for big small games and number predictions.",
  keywords: ["wingo 1 min prediction", "wingo color prediction formula", "wingo 1 min prediction app", "wingo signal software", "91club wingo prediction", "wingo mod apk"],
  alternates: {
    canonical: "https://wingosignals.com/wingo-1-minute-prediction",
  }
};

import JsonLd from "@/components/JsonLd";

export default async function Wingo1mPage() {
  const result = await query('SELECT telegram_link FROM settings LIMIT 1');
  const telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";

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
