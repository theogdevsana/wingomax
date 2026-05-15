import type { Metadata } from "next";

import "./globals.css";

import { nunito } from "@/lib/fonts";


export const metadata: Metadata = {
  metadataBase: new URL('https://wingosignal.com'),
  title: {
    default: "Wingo Signal - Professional Game Predictor & Tools",
    template: "%s | Wingo Signal"
  },
  description: "Advanced Wingo Signal platform providing premium prediction tools, Wingo mod APKs, big small mod, and real-time winning signals for all major platforms.",
  keywords: [
    "wingo tools", "wingo tool", "wingo predictor", "wingo signal", 
    "wingo mod", "big small mod", "number mod", "wingo hack", 
    "color prediction tool", "wingo premium signal"
  ],
  authors: [{ name: "Codersrs" }],
  creator: "Codersrs",
  publisher: "Wingo Signal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wingosignal.com',
    siteName: 'Wingo Signal',
    title: 'Wingo Signal - Professional Game Predictor',
    description: 'Advanced Wingo Signal platform providing premium prediction tools and real-time signals.',
    images: [
      {
        url: '/duner/main_logo.png',
        width: 1200,
        height: 630,
        alt: 'Wingo Signal Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wingo Signal - Professional Game Predictor',
    description: 'Advanced Wingo Signal platform providing premium prediction tools and real-time signals.',
    images: ['/duner/main_logo.png'],
    creator: '@enzosrs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'theme-color': '#007AFF',
  },
};

import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} h-full antialiased`}
    >
      <head>
        <JsonLd telegramLink="https://t.me/enzosrs" />
        {/* Preload critical assets */}
        <link rel="preload" href="/duner/main_logo.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>

      <body className="h-full flex flex-col font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

