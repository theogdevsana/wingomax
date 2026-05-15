import { BLOG_POSTS } from '@/lib/blogs';

export async function GET() {
  const baseUrl = 'https://wingosignals.xyz';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${BLOG_POSTS.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
