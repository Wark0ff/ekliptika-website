'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'ekl_cookie_ok';

export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {}
    setShow(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-lineDark bg-ink/95 backdrop-blur">
      <div className="container-c flex flex-col items-start gap-3 py-4 text-sm text-paper/80 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-3xl leading-relaxed">
          Мы используем файлы cookie и сервис Яндекс.Метрика для аналитики сайта. Оставаясь на сайте,
          вы соглашаетесь с{' '}
          <Link href="/privacy" className="text-gold underline transition-colors hover:text-gold/80">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-sm bg-gold px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold/90"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
