export async function GET() {
  const baseUrl = 'https://wingosignals.xyz';
  const pages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/blog', priority: 0.8, changefreq: 'weekly' },
    { url: '/faq', priority: 0.5, changefreq: 'monthly' },
    { url: '/privacy', priority: 0.3, changefreq: 'monthly' },
    { url: '/refund', priority: 0.3, changefreq: 'monthly' },
    { url: '/terms', priority: 0.3, changefreq: 'monthly' },
    { url: '/wingo-30-seconds-prediction', priority: 0.9, changefreq: 'daily' },
    { url: '/wingo-1-minute-prediction', priority: 0.9, changefreq: 'daily' },
    { url: '/wingo-3-minute-prediction', priority: 0.9, changefreq: 'daily' },
    { url: '/wingo-5-minute-prediction', priority: 0.9, changefreq: 'daily' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`).join('')}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
