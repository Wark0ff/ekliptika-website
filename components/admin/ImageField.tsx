'use client';

import { useRef, useState } from 'react';


export default function ImageField({
  name,
  label,
  defaultValue = '',
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
      setValue(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="label text-graphite-400">{label}</label>
      <input type="hidden" name={name} value={value} />

      <div className="mt-1.5 flex items-start gap-4">
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-line bg-cream">
          {value ? (

            <img src={value} alt="Превью" className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-center text-xs text-graphite-400">нет фото</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-sm border border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? 'Загрузка…' : value ? 'Заменить фото' : 'Загрузить фото'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onPick}
            className="hidden"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue('')}
              className="ml-3 text-sm font-semibold text-graphite-400 hover:text-red-600"
            >
              Убрать
            </button>
          )}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="/uploads/… или /img/…"
            className="mt-2 w-full rounded-sm border border-line bg-paper px-3 py-2 text-xs text-graphite outline-none focus:border-gold"
          />
          {hint && <p className="mt-1 text-xs text-graphite-400">{hint}</p>}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
