import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waffer.jo';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/sync', '/api/auth/callback'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
