import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://wingosignals.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/v1/', '/dashboard/', '/login', '/free-fire-rewards'],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-static.xml`,
      `${baseUrl}/blog-sitemap.xml`,
      `${baseUrl}/wingo-sitemap.xml`,
      `${baseUrl}/img-sitemap.xml`,
    ],
  };
}
