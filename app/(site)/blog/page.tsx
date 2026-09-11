import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PageHero from '@/components/site/PageHero';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { getPosts } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Статьи',
  description:
    'Разборы для заказчиков: из чего складывается смета, какие скрытые работы проверять, как строится график капитального ремонта.',
  alternates: { canonical: '/blog' },
};

const fmt = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function BlogPage() {
  const posts = [...(await getPosts())].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const [featured, ...rest] = posts;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: '/' }, { name: 'Статьи', path: '/blog' }])} />
      <PageHero
        crumbs={[{ label: 'Статьи' }]}
        title="Статьи"
        intro="Разборы для заказчиков: сметы, скрытые работы, сроки капитального ремонта и порядок приёмки."
      />

      <section className="v1-w v1-sec">
        {!featured && <p className="v1-lead">Статьи появятся здесь в ближайшее время.</p>}
        {featured && (
          <Link className="v1-feature" href={`/blog/${featured.slug}`} data-reveal="fade">
            <div className="v1-pc-img">
              <Image src={featured.cover} alt="" fill priority sizes="(max-width:900px) 100vw, 58vw" />
            </div>
            <div>
              <p className="v1-pc-cat">{featured.category}, {fmt(featured.date)}</p>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="v1-link" style={{ marginTop: 26 }}>Читать <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        )}
        {rest.length > 0 && (
          <div className="v1-posts" style={{ marginTop: 'clamp(56px,7vw,100px)' }}>
            {rest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="v1-post-row">
                <time dateTime={p.date}>{fmt(p.date)}</time>
                <h3>{p.title}</h3>
                <i aria-hidden="true">↗</i>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
