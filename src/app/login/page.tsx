import { Metadata } from "next";
import LoginPage from "../LoginClient";

export const metadata: Metadata = {
  title: "Login - Wingo Signal | AI Prediction Dashboard",
  description: "Login to Wingo Signal dashboard to access real-time AI predictions for Wingo color prediction games on 91Club, Tiranga, BDG Win and more.",
  keywords: [
    "wingo signal login", "wingo login", "wingo prediction login",
    "91club login", "tiranga prediction login", "bdg win login",
    "wingo dashboard"
  ],
};

export default function Login() {
  return <LoginPage />;
}
