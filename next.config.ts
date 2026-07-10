import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {},
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: '/blog/wingo-signal-free-vs-paid-comparison',
        destination: '/blog/wingo-signal-free-vs-paid',
        permanent: true,
      },
      {
        source: '/blog/about-wingo-signal',
        destination: '/blog/what-is-wingo-signal',
        permanent: true,
      },
      {
        source: '/blog/how-to-purchase-license',
        destination: '/blog/buy-wingo-signal-license',
        permanent: true,
      },
      {
        source: '/blog/wingo-prediction-strategies',
        destination: '/blog/wingo-prediction-tips-for-beginners',
        permanent: true,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
    qualities: [75, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.nexapk.in',
      },
      {
        protocol: 'https',
        hostname: 'app.nexapk.in',
      },
      {
        protocol: 'https',
        hostname: 'dl.dir.freefiremobile.com',
      },
      {
        protocol: 'https',
        hostname: 'kaelis.sh',
      },
    ],
  },
};

export default withPWA(nextConfig);
