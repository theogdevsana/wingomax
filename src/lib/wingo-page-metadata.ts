import type { Metadata } from 'next';

type WingoMetadataInput = { title: string; description: string; path: string; keywords: string[] };

export function createWingoMetadata({ title, description, path, keywords }: WingoMetadataInput): Metadata {
  const url = `https://wingosignals.com${path}`;
  return { title, description, keywords, alternates: { canonical: url }, robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }, openGraph: { type: 'website', locale: 'en_IN', url, siteName: 'Wingo Signal', title, description, images: [{ url: 'https://wingosignals.com/logo/official-logo.png', width: 512, height: 512, alt: 'Wingo Signal' }] }, twitter: { card: 'summary_large_image', title, description, images: ['https://wingosignals.com/logo/official-logo.png'] } };
}