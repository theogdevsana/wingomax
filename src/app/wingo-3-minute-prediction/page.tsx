import PredictionTool from "@/components/PredictionTool";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wingo 3 Minute Prediction - WinGo 3 Min Strategy & Signals",
  description: "Accurate Wingo 3 minute prediction tool. Use our AI signals and Wingo big small pattern strategy to improve your win rate in WinGo 3 min rounds.",
  keywords: ["wingo 3 minute prediction", "wingo big small pattern", "wingo prediction online", "wingo free signal", "tiranga wingo prediction"],
  alternates: {
    canonical: "https://wingosignals.xyz/wingo-3-minute-prediction",
  }
};

export default async function Wingo3mPage() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  return <PredictionTool mode="3m" telegramLink={telegramLink} />;
}
