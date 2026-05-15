import { Metadata } from "next";
import LoginPage from "./LoginClient";

export const metadata: Metadata = {
  title: "Login | Wingo Signal - Best Wingo Tool & Predictor",
  description: "Login to access premium Wingo signals, mods, and prediction tools. High accuracy Wingo predictor for big, small, and number predictions.",
  keywords: [
    "wingo login", "wingo signal login", "wingo tool login", "wingo mod apk", 
    "big small mod hack", "wingo number mod", "wingo server login"
  ],
};



export default function Home() {
  return <LoginPage />;
}




