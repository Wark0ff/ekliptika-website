'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { CTA, NAV, SITE } from '@/lib/brand';

/** Шапка: прозрачная над первым экраном, при прокрутке вниз прячется, при прокрутке вверх
 *  возвращается на тёмной подложке. На узких экранах меню открывается на весь экран. */
export default function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Точка отсчёта направления. Шапка прячется или возвращается только после сдвига на 12px
    // в одну сторону: мелкие колебания плавной прокрутки и тачпада её не дёргают.
    let anchor = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setSolid(y > 60);
        if (y < 320) {
          setHidden(false);
          anchor = y;
        } else if (y - anchor > 12) {
          setHidden(true);
          anchor = y;
        } else if (anchor - y > 12) {
          setHidden(false);
          anchor = y;
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const current = (href: string) => (href === pathname ? 'page' : undefined);

  return (
    <>
      <header className={`v1-head${solid || open ? ' is-solid' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
        <Link href="/" className="v1-head-logo" aria-label="Эклиптика, на главную">
          <Logo size={36} tag={false} />
        </Link>
        <nav className="v1-head-nav" aria-label="Основное меню">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={current(item.href)}>{item.label}</Link>
          ))}
        </nav>
        <Link className="v1-pill v1-head-cta" href="/contacts">
          {CTA}
          <i aria-hidden="true">↗</i>
        </Link>
        <button type="button" className={`v1-burger${open ? ' is-open' : ''}`} onClick={() => setOpen((v) => !v)}
          aria-expanded={open} aria-controls="v1-menu" aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>
          <span /><span />
        </button>
      </header>

      <div id="v1-menu" className={`v1-menu${open ? ' is-open' : ''}`} inert={!open}>
        <nav aria-label="Меню">
          {NAV.map((item, i) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              style={{ '--i': i } as CSSProperties}>{item.label}</Link>
          ))}
        </nav>
        <div className="v1-menu-foot">
          <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
          <Link className="v1-pill" href="/contacts" onClick={() => setOpen(false)}>
            {CTA}
            <i aria-hidden="true">↗</i>
          </Link>
        </div>
      </div>
    </>
  );
}
