'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Плавная прокрутка (Lenis), синхронизированная с ScrollTrigger. Живёт в layout, поэтому
 *  при переходе между страницами сбрасывает позицию и пересчитывает триггеры.
 *  При «уменьшить движение» не включается: остаётся обычная прокрутка браузера. */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -84, duration: 1.2 });
      history.replaceState(null, '', url.hash);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const firstPath = useRef(true);

  useEffect(() => {
    // При первой загрузке позицию не трогаем: браузер сам восстанавливает её после обновления,
    // а принудительный скролл наверх давал рывок страницы и шапки.
    const initial = firstPath.current;
    firstPath.current = false;
    const lenis = lenisRef.current;
    const hash = window.location.hash;
    const target = hash ? document.querySelector<HTMLElement>(hash) : null;
    if (lenis && !initial) {
      if (target) lenis.scrollTo(target, { offset: -84, immediate: true });
      else lenis.scrollTo(0, { immediate: true });
    }
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
