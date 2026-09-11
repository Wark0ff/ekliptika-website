import Link from 'next/link';
import { getPosts } from '@/lib/content';
import { deletePostAction } from './actions';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase">Статьи</h1>
          <p className="mt-1 text-sm text-graphite-400">{posts.length} в блоге</p>
        </div>
        <Link href="/admin/posts/new" className="btn-gold">
          + Новая статья
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line rounded-sm border border-line bg-paper">
        {posts.map((p) => (
          <div key={p.slug} className="flex items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-ink">{p.title}</p>
              <p className="mt-0.5 text-xs text-graphite-400">
                {p.category} · {p.date} · {p.readingTime}
              </p>
            </div>
            <Link
              href={`/admin/posts/${p.slug}`}
              className="shrink-0 text-sm font-semibold text-gold-dark hover:underline"
            >
              Править
            </Link>
            <DeleteButton action={deletePostAction} slug={p.slug} title={p.title} />
          </div>
        ))}
        {posts.length === 0 && (
          <p className="px-5 py-8 text-center text-graphite-400">Статей пока нет.</p>
        )}
      </div>
    </>
  );
}
