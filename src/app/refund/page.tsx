import { Metadata } from "next";
import RefundPage from "./RefundClient";

export const metadata: Metadata = {
  title: "Refund Policy | Wingo Signal - Cancellation & Returns",
  description: "Review our refund and cancellation policies. Learn about the terms for premium signal subscriptions and feature activation refunds.",
  keywords: ["wingo refund policy", "money back guarantee", "wingo subscription refund"],
  alternates: {
    canonical: '/refund',
  },
};

import JsonLd from "@/components/JsonLd";

export default async function Page() {
  const telegramLink = "https://t.me/enzosrs";

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Refund Policy", item: "/refund" }
  ];

  return (
    <>
      <JsonLd breadcrumbs={breadcrumbs} />
      <RefundPage telegramLink={telegramLink} />
    </>
  );
}
