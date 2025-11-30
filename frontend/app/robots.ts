import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/savings/*',
          '/profile/*',
          '/passbook',
          '/api/*',
          '/_next/*',
          '/verify-email',
          '/reset-password',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/savings/*',
          '/profile/*',
          '/passbook',
          '/api/*',
          '/_next/*',
          '/verify-email',
          '/reset-password',
        ],
      },
    ],
    sitemap: 'https://alajo.ng/sitemap.xml',
    host: 'https://alajo.ng',
  }
}
