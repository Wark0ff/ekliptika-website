import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Lines from '@/components/site/Lines';
import { getPost, getPosts } from '@/lib/content';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { CTA, SITE } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.excerpt, publishedTime: post.date, images: [{ url: post.cover }] },
  };
}

const fmt = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  const others = (await getPosts()).filter((p) => p.slug !== post.slug);
  const related = [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category).sort((a, b) => +new Date(b.date) - +new Date(a.date)),
  ].slice(0, 3);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: `${SITE.url}${post.cover}`,
    author: { '@type': 'Organization', name: SITE.brandFull },
    publisher: { '@type': 'Organization', name: SITE.brandFull },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <article>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Главная', path: '/' },
        { name: 'Статьи', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` },
      ])} />

      <header className="v1-art-hero">
        <Image src={post.cover} alt="" fill priority sizes="100vw" />
        <div className="v1-w">
          <Link className="v1-back" href="/blog"><span aria-hidden="true">←</span> Все статьи</Link>
          <p className="v1-art-meta">{post.category} / {fmt(post.date)} / {post.readingTime}</p>
          <Lines as="h1" lines={[post.title]} className="v1-art-h" />
        </div>
      </header>

      <div className="v1-prose">
        <p className="v1-prose-lead">{post.excerpt}</p>
        {post.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>

      <section className="v1-w v1-sec v1-cta">
        <Lines lines={['Нужна смета', 'по вашему объекту?']} className="v1-h2" />
        <Link className="v1-pill" href="/contacts">{CTA}<i aria-hidden="true">↗</i></Link>
      </section>

      {related.length > 0 && (
        <section className="v1-w v1-sec">
          <Lines lines={['Читайте также']} className="v1-h2" />
          <div className="v1-posts">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="v1-post-row">
                <time dateTime={p.date}>{fmt(p.date)}</time>
                <h3>{p.title}</h3>
                <i aria-hidden="true">↗</i>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
