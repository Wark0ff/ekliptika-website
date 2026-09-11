import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/brand';

/** До запуска на боевом домене сайт закрыт от поисковиков. Открывается переменной NEXT_PUBLIC_INDEX=1. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_INDEX !== '1') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
