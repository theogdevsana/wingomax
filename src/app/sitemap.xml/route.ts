import { getAllBlogPosts } from '@/lib/blog-data';

export const dynamic = 'force-dynamic';

function toDateStr(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '2026-06-21';
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const baseUrl = 'https://wingosignals.com';

  let blogPosts: { slug: string; date: string }[] = [];
  try {
    blogPosts = await getAllBlogPosts();
  } catch {}

  const pages = [
    { loc: '', lastmod: '2026-06-21', freq: 'weekly', priority: '1.0' },
    { loc: '/about', lastmod: '2026-06-21', freq: 'monthly', priority: '0.7' },
    { loc: '/faq', lastmod: '2026-06-21', freq: 'monthly', priority: '0.7' },
    { loc: '/privacy', lastmod: '2026-06-21', freq: 'monthly', priority: '0.5' },
    { loc: '/refund', lastmod: '2026-06-21', freq: 'monthly', priority: '0.5' },
    { loc: '/terms', lastmod: '2026-06-21', freq: 'monthly', priority: '0.5' },
    { loc: '/subscribe', lastmod: '2026-06-21', freq: 'monthly', priority: '0.6' },
    { loc: '/wingo-30-seconds-prediction', lastmod: '2026-06-21', freq: 'weekly', priority: '0.9' },
    { loc: '/wingo-1-minute-prediction', lastmod: '2026-06-21', freq: 'weekly', priority: '0.9' },
    { loc: '/wingo-3-minute-prediction', lastmod: '2026-06-21', freq: 'weekly', priority: '0.9' },
    { loc: '/wingo-5-minute-prediction', lastmod: '2026-06-21', freq: 'weekly', priority: '0.9' },
  ];

  const blogUrls = blogPosts.map(p => `
    <url>
      <loc>${baseUrl}/blog/${p.slug}</loc>
      <lastmod>${toDateStr(p.date)}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>`).join('');

  const pageUrls = pages.map(p => `
    <url>
      <loc>${baseUrl}${p.loc}</loc>
      <lastmod>${p.lastmod}</lastmod>
      <changefreq>${p.freq}</changefreq>
      <priority>${p.priority}</priority>
    </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pageUrls}
  ${blogUrls}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
