import { Metadata } from "next";
import TermsPage from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Service | Wingo Signal - Rules & Guidelines",
  description: "Read the Terms of Service for Wingo Signal. Understand our usage policies, user responsibilities, and the conditions for using our prediction tools.",
  keywords: ["wingo terms", "terms of use", "wingo signal rules", "service guidelines"],
  alternates: {
    canonical: '/terms',
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
    { name: "Terms of Service", item: "/terms" }
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} />
      <TermsPage telegramLink={telegramLink} />
    </>
  );
}
