import type { Metadata } from 'next';
import PageHero from '@/components/site/PageHero';
import PortfolioGrid from '@/components/site/PortfolioGrid';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { getProjects } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Объекты',
  description:
    'Объекты по направлениям: квартиры и дома, коммерческие помещения, социальные объекты, склады и производство. Состав работ, этапы и сроки.',
  alternates: { canonical: '/portfolio' },
};

export default async function PortfolioPage() {
  const projects = await getProjects();
  const examplesOnly = projects.length > 0 && projects.every((p) => p.example);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Главная', path: '/' }, { name: 'Объекты', path: '/portfolio' }])} />
      <PageHero
        crumbs={[{ label: 'Объекты' }]}
        title={examplesOnly ? 'Примеры объектов' : 'Объекты'}
        intro={
          examplesOnly
            ? 'Как выглядят состав, этапы и сроки работ по каждому направлению. Фотографии иллюстративные, параметры типовые. Объекты компании появятся здесь по мере сдачи.'
            : 'Объекты по направлениям: квартиры и дома, коммерческие помещения, социальные объекты, склады и производство.'
        }
      />
      <section className="v1-w v1-sec">
        {projects.length > 0 ? (
          <PortfolioGrid projects={projects} />
        ) : (
          <p className="v1-lead">Объекты появятся здесь по мере сдачи.</p>
        )}
      </section>
    </>
  );
}
