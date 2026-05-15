import { BLOG_POSTS } from '@/lib/blogs';

export async function GET() {
  const baseUrl = 'https://wingosignals.xyz';
  
  // Collect critical UI and game images
  const games = [
    '82_lottery', '91club', 'bdg_win', 'bgd_game', 'goa_game', 
    'jai_club', 'jalwa', 'raja_game', 'sikkim', 'tashan_win', 
    'tiranga', 'yarr_win'
  ];

  const svgPngs = [
    'best-wingo-strategy.png', 'buy-wingo-signals-license.png', 
    'how-to-use-wingo-signals.png', 'wingo-signals-banner.png',
    'wingo-signals-free-vs-paid-prediction-guide.png'
  ];

  const gameImages = games.flatMap(game => [
    { url: `${baseUrl}/duner/${game}.png`, title: `${game.replace(/_/g, ' ')} Prediction App` },
    { url: `${baseUrl}/logo/${game}.png`, title: `${game.replace(/_/g, ' ')} Platform Logo` }
  ]);

  const uiImages = svgPngs.map(img => ({
    url: `${baseUrl}/svg/png/${img}`,
    title: img.split('.')[0].replace(/-/g, ' ').replace(/_/g, ' ')
  }));

  const combinedImages = [...gameImages, ...uiImages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/</loc>
    ${combinedImages.map(img => `
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${img.title.replace(/&/g, '&amp;')}</image:title>
    </image:image>`).join('').trim()}
  </url>
  ${BLOG_POSTS.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <image:image>
      <image:loc>${baseUrl}${post.image}</image:loc>
      <image:title>${(post.imageAlt || post.title).replace(/&/g, '&amp;')}</image:title>
    </image:image>
  </url>`).join('').trim()}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
