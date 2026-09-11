'use client';

import { useEffect } from 'react';

/** Появление элементов при входе в экран. Серверная разметка ставит атрибут data-reveal,
 *  этот компонент один раз вешает IntersectionObserver и добавляет класс is-in.
 *  Типы и их CSS описаны в base.css. Без JS и при «уменьшить движение» всё видно сразу. */
export default function Reveals() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
