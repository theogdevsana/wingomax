import { Metadata } from "next";
import FAQPage from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ | Wingo Signal - Frequently Asked Questions",
  description: "Find answers to common questions about Wingo Signal predictions, account activation, accuracy rates, and premium feature support.",
  keywords: ["wingo faq", "wingo support", "how wingo tool works", "wingo signal accuracy"],
  alternates: {
    canonical: '/faq',
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
    { name: "FAQ", item: "/faq" }
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} />
      <FAQPage telegramLink={telegramLink} />
    </>
  );
}
