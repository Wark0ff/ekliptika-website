import Link from 'next/link';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import PageHero from '@/components/site/PageHero';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Документы и реквизиты',
  description: 'Документы для проверки контрагента и заключения договора, реквизиты ООО «Эклиптика».',
  alternates: { canonical: '/documents' },
};

/** PENDING: сведения о допусках СРО добавить, когда заказчик их предоставит. */
const DOCS = [
  { title: 'Выписка из ЕГРЮЛ', note: 'Сведения о регистрации организации' },
  { title: 'Устав', note: 'Учредительные документы' },
  { title: 'Решение о назначении директора', note: 'Полномочия лица, подписывающего договор' },
  { title: 'Справка об отсутствии задолженности', note: 'ФНС, свежая на дату запроса' },
  { title: 'Сведения о специалистах', note: 'Опыт и квалификация команды' },
  { title: 'Карточка предприятия', note: 'Реквизиты для договора', href: '/company-card' },
];

const idx = (i: number) => ({ '--i': i }) as CSSProperties;

export default function DocumentsPage() {
  const r = SITE.requisites;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: '/' }, { name: 'Документы', path: '/documents' }])} />
      <PageHero
        crumbs={[{ label: 'Документы' }]}
        title={['Документы', 'и реквизиты']}
        intro="Документы для проверки контрагента и заключения договора. Копии направляем по запросу на почту."
      />
      <section className="v1-w v1-sec">
        <div className="v1-split">
          <div className="v1-cells">
            {DOCS.map((d, i) => (
              <article key={d.title} data-reveal="fade" style={idx(i % 2)}>
                <h3>{d.href ? <Link className="v1-ul" href={d.href}>{d.title}</Link> : d.title}</h3>
                <p>{d.note}</p>
              </article>
            ))}
          </div>
          <aside className="v1-aside v1-sticky">
            <p className="v1-num">Реквизиты</p>
            <table className="v1-table" style={{ margin: '20px 0 28px' }}>
              <tbody>
                <tr><th scope="row">ИНН</th><td>{r.inn}</td></tr>
                <tr><th scope="row">КПП</th><td>{r.kpp}</td></tr>
                <tr><th scope="row">ОГРН</th><td>{r.ogrn}</td></tr>
                <tr><th scope="row">Счёт</th><td>{r.account}</td></tr>
                <tr><th scope="row">Банк</th><td>{r.bank}</td></tr>
                <tr><th scope="row">БИК</th><td>{r.bik}</td></tr>
              </tbody>
            </table>
            <Link className="v1-pill" href="/company-card">Карточка предприятия<i aria-hidden="true">↗</i></Link>
            <a className="v1-aside-tel" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </aside>
        </div>
      </section>
    </>
  );
}
