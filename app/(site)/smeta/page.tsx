import type { Metadata } from 'next';
import { Suspense } from 'react';
import PageHero from '@/components/site/PageHero';
import SmetaCalculator from '@/components/SmetaCalculator';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Онлайн-смета',
  description:
    'Укрупнённая смета по объекту: строительно-монтажные работы, инженерные системы, отделка. Ориентировочная стоимость и срок, точная смета после обмеров.',
  alternates: { canonical: '/smeta' },
};

export default function SmetaPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: '/' }, { name: 'Онлайн-смета', path: '/smeta' }])} />
      <PageHero
        crumbs={[{ label: 'Онлайн-смета' }]}
        title={['Смета', 'по объекту']}
        intro="Отметьте нужные разделы, от нулевого цикла до чистовой отделки. Расчёт по укрупнённым расценкам, точная смета после выезда на объект."
        image="/img/drawing.webp"
      />
      <section className="v1-w v1-sec">
        <div className="v1-sheet">
          <Suspense fallback={<p>Загрузка калькулятора…</p>}>
            <SmetaCalculator />
          </Suspense>
        </div>
      </section>
    </>
  );
}
