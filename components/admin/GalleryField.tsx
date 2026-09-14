'use client';

import { useRef, useState } from 'react';


export default function GalleryField({ defaultValue = [] }: { defaultValue?: string[] }) {
  const [photos, setPhotos] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    setPhotos(next);
  };
  const remove = (i: number) => setPhotos(photos.filter((_, k) => k !== i));
  const addUrl = () => {
    const u = url.trim();
    if (u) { setPhotos([...photos, u]); setUrl(''); }
  };

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setError('');
    setUploading(true);
    try {
      const added: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Ошибка загрузки');
        added.push(data.url);
      }
      setPhotos((p) => [...p, ...added]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="label text-graphite-400">Галерея объекта</label>
        <span className="text-xs text-graphite-400">{photos.length} фото · первый — обложка</span>
      </div>
      <input type="hidden" name="photos" value={photos.join('\n')} />

      {photos.length > 0 && (
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {photos.map((src, i) => (
            <li key={src + i} className="flex items-center gap-3 rounded-sm border border-line bg-paper p-2">
              <img src={src} alt="" className="h-14 w-20 shrink-0 rounded-sm object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-graphite">{src}</p>
                {i === 0 && <span className="text-[10px] font-bold uppercase text-gold-dark">обложка</span>}
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-1.5 py-1 disabled:opacity-30" aria-label="Выше">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === photos.length - 1} className="px-1.5 py-1 disabled:opacity-30" aria-label="Ниже">↓</button>
                <button type="button" onClick={() => remove(i)} className="px-1.5 py-1 font-semibold text-graphite-400 hover:text-red-600" aria-label="Убрать">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-sm border border-ink bg-ink px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? 'Загрузка…' : 'Загрузить фото'}
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onPick} className="hidden" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
            placeholder="или вставьте путь /uploads/… и Enter"
            className="min-w-0 flex-1 rounded-sm border border-line bg-paper px-3 py-2 text-xs text-graphite outline-none focus:border-gold"
          />
          <button type="button" onClick={addUrl} className="rounded-sm border border-line px-3 py-2 text-xs font-semibold hover:border-gold">Добавить</button>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
