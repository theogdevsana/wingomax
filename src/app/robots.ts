import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://wingosignals.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/v1/', '/dashboard/'],
    },
    sitemap: [
      `${baseUrl}/wingo-sitemap.xml`,
      `${baseUrl}/blog-sitemap.xml`,
      `${baseUrl}/img-sitemap.xml`,
      `${baseUrl}/sitemap-static.xml`,
    ],
  };
}
