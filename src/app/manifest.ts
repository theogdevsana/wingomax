import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wingo Signal - Premium Prediction Tool',
    short_name: 'WingoSignal',
    description: 'Advanced Wingo Signal platform providing premium prediction tools and real-time signals.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#007AFF',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
