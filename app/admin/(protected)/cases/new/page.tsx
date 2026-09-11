import Link from 'next/link';
import CaseForm from '@/components/admin/CaseForm';

export default function NewCasePage() {
  return (
    <>
      <Link href="/admin/cases" className="text-sm text-graphite-400 hover:text-ink">
        ← Кейсы
      </Link>
      <h1 className="mt-3 text-2xl font-black uppercase">Новый кейс</h1>
      <CaseForm />
    </>
  );
}
