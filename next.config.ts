import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
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
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    qualities: [60, 75, 95, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

};


export default nextConfig;

