import type { Metadata } from "next";
import FreefireRewardsClient from "./FreefireRewardsClient";

export const metadata: Metadata = {
  title: "Rewards Utility",
  description: "Private rewards utility page.",
  robots: { index: false, follow: false },
};

export default function FreefireRewardsPage() {
  return <FreefireRewardsClient />;
}
