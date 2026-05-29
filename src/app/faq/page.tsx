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
 
import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

import JsonLd from "@/components/JsonLd";

export default async function Page() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

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
