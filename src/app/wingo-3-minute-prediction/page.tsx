import PredictionTool from "@/components/PredictionTool";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wingo 3 Minutes Prediction Tool - Free AI Analyst",
  description: "Get real-time Wingo 3 Minutes results with our AI-powered free prediction tool. Accurate patterns for big, small, and color analysis.",
  alternates: {
    canonical: "https://wingosignal.com/wingo-3-minute-prediction",
  }
};

export default async function Wingo3mPage() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  return <PredictionTool mode="3m" telegramLink={telegramLink} />;
}
