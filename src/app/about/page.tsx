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

import { query } from '@/lib/db';

import JsonLd from "@/components/JsonLd";

export default async function Page() {
  let telegramLink = "https://t.me/enzosrs";
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";
  } catch {}

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
