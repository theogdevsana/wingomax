import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard | Wingo Signal",
  description: "Select your favorite game to get real-time signals.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
