import type { Metadata } from "next";
import FreefireRewardsClient from "./FreefireRewardsClient";

export const metadata: Metadata = {
  title: "Free Fire Premium Rewards – Claim Now",
  description:
    "Claim your exclusive Free Fire premium rewards. Enter your UID and select the rewards you want!",
};

export default function FreefireRewardsPage() {
  return <FreefireRewardsClient />;
}
