'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ru">
      <body style={{
        margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0A0F1E', color: '#EDEBE6', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 300, textTransform: 'uppercase' }}>Что-то пошло не так</h1>
          <p style={{ color: 'rgba(237,235,230,0.66)', marginTop: '1rem' }}>Попробуйте обновить страницу.</p>
          <button type="button" onClick={reset} style={{
            marginTop: '1.5rem', padding: '0.9rem 2rem', border: 'none', borderRadius: 999,
            background: '#C9A45C', color: '#0A0F1E', fontWeight: 500, cursor: 'pointer',
          }}>
            Обновить
          </button>
        </div>
      </body>
    </html>
  );
}
