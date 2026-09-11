import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost } from '@/lib/content';
import PostForm from '@/components/admin/PostForm';

export default async function EditPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Link href="/admin/posts" className="text-sm text-graphite-400 hover:text-ink">
        ← Статьи
      </Link>
      <h1 className="mt-3 text-2xl font-black uppercase">Правка статьи</h1>
      <PostForm post={post} />
    </>
  );
}
