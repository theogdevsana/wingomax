export async function GET() {
  const baseUrl = 'https://wingosignals.com';
  const pages = [
    { path: 'wingo-1-minute-prediction', priority: '0.98' },
    { path: 'wingo-30-seconds-prediction', priority: '0.94' },
    { path: 'wingo-3-minute-prediction', priority: '0.92' },
    { path: 'wingo-5-minute-prediction', priority: '0.90' }
  ];

  const urls = pages.map((page) => `
  <url>
    <loc>${baseUrl}/${page.path}</loc>
    <lastmod>2026-06-21</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page.priority}</priority>
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
