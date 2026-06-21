export async function GET() {
  const baseUrl = 'https://wingosignals.com';
  
  const pages = [
    '',
    '/about',
    '/faq',
    '/privacy',
    '/refund',
    '/terms',
    '/subscribe',
  ];

  const urls = pages.map(p => `
  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>2026-06-21</lastmod>
    <changefreq>${p === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p === '' ? '1.0' : '0.7'}</priority>
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
