import { Metadata } from "next";
import PrivacyPage from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Wingo Signal - Your Data Security",
  description: "Learn how Wingo Signal protects your privacy and manages your data. Our commitment to securing your personal information and prediction history.",
  keywords: ["wingo privacy", "data protection", "wingo signal terms", "privacy policy"],
  alternates: {
    canonical: '/privacy',
  },
};

import { query } from '@/lib/db';

import JsonLd from "@/components/JsonLd";

export default async function Page() {
  const result = await query('SELECT telegram_link FROM settings LIMIT 1');
  const telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Privacy Policy", item: "/privacy" }
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} />
      <PrivacyPage telegramLink={telegramLink} />
    </>
  );
}
