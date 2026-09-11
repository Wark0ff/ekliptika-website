import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/lib/content';
import CaseForm from '@/components/admin/CaseForm';

export default async function EditCasePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <>
      <Link href="/admin/cases" className="text-sm text-graphite-400 hover:text-ink">
        ← Кейсы
      </Link>
      <h1 className="mt-3 text-2xl font-black uppercase">Правка кейса</h1>
      <CaseForm project={project} />
    </>
  );
}
