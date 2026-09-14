'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getPost, savePost, deletePost, slugify } from '@/lib/content';
import type { Post } from '@/lib/types';

export type PostFormState = { error?: string; values?: Record<string, string> };
/** После ошибки React 19 сбрасывает форму. Возвращаем введённое, чтобы форма восстановила поля
 *  и текст статьи или описание объекта не пропали. */
function fail(error: string, formData: FormData) {
  const values = Object.fromEntries(
    [...formData.entries()].filter(([k, v]) => typeof v === 'string' && !k.startsWith('$')),
  ) as Record<string, string>;
  return { error, values };
}



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
  if (!(await isAuthenticated())) redirect('/admin/login');

  const title = String(formData.get('title') ?? '').trim();
  const bodyRaw = String(formData.get('body') ?? '').trim();
  const editingSlug = String(formData.get('editingSlug') ?? '').trim();

  if (!title) return fail('Укажите заголовок.', formData);
  if (!bodyRaw) return fail('Текст статьи не может быть пустым.', formData);


  const slug = editingSlug || slugify(title);
  if (!slug) return fail('Не удалось построить адрес (slug) из заголовка.', formData);


  if (!editingSlug && (await getPost(slug))) {
    return fail(`Статья с адресом «${slug}» уже есть. Измените заголовок.`, formData);
  }

  const cover = String(formData.get('cover') ?? '').trim();
  if (!cover) return fail('Загрузите обложку статьи: она нужна для карточки и страницы статьи.', formData);

  const dateRaw = String(formData.get('date') ?? '').trim();
  const post: Post = {
    slug,
    title,
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    date: dateRaw || new Date().toISOString().slice(0, 10),
    readingTime: readingTime(bodyRaw),
    category: String(formData.get('category') ?? '').trim() || 'Статья',
    cover,

    body: bodyRaw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
  };

  try {
    await savePost(post);
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Не удалось сохранить статью.', formData);
  }
  revalidateBlog(slug);
  redirect('/admin/posts');
}

export async function deletePostAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect('/admin/login');
  const slug = String(formData.get('slug') ?? '').trim();
  if (slug) {
    await deletePost(slug);
    revalidateBlog(slug);
  }
  redirect('/admin/posts');
}
