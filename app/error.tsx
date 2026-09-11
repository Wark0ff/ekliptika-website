'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="v1">
      <section className="v1-state-page">
        <div>
          <p className="v1-num">Ошибка</p>
          <h1 className="v1-h2">Что-то пошло не так</h1>
          <p>Обновите страницу или вернитесь на главную.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <button type="button" className="v1-pill" onClick={reset}>Обновить<i aria-hidden="true">↻</i></button>
            <Link className="v1-link" href="/">На главную</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
