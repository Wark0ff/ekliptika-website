import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.brandFull,
    short_name: SITE.brand,
    description: SITE.descriptionShort,
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0F1E',
    theme_color: '#0A0F1E',
    lang: 'ru',
    categories: ['business', 'construction'],
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
