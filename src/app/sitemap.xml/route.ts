export async function GET() {
  const baseUrl = 'https://wingosignal.com';

  const sitemaps = [
    `${baseUrl}/page-sitemap.xml`,
    `${baseUrl}/blog-sitemap.xml`,
    `${baseUrl}/sitemap-image.xml`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(url => `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
