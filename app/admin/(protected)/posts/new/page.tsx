import Link from 'next/link';
import PostForm from '@/components/admin/PostForm';

export default function NewPostPage() {
  return (
    <>
      <Link href="/admin/posts" className="text-sm text-graphite-400 hover:text-ink">
        ← Статьи
      </Link>
      <h1 className="mt-3 text-2xl font-black uppercase">Новая статья</h1>
      <PostForm />
    </>
  );
}
