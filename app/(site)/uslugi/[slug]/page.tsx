import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PageHero from '@/components/site/PageHero';
import Lines from '@/components/site/Lines';
import Faq from '@/components/site/Faq';
import ProjectCard from '@/components/site/ProjectCard';
import { getProjects } from '@/lib/content';
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { CTA, OBJECT_TYPES, SITE, WARRANTY_MONTHS, getObjectType } from '@/lib/site';

export const revalidate = 600;
export const dynamicParams = false;

export function generateStaticParams() {
  return OBJECT_TYPES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const t = getObjectType(slug);
  if (!t) return {};
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: `/uslugi/${t.slug}` },
    openGraph: { title: t.metaTitle, description: t.metaDescription, images: [`/img/${t.photo}`] },
  };
}

const START = [
  'Присылаете задание, план помещения или ссылку на закупку',
  'Выезжаем на объект и выполняем обмеры',
  'Готовим смету по позициям и график работ',
  'Подписываем договор с датой сдачи',
];

const idx = (i: number) => ({ '--i': i }) as CSSProperties;

export default async function ObjectTypePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const type = getObjectType(slug);
  if (!type) notFound();

  const others = OBJECT_TYPES.filter((t) => t.slug !== type.slug);
  const cases = (await getProjects()).filter((p) => type.caseSlugs.includes(p.slug));
  const briefHref = `/contacts?brief=${encodeURIComponent(`Направление: ${type.title}`)}`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: '/' }, { name: type.title, path: `/uslugi/${type.slug}` }])} />
      <JsonLd data={faqJsonLd(type.faq)} />

      <PageHero crumbs={[{ label: type.title }]} title={type.title} intro={type.lead} image={`/img/${type.photo}`}>
        <dl className="v1-ph-meta" data-reveal="fade" style={idx(2)}>
          <div><dt>Основание</dt><dd>{type.law}</dd></div>
          <div><dt>Ориентир по срокам</dt><dd>{type.term}</dd></div>
          <div><dt>Гарантия</dt><dd>{WARRANTY_MONTHS} месяцев</dd></div>
        </dl>
      </PageHero>

      <section className="v1-w v1-sec">
        <div className="v1-split">
          <div className="v1-sticky">
            <Lines lines={['Состав работ']} className="v1-h2" />
            <aside className="v1-aside" style={{ marginTop: 40 }}>
              <p className="v1-num">Как начинаем</p>
              <ol>
                {START.map((s, i) => <li key={s}><b>0{i + 1}</b><span>{s}</span></li>)}
              </ol>
              <Link className="v1-pill" href={briefHref}>{CTA}<i aria-hidden="true">↗</i></Link>
              <a className="v1-aside-tel" href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
            </aside>
          </div>
          <div className="v1-acc">
            {type.works.map((w, i) => (
              <details key={w.title} open={i === 0}>
                <summary>{w.title}</summary>
                <p>{w.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="v1-w v1-sec">
        <Lines lines={['Из чего складывается', 'смета']} className="v1-h2" />
        <p className="v1-lead" style={{ marginTop: 28 }}>
          Цену за квадратный метр по телефону назвать нельзя. Стоимость определяют эти факторы,
          поэтому смету считаем после обмеров.
        </p>
        <div className="v1-cells" style={{ marginTop: 'clamp(40px,5vw,64px)' }}>
          {type.costDrivers.map((d, i) => (
            <article key={d.title} data-reveal="fade" style={idx(i % 2)}>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="v1-w v1-sec">
        <Lines lines={['Порядок и сроки']} className="v1-h2" />
        <p className="v1-lead" style={{ marginTop: 28 }}>
          Ориентир по этапам. Точные даты считаются по объекту и фиксируются в графике
          производства работ, который идёт приложением к договору.
        </p>
        <ol className="v1-rows" style={{ marginTop: 'clamp(40px,5vw,64px)' }}>
          {type.phases.map((p, i) => (
            <li key={p.title} data-reveal="fade">
              <span className="v1-rows-n">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <span className="v1-dur">{p.duration}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="v1-w v1-sec">
        <Lines lines={['Что учитываем', 'на таких объектах']} className="v1-h2" />
        <div className="v1-cells is-3" style={{ marginTop: 'clamp(40px,5vw,64px)' }}>
          {type.specifics.map((s, i) => (
            <article key={s.title} data-reveal="fade" style={idx(i)}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="v1-w v1-sec">
        <div className="v1-split">
          <div className="v1-sticky">
            <Lines lines={['Что чаще всего', 'идёт не так']} className="v1-h2" />
            <p className="v1-lead" style={{ marginTop: 28 }}>
              Проверяем эти ситуации до подписания договора: согласовать решение заранее
              дешевле, чем переделывать смонтированное.
            </p>
          </div>
          <div className="v1-cells" style={{ gridTemplateColumns: '1fr' }}>
            {type.risks.map((r, i) => (
              <article key={r.title} data-reveal="fade">
                <span className="v1-num">0{i + 1}</span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v1-w v1-sec">
        <div className="v1-split">
          <div>
            <Lines lines={['Нормы']} className="v1-h2" />
            <p className="v1-lead" style={{ marginTop: 28 }}>
              Основные своды правил для объектов этого типа. Полный перечень зависит от назначения
              помещений и уточняется на этапе проектирования.
            </p>
          </div>
          <table className="v1-table" data-reveal="fade">
            <tbody>
              {type.norms.map((n) => (
                <tr key={n.doc}><th scope="row">{n.doc}</th><td>{n.about}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {cases.length > 0 && (
        <section className="v1-w v1-sec">
          <div className="v1-objs-head">
            <Lines lines={[cases.every((c) => c.example) ? 'Пример объекта' : 'Объекты']} className="v1-h2" />
            <Link className="v1-link" href="/portfolio">Все объекты <span aria-hidden="true">→</span></Link>
          </div>
          <div className="v1-grid">
            {cases.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </section>
      )}

      <section className="v1-w v1-sec v1-faq">
        <div>
          <Lines lines={['Вопросы']} className="v1-h2" />
        </div>
        <Faq items={type.faq} />
      </section>

      <section className="v1-w v1-sec">
        <Lines lines={['Другие направления']} className="v1-h2" />
        <nav className="v1-links" style={{ marginTop: 'clamp(40px,5vw,64px)' }} aria-label="Другие направления">
          {others.map((o) => (
            <Link key={o.slug} href={`/uslugi/${o.slug}`}>{o.title}<i aria-hidden="true">↗</i></Link>
          ))}
        </nav>
      </section>

      <section className="v1-w v1-sec v1-cta">
        <Lines lines={['Обсудим', 'ваш объект']} className="v1-h2" />
        <Link className="v1-pill" href={briefHref}>{CTA}<i aria-hidden="true">↗</i></Link>
      </section>
    </>
  );
}
