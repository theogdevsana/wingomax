import PredictionTool from "@/components/PredictionTool";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wingo 30 Seconds Prediction - Official AI Pattern Analyst",
  description: "Get the most accurate Wingo 30 seconds prediction signals. Our AI tool provides real-time WinGo 30s color and number patterns for Tiranga and 91Club.",
  keywords: ["wingo 30s prediction", "wingo prediction telegram link", "wingo mod apk", "wingo 30s signal app"],
  alternates: {
    canonical: "https://wingosignals.xyz/wingo-30-seconds-prediction",
  }
};

export default async function Wingo30SecondsPrediction() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  return <PredictionTool mode="30s" telegramLink={telegramLink} />;
}
