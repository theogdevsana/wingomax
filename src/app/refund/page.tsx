import { Metadata } from "next";
import RefundPage from "./RefundClient";

export const metadata: Metadata = {
  title: "Refund Policy | Wingo Signal - Cancellation & Returns",
  description: "Review our refund and cancellation policies. Learn about the terms for premium signal subscriptions and feature activation refunds.",
  keywords: ["wingo refund", "cancellation policy", "refund terms", "subscription refund"],
};

import connectMongo from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export default async function Page() {
  await connectMongo();
  const settings = await Settings.findOne({});
  const telegramLink = settings?.telegramLink || "https://t.me/enzosrs";

  return <RefundPage telegramLink={telegramLink} />;
}
