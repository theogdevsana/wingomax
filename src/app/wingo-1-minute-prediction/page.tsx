import PredictionTool from "@/components/PredictionTool";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wingo 1 Min Prediction - WinGo 1 Minute Formula & Signals",
  description: "Get the latest Wingo 1 min prediction signals and color prediction formula. Accurate WinGo 1 minute patterns for big small games and number predictions.",
  keywords: ["wingo 1 min prediction", "wingo color prediction formula", "wingo 1 min prediction app", "wingo signal software", "91club wingo prediction", "wingo mod apk"],
  alternates: {
    canonical: "https://wingosignals.xyz/wingo-1-minute-prediction",
  }
};

export default async function Wingo1mPage() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  return <PredictionTool mode="1m" telegramLink={telegramLink} />;
}
