'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Step } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

/** Этапы в одну строку с линией, которая заполняется по мере прокрутки,
 *  и этапы «загораются», когда линия до них доходит. */
export default function ProcessRow({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('done');
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 55%', scrub: 0.6 },
      });
      tl.fromTo('.v2-proc-fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0);
      tl.fromTo('.v2-proc-steps li', { opacity: 0.3 }, { opacity: 1, stagger: 0.16, ease: 'none', duration: 0.2 }, 0);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="v2-proc-row">
      <div className="v2-proc-line" aria-hidden="true"><i className="v2-proc-fill" /></div>
      <ol className="v2-proc-steps">
        {steps.map((s) => (
          <li key={s.n}>
            <span className="v2-proc-n">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
