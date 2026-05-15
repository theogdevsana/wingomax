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

import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export default async function Page() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  return <TermsPage telegramLink={telegramLink} />;
}
