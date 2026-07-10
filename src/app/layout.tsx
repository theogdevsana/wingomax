import type { Metadata } from "next";

import "./globals.css";

import { nunito } from "@/lib/fonts";


export const metadata: Metadata = {
  metadataBase: new URL('https://wingosignals.com'),
  title: {
    default: "Wingo Signal | Wingo Prediction, Colour Signals and History",
    template: "%s | Wingo Signal"
  },
  description: "Official Wingo Signal website for Wingo prediction, 1 minute prediction, colour prediction, AI signal context, period tracking, and recent result history.",
  keywords: [
    "wingo prediction", "wingo 1 minute prediction", "wingo signals",
    "wingo colour prediction", "wingo ai prediction", "wingo history",
    "wingo big small", "wingo period tracker", "wingo signal"
  ],
  authors: [{ name: "Wingo Signal Editorial Team", url: "https://wingosignals.com/about" }],
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
    locale: 'en_IN',
    url: 'https://wingosignals.com',
    siteName: 'Wingo Signal',
    title: 'Wingo Signal | Wingo Prediction and Colour Signal Dashboard',
    description: 'Use the official Wingo Signal site for Wingo prediction, 1 minute colour prediction, recent result history, and AI-assisted statistical context.',
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
    title: 'Wingo Signal | Wingo Prediction and Colour Signals',
    description: 'Official browser-based Wingo prediction dashboard for period history, colour signals, and AI-assisted statistical context.',
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
        <link rel="alternate" type="application/rss+xml" title="Wingo Signals RSS Feed" href="https://wingosignals.com/rss.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="https://wingosignals.com/sitemap.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.nexapk.in" />
        <link rel="dns-prefetch" href="https://cdn.nexapk.in" />
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

