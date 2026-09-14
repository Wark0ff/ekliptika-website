'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Появление элементов при входе в экран. Серверная разметка ставит атрибут data-reveal,
 *  компонент вешает IntersectionObserver и добавляет класс is-in. Живёт в layout, поэтому
 *  пересканирует страницу при каждом переходе. Без JS и при «уменьшить движение» всё видно сразу. */
export default function Reveals() {
  const pathname = usePathname();

  useEffect(() => {
    // Отметка для страховки в <head>: если скрипты не запустились, она через 4 с снимает скрытие.
    document.documentElement.dataset.rv = '1';
    const scan = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      scan().forEach((el) => el.classList.add('is-in'));
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
      { rootMargin: '0px 0px -4% 0px', threshold: 0 },
    );
    scan().forEach((el) => io.observe(el));
    const late = window.setTimeout(() => scan().forEach((el) => io.observe(el)), 400);
    return () => {
      window.clearTimeout(late);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
