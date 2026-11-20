import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waffer.jo';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/sitemap.xml',
          '/robots.txt',
          '/favicon.ico',
          '/og-image.png',
          '/logo.png',
          '/manifest.json'
        ],
        disallow: [
          '/api/',
          '/auth/',
          '/admin',
          '/staff',
          '/dashboard',
          '/*private*',
          '/*reservation*',
          '/*complaint*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/',
          '/admin',
          '/staff',
          '/dashboard'
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/og-image.png', '/logo.png', '/favicon.ico'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
