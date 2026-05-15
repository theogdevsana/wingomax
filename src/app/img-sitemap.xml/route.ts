import { BLOG_POSTS } from '@/lib/blogs';

export async function GET() {
  const baseUrl = 'https://wingosignals.xyz';
  
  // 1. Collect all games for duner and logo
  const games = [
    '82_lottery', '91club', 'bdg_win', 'bgd_game', 'goa_game', 
    'jai_club', 'jalwa', 'raja_game', 'sikkim', 'tashan_win', 
    'tiranga', 'yarr_win'
  ];

  // 2. Collect all SVGs/PNGs from svg/png
  const svgPngs = [
    'best-wingo-strategy.png', 'buy-wingo-signals-license.png', 
    'draw_result_bg.svg', 'first_num_bg.svg', 'how-to-use-wingo-signals.png',
    'lottery_type_bg.svg', 'time_bg.svg', 'wingo-signals-banner.png',
    'wingo_circle.svg', 'wingo_circle_1m.svg'
  ];

  // Map to the required structure
  const gameImages = games.flatMap(game => [
    { url: `${baseUrl}/duner/${game}.png`, title: `${game.replace(/_/g, ' ')} Game Icon` },
    { url: `${baseUrl}/logo/${game}.png`, title: `${game.replace(/_/g, ' ')} Brand Logo` }
  ]);

  const uiImages = svgPngs.map(img => ({
    url: `${baseUrl}/svg/png/${img}`,
    title: img.split('.')[0].replace(/-/g, ' ').replace(/_/g, ' ')
  }));

  const numberImages = Array.from({ length: 10 }, (_, i) => ({
    url: `${baseUrl}/svg/numbers/${i}.svg`,
    title: `Wingo Result Number ${i}`
  }));

  const grayNumberImages = Array.from({ length: 10 }, (_, i) => ({
    url: `${baseUrl}/svg/gray/${i}_gray.svg`,
    title: `Previous Wingo Result Number ${i}`
  }));

  // Combine all into the root location
  const homeImages = [
    ...gameImages,
    ...uiImages,
    ...numberImages,
    ...grayNumberImages
  ];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/</loc>
    ${homeImages.map(img => `
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${img.title.replace(/&/g, '&amp;')}</image:title>
    </image:image>`).join('')}
  </url>
  ${BLOG_POSTS.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <image:image>
      <image:loc>${baseUrl}${post.image}</image:loc>
      <image:title>${(post.imageAlt || post.title).replace(/&/g, '&amp;')}</image:title>
    </image:image>
  </url>`).join('')}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
