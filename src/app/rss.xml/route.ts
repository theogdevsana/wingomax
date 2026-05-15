import { BLOG_POSTS } from '@/lib/blogs';

export async function GET() {
  const baseUrl = 'https://wingosignals.xyz';
  
  const items = BLOG_POSTS.map(post => `
    <item>
      <title>${post.title.replace(/&/g, '&amp;')}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${post.description.replace(/&/g, '&amp;')}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <enclosure url="${baseUrl}${post.image}" length="0" type="image/png" />
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2004/atom">
  <channel>
    <title>Wingo Signal - Prediction Tips &amp; Guides</title>
    <link>${baseUrl}</link>
    <description>Stay updated with the latest Wingo prediction strategies, AI signals, and gaming tutorials.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
