import { Metadata } from "next";
import LoginPage from "../LoginClient";

export const metadata: Metadata = {
  title: "Sign in | Wingo Signal",
  description: "Sign in to your Wingo Signal account.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

export default function Login() {
  return <LoginPage />;
}
