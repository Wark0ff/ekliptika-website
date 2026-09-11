import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Lines from '@/components/site/Lines';
import { getProjectBySlug, getProjects } from '@/lib/content';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { CTA, type Project } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getProjectBySlug(slug);
  if (!p) return {};
  return {
    title: p.example ? `Пример: ${p.title}` : p.title,
    description: p.summary,
    alternates: { canonical: `/portfolio/${p.slug}` },
    // Примеры со стоковыми фото не индексируем: это не реализованные объекты.
    robots: p.example ? { index: false, follow: true } : undefined,
    openGraph: { title: p.title, description: p.summary, images: [p.photos[0]] },
  };
}

const lawLabel = (law: Project['law']) => (law === 'Коммерческий' ? 'Договор подряда' : law);
const idx = (i: number) => ({ '--i': i }) as CSSProperties;

export default async function CasePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length > 1 ? projects[(i + 1) % projects.length] : null;

  const meta: [string, string][] = [
    ['Заказчик', project.customer],
    ['Площадь', project.area],
    ['Срок', project.term],
    [project.budgetLabel, project.budget],
    ['Основание', lawLabel(project.law)],
    ['Место', project.location],
    ...(!project.example ? ([['Статус', project.status], ['Год', String(project.year)]] as [string, string][]) : []),
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Главная', path: '/' },
        { name: 'Объекты', path: '/portfolio' },
        { name: project.title, path: `/portfolio/${project.slug}` },
      ])} />

      <section className="v1-case-hero">
        <Image src={project.photos[0]} alt={project.example ? '' : project.title} fill priority sizes="100vw" />
        <div className="v1-w">
          <Link className="v1-back" href="/portfolio"><span aria-hidden="true">←</span> Все объекты</Link>
          {project.example && (
            <p><span className="v1-warn">Пример объекта: фотографии иллюстративные, параметры типовые</span></p>
          )}
          <p className="v1-pc-cat" style={{ marginTop: 24 }}>{project.category}</p>
          <Lines as="h1" lines={[project.short]} className="v1-ph-h" />
          <p className="v1-ph-intro" data-reveal="fade">{project.summary}</p>
          <dl className="v1-ph-meta" data-reveal="fade" style={idx(1)}>
            {meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="v1-w v1-sec">
        <div className="v1-split">
          <div>
            <Lines lines={['Задача']} className="v1-h2" />
            <div className="v1-cells" style={{ gridTemplateColumns: '1fr', marginTop: 40 }}>
              {project.task.map((t, n) => (
                <article key={t} data-reveal="fade" style={idx(n)}>
                  <span className="v1-num">0{n + 1}</span>
                  <p style={{ color: 'var(--tx)', fontSize: 18 }}>{t}</p>
                </article>
              ))}
            </div>
            <p className="v1-lead" style={{ marginTop: 32 }}>{project.context}</p>
          </div>
          <figure className="v1-figure" data-reveal="img">
            <Image src={project.photos[1] ?? project.photos[0]} alt="" fill sizes="(max-width:900px) 100vw, 50vw" />
          </figure>
        </div>
      </section>

      <section className="v1-w v1-sec">
        <Lines lines={['Этапы работ']} className="v1-h2" />
        <ol className="v1-rows" style={{ marginTop: 'clamp(40px,5vw,64px)' }}>
          {project.stages.map((s, n) => (
            <li key={s.title} data-reveal="fade">
              <span className="v1-rows-n">0{n + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span className="v1-dur">{s.label}</span>
            </li>
          ))}
        </ol>
      </section>

      {project.photos.length > 2 && (
        <section className="v1-w v1-sec">
          <Lines lines={['Фотографии']} className="v1-h2" />
          <div className="v1-gallery" style={{ marginTop: 'clamp(40px,5vw,64px)' }}>
            {project.photos.slice(2).map((src, n) => (
              <figure key={src} data-reveal="fade" style={idx(n % 3)}>
                <Image src={src} alt="" fill sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw" />
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="v1-w v1-sec">
        <div className="v1-split">
          <div>
            <Lines lines={['Результат']} className="v1-h2" />
            <p className="v1-lead" style={{ marginTop: 28 }}>{project.result}</p>
            <Link className="v1-pill" href="/contacts" style={{ marginTop: 36 }}>{CTA}<i aria-hidden="true">↗</i></Link>
          </div>
          <dl className="v1-kpi" data-reveal="fade">
            {project.kpi.map((k) => (
              <div key={k.label}>
                <dt>{k.label}</dt>
                <dd>
                  {k.prefix}
                  {k.value.toLocaleString('ru-RU', { maximumFractionDigits: k.decimals ?? 0 })}
                  {k.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {next && (
        <Link className="v1-next" href={`/portfolio/${next.slug}`}>
          <Image src={next.photos[0]} alt="" fill sizes="100vw" />
          <div className="v1-w">
            <p className="v1-num">Следующий объект</p>
            <p className="v1-h2" style={{ marginTop: 16 }}>{next.short}</p>
          </div>
        </Link>
      )}
    </>
  );
}
