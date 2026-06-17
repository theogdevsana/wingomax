import type { Metadata } from "next";

import "./globals.css";

import { nunito } from "@/lib/fonts";


export const metadata: Metadata = {
  metadataBase: new URL('https://wingosignals.com'),
  title: {
    default: "Wingo Signal - #1 AI Color Prediction Tool for 91Club & Tiranga 2026",
    template: "%s | Wingo Signal"
  },
  description: "Official Wingo Signal AI color prediction tool for 91Club, Tiranga, BDG Win & 10+ platforms. Get 95%+ accurate 1-min, 3-min & 5-min signals — no download needed. Trusted by 50,000+ users.",
  keywords: [
    "wingo signal", "wingo prediction", "color prediction tool",
    "91club prediction", "tiranga prediction tool", "wingo signals telegram",
    "wingo mod apk", "wingo color prediction formula", "wingo big small pattern",
    "wingo predictor app download"
  ],
  authors: [{ name: "Wingo Signal Team" }],
  creator: "Wingo Signal",
  publisher: "Wingo Signal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=3', sizes: 'any' },
      { url: '/favicon-32x32.png?v=3', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=3',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wingosignals.com',
    siteName: 'Wingo Signal',
    title: 'Wingo Signal - Professional Game Predictor',
    description: 'Advanced Wingo Signal platform providing premium prediction tools and real-time signals.',
    images: [
      {
        url: '/logo/official-logo.png',
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
    images: ['/logo/official-logo.png'],
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
    canonical: 'https://wingosignals.com',
    types: {
      'application/rss+xml': 'https://wingosignals.com/rss.xml',
    },
  },
  other: {
    'theme-color': '#007AFF',
  },
};

import { OrganizationSchema } from "@/components/JsonLd";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { query } from '@/lib/db';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let telegramLink = "https://t.me/enzosrs";
  try {
    const result = await query('SELECT telegram_link FROM settings LIMIT 1');
    telegramLink = result.rows.length > 0 ? result.rows[0].telegram_link : "https://t.me/enzosrs";
  } catch {}

  return (
    <html
      lang="en"
      className={`${nunito.variable} antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <OrganizationSchema telegramLink={telegramLink} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* PWA Manifest & Meta Tags */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wingo Signal" />
      </head>

      <body className="flex flex-col font-sans">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-LVMJXEXXFH" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LVMJXEXXFH');
          `,
        }} />
        <Script id="sw-reg" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/pwabuilder-sw.js');
              });
            }
          `,
        }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

