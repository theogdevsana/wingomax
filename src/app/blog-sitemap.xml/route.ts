import { getAllBlogPosts } from '@/lib/blog-data';
import type { BlogPost } from '@/lib/blogs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://wingosignals.com';
  let BLOG_POSTS: BlogPost[];
  try {
    BLOG_POSTS = await getAllBlogPosts();
  } catch {
    BLOG_POSTS = [];
  }

  const urls = BLOG_POSTS.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>2026-06-21</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  ${urls}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
