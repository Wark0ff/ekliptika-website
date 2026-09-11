import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/types';

const lawLabel = (law: Project['law']) => (law === 'Коммерческий' ? 'договор подряда' : law);

/** Карточка объекта. Пример объекта помечается словом «Пример» в подписи, а не наклейкой на фото. */
export default function ProjectCard({
  project, variant, priority = false, sizes = '(max-width:900px) 100vw, 33vw',
}: {
  project: Project;
  variant?: 'lg' | 'wide';
  priority?: boolean;
  sizes?: string;
}) {
  const cls = ['v1-pc', variant === 'lg' && 'is-lg', variant === 'wide' && 'is-wide'].filter(Boolean).join(' ');
  return (
    <Link href={`/portfolio/${project.slug}`} className={cls}>
      <div className="v1-pc-img">
        <Image src={project.photos[0]} alt={project.example ? '' : project.title} fill priority={priority} sizes={sizes} />
      </div>
      <div className="v1-pc-tx">
        <p className="v1-pc-cat">
          {project.example && <b>Пример · </b>}
          {project.category}, {lawLabel(project.law)}
        </p>
        <h3>{project.title}</h3>
        <p className="v1-pc-meta">{project.area}, срок {project.term}</p>
      </div>
    </Link>
  );
}
