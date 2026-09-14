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

  // Пока плашка видна, первый экран поднимает кнопку над ней (см. .cookie-open в site.css).
  useEffect(() => {
    document.documentElement.classList.toggle('cookie-open', show);
    return () => document.documentElement.classList.remove('cookie-open');
  }, [show]);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {}
    setShow(false);
  };

  return (
    <div className="v1-cookie" role="region" aria-label="Уведомление о cookie">
      <p>
        Сайт использует cookie и Яндекс.Метрику.{' '}
        <Link href="/privacy">Подробнее</Link>
      </p>
      <button type="button" onClick={accept}>Понятно</button>
    </div>
  );
}
