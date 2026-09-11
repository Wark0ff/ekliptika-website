import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { logout } from '../actions';


export const metadata: Metadata = {

  title: { absolute: 'Панель управления: Эклиптика' },
  robots: { index: false, follow: false },
};


export const dynamic = 'force-dynamic';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {


  if (!isAuthenticated()) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/admin" className="text-sm font-black uppercase tracking-wider">
            Эклиптика · Панель
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/admin/cases" className="text-graphite hover:text-gold-dark">
              Кейсы
            </Link>
            <Link href="/admin/posts" className="text-graphite hover:text-gold-dark">
              Статьи
            </Link>
            <Link href="/" target="_blank" className="text-graphite-400 hover:text-ink">
              Сайт ↗
            </Link>
            <form action={logout}>
              <button type="submit" className="text-graphite-400 hover:text-red-600">
                Выйти
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
