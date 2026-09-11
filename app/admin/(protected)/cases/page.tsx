import Link from 'next/link';
import { getProjects } from '@/lib/content';
import { deleteCaseAction } from './actions';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminCasesPage() {
  const projects = await getProjects();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase">Кейсы</h1>
          <p className="mt-1 text-sm text-graphite-400">{projects.length} в портфолио</p>
        </div>
        <Link href="/admin/cases/new" className="btn-gold">
          + Новый кейс
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line rounded-sm border border-line bg-paper">
        {projects.map((p) => (
          <div key={p.slug} className="flex items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-ink">{p.title}</p>
              <p className="mt-0.5 text-xs text-graphite-400">
                {p.category} · {p.status} · {p.year} · {p.budget}
              </p>
            </div>
            <Link
              href={`/admin/cases/${p.slug}`}
              className="shrink-0 text-sm font-semibold text-gold-dark hover:underline"
            >
              Править
            </Link>
            <DeleteButton action={deleteCaseAction} slug={p.slug} title={p.title} />
          </div>
        ))}
        {projects.length === 0 && (
          <p className="px-5 py-8 text-center text-graphite-400">Кейсов пока нет.</p>
        )}
      </div>
    </>
  );
}
