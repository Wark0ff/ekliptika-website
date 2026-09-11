'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getPost, savePost, deletePost, slugify } from '@/lib/content';
import type { Post } from '@/lib/site';

export type PostFormState = { error?: string };


function revalidateBlog(slug: string) {
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/sitemap.xml');
}


function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 180))} мин`;
}

export async function savePostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  if (!isAuthenticated()) redirect('/admin/login');

  const title = String(formData.get('title') ?? '').trim();
  const bodyRaw = String(formData.get('body') ?? '').trim();
  const editingSlug = String(formData.get('editingSlug') ?? '').trim();

  if (!title) return { error: 'Укажите заголовок.' };
  if (!bodyRaw) return { error: 'Текст статьи не может быть пустым.' };


  const slug = editingSlug || slugify(title);
  if (!slug) return { error: 'Не удалось построить адрес (slug) из заголовка.' };


  if (!editingSlug && (await getPost(slug))) {
    return { error: `Статья с адресом «${slug}» уже есть. Измените заголовок.` };
  }

  const dateRaw = String(formData.get('date') ?? '').trim();
  const post: Post = {
    slug,
    title,
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    date: dateRaw || new Date().toISOString().slice(0, 10),
    readingTime: readingTime(bodyRaw),
    category: String(formData.get('category') ?? '').trim() || 'Статья',
    cover: String(formData.get('cover') ?? '').trim(),

    body: bodyRaw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };

  await savePost(post);
  revalidateBlog(slug);
  redirect('/admin/posts');
}

export async function deletePostAction(formData: FormData): Promise<void> {
  if (!isAuthenticated()) redirect('/admin/login');
  const slug = String(formData.get('slug') ?? '').trim();
  if (slug) {
    await deletePost(slug);
    revalidateBlog(slug);
  }
  redirect('/admin/posts');
}
