import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wingo Signal - Premium Prediction Tool',
    short_name: 'WingoSignal',
    description: 'Advanced Wingo Signal platform providing premium prediction tools and real-time signals.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    dir: 'ltr',
    lang: 'en-US',
    categories: ['games', 'entertainment', 'utilities'],
    background_color: '#FFFFFF',
    theme_color: '#007AFF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Wingo Predictor',
        short_name: 'Predictor',
        description: 'Open the Wingo Predictor Tool directly',
        url: '/dashboard/wingo',
        icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192' }]
      }
    ],
    screenshots: [
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Wingo Signal Prediction Tool Wide'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Wingo Signal Prediction Tool Mobile'
      }
    ]
  };
}
