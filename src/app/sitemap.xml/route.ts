export async function GET() {
  const baseUrl = 'https://wingosignals.xyz';

  const sitemaps = [
    `${baseUrl}/page-sitemap.xml`,
    `${baseUrl}/blog-sitemap.xml`,
    `${baseUrl}/img-sitemap.xml`,
    `${baseUrl}/rss.xml`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(url => `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
