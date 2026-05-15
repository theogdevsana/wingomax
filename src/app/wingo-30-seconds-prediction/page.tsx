import PredictionTool from "@/components/PredictionTool";
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wingo 30 Seconds Prediction Tool - Free AI Analyst",
  description: "Get real-time Wingo 30 Seconds results with our AI-powered free prediction tool. Accurate patterns for big, small, and color analysis.",
  alternates: {
    canonical: "https://wingosignal.com/wingo-30-seconds-prediction",
  }
};

export default async function Wingo30SecondsPrediction() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  return <PredictionTool mode="30s" telegramLink={telegramLink} />;
}
