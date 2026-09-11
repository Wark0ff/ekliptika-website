'use client';

import { useFormStatus } from 'react-dom';

function Inner({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm font-semibold text-graphite-400 transition-colors hover:text-red-600 disabled:opacity-50"
    >
      {pending ? 'Удаляем…' : 'Удалить'}
    </button>
  );
}


export default function DeleteButton({
  action,
  slug,
  title,
}: {
  action: (formData: FormData) => void | Promise<void>;
  slug: string;
  title: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Удалить «${title}»? Это действие необратимо.`)) e.preventDefault();
      }}
      className="shrink-0"
    >
      <input type="hidden" name="slug" value={slug} />
      <Inner label={title} />
    </form>
  );
}
