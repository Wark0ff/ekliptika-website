import type { MetadataRoute } from 'next';
import { SITE, OBJECT_TYPES } from '@/lib/site';
import { getPosts, getProjects } from '@/lib/content';
import { FALLBACK_IMAGE, coverOf } from '@/lib/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  const routes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/portfolio`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/smeta`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE.url}/documents`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE.url}/contacts`, lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const directions: MetadataRoute.Sitemap = OBJECT_TYPES.map((t) => ({
    url: `${SITE.url}/uslugi/${t.slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.9,
  }));

  // Примеры объектов со стоковыми фото закрыты от индексации и в карту не входят.
  const cases: MetadataRoute.Sitemap = projects.filter((p) => !p.example).map((p) => ({
    url: `${SITE.url}/portfolio/${p.slug}`, lastModified: now, changeFrequency: 'yearly', priority: 0.7,
    images: [`${SITE.url}${coverOf(p)}`],
  }));

  const articles: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE.url}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: 'yearly', priority: 0.6,
    images: [`${SITE.url}${p.cover || FALLBACK_IMAGE}`],
  }));

  return [...routes, ...directions, ...cases, ...articles];
}
