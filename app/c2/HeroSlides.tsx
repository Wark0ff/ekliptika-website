'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { img } from '@/lib/data';

const SLIDES = [
  { src: 'res-day.webp', cap: 'Жилые здания' },
  { src: 'house.webp', cap: 'Частные дома' },
  { src: 'office-open.webp', cap: 'Офисы' },
  { src: 'concrete.webp', cap: 'Общественные здания' },
];
const DURATION = 6500;

/** Слайдшоу первого экрана: плавная смена кадров с медленным наездом и полосы прогресса.
 *  Полосы — кнопки, по ним можно переключать вручную. При «уменьшить движение» автосмены нет. */
export default function HeroSlides() {
  const [idx, setIdx] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAuto(false);
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % SLIDES.length), DURATION);
    return () => window.clearTimeout(t);
  }, [idx, auto]);

  return (
    <>
      <div className="v2-slides" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div key={s.src} className={`v2-slide${i === idx ? ' on' : ''}`}>
            <Image src={img(s.src)} alt="" fill priority={i === 0} sizes="100vw" />
          </div>
        ))}
      </div>
      <div className="v2-hero-shade" aria-hidden="true" />
      <div className="v2-bars" role="group" aria-label="Кадры первого экрана">
        {SLIDES.map((s, i) => (
          <button key={s.src} type="button" onClick={() => setIdx(i)}
            className={i === idx ? 'on' : i < idx ? 'done' : undefined}
            aria-label={`Кадр ${i + 1}: ${s.cap}`} aria-pressed={i === idx}>
            <span>{s.cap}</span>
            <i key={i === idx ? `run-${idx}` : 'idle'} style={{ animationDuration: `${DURATION}ms`, animationPlayState: auto ? 'running' : 'paused' }} />
          </button>
        ))}
      </div>
    </>
  );
}
