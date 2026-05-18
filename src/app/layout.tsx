import type { Metadata } from "next";

import "./globals.css";

import { nunito } from "@/lib/fonts";


export const metadata: Metadata = {
  metadataBase: new URL('https://wingosignals.xyz'),
  title: {
    default: "Wingo Signal - #1 WinGo Prediction & Color Prediction Tool 2024",
    template: "%s | Wingo Signal"
  },
  description: "Official Wingo Signal tool for 1-minute, 3-minute, and 5-minute prediction. Get accurate color and number predictions for Wingo with 95% accuracy.",
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
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wingosignals.xyz',
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
    canonical: 'https://wingosignals.xyz',
    types: {
      'application/rss+xml': 'https://wingosignals.xyz/rss.xml',
    },
  },
  other: {
    'theme-color': '#007AFF',
  },
};

import { OrganizationSchema } from "@/components/JsonLd";
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
      data-scroll-behavior="smooth"
    >
      <head>
        <OrganizationSchema telegramLink="https://t.me/enzosrs" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* PWA Manifest & Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wingo Signal" />
        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/pwabuilder-sw.js').then(function(res) {
                    console.log('PWA Service Worker registered successfully: ', res.scope);
                  }).catch(function(err) {
                    console.log('PWA Service Worker registration failed: ', err);
                  });
                });
              }
            `
          }}
        />
      </head>

      <body className="h-full flex flex-col font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

