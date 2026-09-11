'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type DirectionCard = { slug: string; title: string; card: string; term: string; law: string; photo: string };

/** Направления горизонтальной лентой: секция закрепляется, вертикальная прокрутка ведёт ленту вбок.
 *  Каждая карточка ведёт на посадочную страницу направления.
 *  На узких экранах и при «уменьшить движение» лента превращается в обычный вертикальный список. */
export default function HorizontalDirections({ items }: { items: DirectionCard[] }) {
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
          <p>Четыре типа объектов. Откройте направление, чтобы увидеть состав работ, этапы и сроки.</p>
        </div>
        {items.map((d, i) => (
          <Link className="v1-dir-card" key={d.slug} href={`/uslugi/${d.slug}`}>
            <div className="v1-dir-img">
              <Image src={`/img/${d.photo}`} alt="" fill loading="eager" sizes="(max-width:900px) 100vw, 52vw" />
            </div>
            <div className="v1-dir-tx">
              <span className="v1-dir-n">0{i + 1}</span>
              <h3>{d.title}</h3>
              <p>{d.card}</p>
              <p className="v1-dir-meta">{d.law}<br />{d.term}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
