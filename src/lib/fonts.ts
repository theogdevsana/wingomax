import { Geist, Geist_Mono, Nunito } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
