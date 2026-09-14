'use client';

import { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import { CATEGORIES, type Project, type ProjectCategory } from '@/lib/types';

type Filter = ProjectCategory | 'все';

/** Сетка объектов с фильтром по направлению. Первая карточка выбранного набора шире остальных. */
export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>('все');
  const counts = useMemo(() => {
    const c: Record<string, number> = { все: projects.length };
    projects.forEach((p) => { c[p.category] = (c[p.category] || 0) + 1; });
    return c;
  }, [projects]);
  const tabs: Filter[] = ['все', ...CATEGORIES.filter((c) => counts[c])];
  const list = projects.filter((p) => filter === 'все' || p.category === filter);

  return (
    <div>
      <div className="v1-tabs" role="group" aria-label="Фильтр по направлению">
        {tabs.map((t) => (
          <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)}>
            {t}<sup>{counts[t]}</sup>
          </button>
        ))}
      </div>
      <div className="v1-grid">
        {list.map((p, i) => (
          <ProjectCard key={p.slug} project={p} variant={i === 0 ? 'wide' : undefined} priority={i === 0}
            sizes={i === 0 ? '(max-width:600px) 100vw, 66vw' : '(max-width:600px) 100vw, (max-width:1000px) 50vw, 33vw'} />
        ))}
      </div>
    </div>
  );
}
