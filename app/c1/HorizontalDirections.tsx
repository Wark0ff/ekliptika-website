'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { img, type Direction } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

/** Направления горизонтальной лентой: секция закрепляется, вертикальная прокрутка ведёт ленту вбок.
 *  На узких экранах и при «уменьшить движение» лента превращается в обычный вертикальный список. */
export default function HorizontalDirections({ items }: { items: Direction[] }) {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const t = track.current;
      if (!t || !wrap.current) return;
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth);
      gsap.to(t, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={wrap} className="v1-dir" id="napravleniya" aria-label="Направления работ">
      <div ref={track} className="v1-dir-track">
        <div className="v1-dir-intro">
          <h2 className="v1-h2">Направ&shy;ления</h2>
          <p>Четыре типа объектов, с которыми работает команда. Фото иллюстративные.</p>
        </div>
        {items.map((d, i) => (
          <article className="v1-dir-card" key={d.id}>
            <div className="v1-dir-img">
              <Image src={img(d.photo)} alt="" fill loading="eager" sizes="(max-width:900px) 100vw, 52vw" />
            </div>
            <div className="v1-dir-tx">
              <span className="v1-dir-n">0{i + 1}</span>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
              <p className="v1-dir-meta">{d.law}<br />{d.term}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
