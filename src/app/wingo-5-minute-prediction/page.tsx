import PredictionTool from "@/components/PredictionTool";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Wingo 5 Minute Prediction - WinGo 5 Min Predictor & Patterns",
  description: "Official Wingo 5 minute prediction signals. Master the 5 min WinGo game with our AI predictor app and real-time big small patterns.",
  keywords: ["wingo 5 minute prediction", "wingo predictor app download", "wingo 5 min pattern", "wingo signal telegram"],
  alternates: {
    canonical: "https://wingosignals.xyz/wingo-5-minute-prediction",
  }
};

import JsonLd from "@/components/JsonLd";

export default async function Wingo5mPage() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

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
