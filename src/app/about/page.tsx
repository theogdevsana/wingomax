import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About | Wingo Signal - AI-Powered Prediction Platform",
  description: "Learn more about Wingo Signal — the most trusted AI-powered prediction platform for Wingo, Aviator, Mines and more. Our mission, team, and technology.",
  keywords: ["about wingo signal", "wingo prediction platform", "ai prediction tool", "wingo signal team"],
  alternates: {
    canonical: '/about',
  },
};

import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

import JsonLd from "@/components/JsonLd";

export default async function Page() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "About", item: "/about" }
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} />
      <AboutClient telegramLink={telegramLink} />
    </>
  );
}
