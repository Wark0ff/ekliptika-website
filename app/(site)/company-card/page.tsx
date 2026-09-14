import type { Metadata } from 'next';
import PageHero from '@/components/site/PageHero';
import PrintButton from '@/components/site/PrintButton';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Карточка предприятия',
  description: 'Карточка предприятия ООО «Эклиптика»: наименование, ИНН, КПП, ОГРН, банковские реквизиты. Версия для печати и PDF.',
  alternates: { canonical: '/company-card' },
  robots: { index: false, follow: true },
};

export default function CompanyCardPage() {
  const r = SITE.requisites;
  const rows: [string, string][] = [
    ['Полное наименование', r.legalNameFull],
    ['Сокращённое наименование', r.legalName],
    ['ИНН', r.inn],
    ['КПП', r.kpp],
    ['ОГРН', r.ogrn],
    ['Юридический адрес', r.legal],
    ['Расчётный счёт', r.account],
    ['Банк', r.bank],
    ['Корреспондентский счёт', r.corrAccount],
    ['БИК', r.bik],
    ['Генеральный директор', r.director],
    ['Телефон', SITE.phone],
    ['Электронная почта', SITE.email],
  ];

  return (
    <>
      <div className="no-print">
        <PageHero
          crumbs={[{ href: '/documents', label: 'Документы' }, { label: 'Карточка предприятия' }]}
          title={['Карточка', 'предприятия']}
          intro="Реквизиты для договора. Нажмите «Печать или PDF» и выберите «Сохранить в PDF»."
        >
          <div style={{ marginTop: 32 }}><PrintButton /></div>
        </PageHero>
      </div>
      <section className="v1-w v1-sec">
        <div className="v1-sheet" style={{ maxWidth: 860, marginInline: 'auto' }}>
          {/* На экране название уже в заголовке страницы, на печати шапка скрыта и нужен этот. */}
          <h2 className="v1-sheet-h v1-print-only">Карточка предприятия</h2>
          <p className="v1-print-only" style={{ margin: '10px 0 24px', color: '#5A6275' }}>{r.legalNameFull}</p>
          <table className="v1-table">
            <tbody>
              {rows.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}
            </tbody>
          </table>
          <p style={{ marginTop: 22, fontSize: 13, color: '#5A6275' }}>
            Учредительные документы и справка об отсутствии задолженности предоставляются по запросу на {SITE.email}.
          </p>
        </div>
      </section>
    </>
  );
}
