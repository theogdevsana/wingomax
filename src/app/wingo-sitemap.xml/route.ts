export async function GET() {
  const baseUrl = 'https://wingosignals.com';
  const pages = [
    'wingo-1-minute-prediction',
    'wingo-3-minute-prediction',
    'wingo-5-minute-prediction',
    'wingo-30-seconds-prediction'
  ];

  const urls = pages.map(p => `
  <url>
    <loc>${baseUrl}/${p}</loc>
    <lastmod>2026-06-21</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
