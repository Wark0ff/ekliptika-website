import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/site/PageHero';
import LeadForm from '@/components/site/LeadForm';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Контакты',
  description:
    'Контакты строительной компании «Эклиптика»: телефон, почта, реквизиты. Заявка на смету и коммерческое предложение в течение 24 часов.',
  alternates: { canonical: '/contacts' },
};

export default async function ContactsPage(props: { searchParams: Promise<{ brief?: string; sent?: string }> }) {
  const { brief, sent } = await props.searchParams;
  const r = SITE.requisites;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: '/' }, { name: 'Контакты', path: '/contacts' }])} />
      <PageHero
        crumbs={[{ label: 'Контакты' }]}
        title="Контакты"
        intro="Опишите задачу: тип объекта, площадь, адрес и желаемый срок. Коммерческое предложение направим в течение 24 часов."
      />
      <section className="v1-w v1-sec">
        <div className="v1-ask-grid is-form-first" style={{ marginTop: 0 }}>
          <div>
            <dl className="v1-contacts">
              <div><dt>Телефон</dt><dd><a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a></dd></div>
              <div><dt>Почта</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
              <div><dt>Режим работы</dt><dd>{SITE.workHours}</dd></div>
              <div><dt>Регион работ</dt><dd>{SITE.region}</dd></div>
            </dl>
            <table className="v1-table" style={{ marginTop: 48 }}>
              <tbody>
                <tr><th scope="row">Организация</th><td>{r.legalName}</td></tr>
                <tr><th scope="row">ИНН / КПП</th><td>{r.inn} / {r.kpp}</td></tr>
                <tr><th scope="row">ОГРН</th><td>{r.ogrn}</td></tr>
              </tbody>
            </table>
            <Link className="v1-link" href="/company-card" style={{ marginTop: 24 }}>
              Карточка предприятия <span aria-hidden="true">→</span>
            </Link>
          </div>
          {sent === '1' ? (
            <div className="rq rq-done" role="status">
              <p className="rq-done-t">Заявка отправлена</p>
              <p>Свяжемся с вами в течение рабочего дня. Коммерческое предложение направим в течение 24 часов.</p>
            </div>
          ) : (
            <LeadForm id="contacts" defaultBrief={brief} />
          )}
        </div>
      </section>
    </>
  );
}
