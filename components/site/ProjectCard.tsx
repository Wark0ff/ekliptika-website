import Image from 'next/image';
import Link from 'next/link';
import { coverOf, type Project } from '@/lib/types';
import { nb } from '@/lib/text';

const lawLabel = (law: Project['law']) => (law === 'Коммерческий' ? 'договор подряда' : law);

/** Карточка объекта. Пример объекта помечается словом «Пример» в подписи, а не наклейкой на фото.
 *  titleAs: уровень заголовка по месту (h2 прямо под h1 страницы, h3 внутри раздела). */
export default function ProjectCard({
  project, variant, priority = false, sizes = '(max-width:900px) 100vw, 33vw', titleAs: Title = 'h3',
}: {
  project: Project;
  variant?: 'lg' | 'wide';
  priority?: boolean;
  sizes?: string;
  titleAs?: 'h2' | 'h3';
}) {
  const cls = ['v1-pc', variant === 'lg' && 'is-lg', variant === 'wide' && 'is-wide'].filter(Boolean).join(' ');
  return (
    <Link href={`/portfolio/${project.slug}`} className={cls}>
      <div className="v1-pc-img">
        <Image src={coverOf(project)} alt={project.example ? '' : project.title} fill priority={priority} sizes={sizes} />
      </div>
      <div className="v1-pc-tx">
        <p className="v1-pc-cat">
          {project.example && <b>Пример · </b>}
          {project.category}, {lawLabel(project.law)}
        </p>
        <Title>{nb(project.title)}</Title>
        <p className="v1-pc-meta">{nb(project.area)}, срок {nb(project.term)}</p>
      </div>
    </Link>
  );
}
