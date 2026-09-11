'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Абзац, слова которого проявляются по мере прокрутки. Текст читается и без анимации:
 *  серые слова остаются контрастными (не ниже 3:1), при «уменьшить движение» всё сразу чёрное. */
export default function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll('.w');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('done');
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(words, { opacity: 0.22 }, {
        opacity: 1, stagger: 0.06, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, i) => <span className="w" key={i}>{w} </span>)}
    </p>
  );
}
