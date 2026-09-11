import Link from 'next/link';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import PageHero from '@/components/site/PageHero';
import Lines from '@/components/site/Lines';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { ABOUT, CONDITIONS, CTA, TEAM, TEAM_ROLES, WARRANTY_MONTHS } from '@/lib/site';

export const metadata: Metadata = {
  title: 'О компании',
  description:
    'Эклиптика: строительная компания полного цикла в Москве и Московской области. Кто ведёт объект, какие условия фиксируются в договоре.',
  alternates: { canonical: '/about' },
};

const idx = (i: number) => ({ '--i': i }) as CSSProperties;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: '/' }, { name: 'О компании', path: '/about' }])} />
      <PageHero crumbs={[{ label: 'О компании' }]} title={['Одна организация', 'на весь цикл работ']} intro={ABOUT.statement} />

      <section className="v1-w v1-state" aria-label="Команда">
        <p className="v1-facts" data-reveal="fade" style={{ marginTop: 0 }}>
          Команда работает с <em>{TEAM.since}</em> года, на её счету более <em>{TEAM.objects}</em> объектов.
          Гарантия по договору <em>{WARRANTY_MONTHS}</em> месяцев.
        </p>
        <p className="v1-note" data-reveal="fade" style={idx(1)}>{ABOUT.origin}</p>
      </section>

      <section className="v1-w v1-sec">
        <div className="v1-split">
          <div className="v1-sticky">
            <Lines lines={['Кто ведёт', 'объект']} className="v1-h2" />
            <p className="v1-lead" style={{ marginTop: 28 }}>{ABOUT.roleNote}</p>
          </div>
          <div className="v1-cells">
            {TEAM_ROLES.map((r, i) => (
              <article key={r.role} data-reveal="fade" style={idx(i % 2)}>
                <span className="v1-num">0{i + 1}</span>
                <h3>{r.role}</h3>
                <p style={{ color: 'var(--gold)', marginBottom: 8 }}>{r.when}</p>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v1-w v1-sec">
        <Lines lines={['Условия договора']} className="v1-h2" />
        <div className="v1-cells" style={{ marginTop: 'clamp(40px,5vw,64px)' }}>
          {CONDITIONS.map((c, i) => (
            <article key={c.title} data-reveal="fade" style={idx(i % 2)}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="v1-w v1-sec v1-cta">
        <Lines lines={['Обсудим', 'ваш объект']} className="v1-h2" />
        <Link className="v1-pill" href="/contacts">{CTA}<i aria-hidden="true">↗</i></Link>
      </section>
    </>
  );
}
