import Link from 'next/link';
import { getPosts, getProjects } from '@/lib/content';

export default async function AdminDashboard() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  const cards = [
    { href: '/admin/cases', title: 'Кейсы', count: projects.length, hint: 'Объекты портфолио' },
    { href: '/admin/posts', title: 'Статьи', count: posts.length, hint: 'Материалы блога' },
  ];

  return (
    <>
      <h1 className="text-2xl font-black uppercase">Панель управления</h1>
      <p className="mt-2 text-graphite-400">
        Добавляйте и редактируйте кейсы и статьи. Изменения появляются на сайте сразу.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-sm border border-line bg-paper p-7 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-lift"
          >
            <p className="text-4xl font-black text-gold-dark">{c.count}</p>
            <h2 className="mt-3 text-lg font-extrabold">{c.title}</h2>
            <p className="mt-1 text-sm text-graphite-400">{c.hint}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
