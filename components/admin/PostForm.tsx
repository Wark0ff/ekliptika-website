'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { savePostAction, type PostFormState } from '@/app/admin/(protected)/posts/actions';
import ImageField from '@/components/admin/ImageField';
import type { Post } from '@/lib/types';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold disabled:opacity-60">
      {pending ? 'Сохраняем…' : 'Сохранить'}
    </button>
  );
}

const field = 'mt-2 w-full rounded-sm border border-line bg-paper px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold';
const labelCls = 'label text-graphite-400';

export default function PostForm({ post }: { post?: Post }) {
  const [state, formAction] = useActionState<PostFormState, FormData>(savePostAction, {});
  const editing = !!post;
  const v = state.values;

  return (
    <form action={formAction} className="mt-8 max-w-3xl">
      <input type="hidden" name="editingSlug" value={post?.slug ?? ''} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelCls}>Заголовок *</label>
          <input id="title" name="title" defaultValue={v?.title ?? post?.title} required className={field} />
        </div>

        <div>
          <label htmlFor="category" className={labelCls}>Категория</label>
          <input id="category" name="category" defaultValue={v?.category ?? post?.category} placeholder="Документация" className={field} />
        </div>
        <div>
          <label htmlFor="date" className={labelCls}>Дата</label>
          <input id="date" name="date" type="date" defaultValue={v?.date ?? post?.date} className={field} />
        </div>

        <div className="sm:col-span-2">
          <ImageField
            name="cover"
            label="Обложка статьи"
            defaultValue={v?.cover ?? post?.cover}
            hint="Показывается в карточке статьи и на её странице."
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="excerpt" className={labelCls}>Краткое описание</label>
          <textarea id="excerpt" name="excerpt" defaultValue={v?.excerpt ?? post?.excerpt} rows={2} className={field} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="body" className={labelCls}>Текст статьи *</label>
          <textarea
            id="body"
            name="body"
            defaultValue={v?.body ?? post?.body.join('\n\n')}
            required
            rows={16}
            className={`${field} font-mono text-sm leading-relaxed`}
          />
          <p className="mt-1 text-xs text-graphite-400">
            Абзацы разделяйте пустой строкой. Время чтения посчитается автоматически.
          </p>
        </div>
      </div>

      {state.error && (
        <p className="mt-4 text-sm text-red-600" role="alert">{state.error}</p>
      )}

      <div className="mt-8 flex items-center gap-4">
        <SaveButton />
        <Link href="/admin/posts" className="text-sm font-semibold text-graphite-400 hover:text-ink">
          Отмена
        </Link>
        {editing && (
          <span className="ml-auto text-xs text-graphite-400">Адрес: /blog/{post.slug}</span>
        )}
      </div>
    </form>
  );
}
