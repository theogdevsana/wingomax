import PredictionTool from "@/components/PredictionTool";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Wingo 3 Minute Prediction - WinGo 3 Min Strategy & Signals",
  description: "Accurate Wingo 3 minute prediction tool. Use our AI signals and Wingo big small pattern strategy to improve your win rate in WinGo 3 min rounds.",
  keywords: ["wingo 3 minute prediction", "wingo big small pattern", "wingo prediction online", "wingo free signal", "tiranga wingo prediction"],
  alternates: {
    canonical: "https://wingosignals.xyz/wingo-3-minute-prediction",
  }
};

import JsonLd from "@/components/JsonLd";

export default async function Wingo3mPage() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

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
