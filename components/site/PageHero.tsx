import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import Lines from './Lines';

/** Шапка внутренней страницы: хлебные крошки, заголовок из-под маски, вводный абзац.
 *  С фотографией растягивается почти на экран и затемняется для читаемости текста. */
export default function PageHero({
  crumbs, title, intro, image, children,
}: {
  crumbs: { href?: string; label: string }[];
  title: string | string[];
  intro?: string;
  image?: string;
  children?: ReactNode;
}) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <section className={`v1-ph${image ? ' has-img' : ''}`}>
      {image && (
        <div className="v1-ph-bg">
          <Image src={image} alt="" fill priority sizes="100vw" />
        </div>
      )}
      <div className="v1-w v1-ph-in">
        <nav className="v1-crumbs" aria-label="Навигационная цепочка">
          <Link href="/">Главная</Link>
          {crumbs.map((c) => (
            <span key={c.label} style={{ display: 'contents' }}>
              <span aria-hidden="true">/</span>
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>
        <Lines as="h1" lines={lines} className="v1-ph-h" />
        {intro && <p className="v1-ph-intro" data-reveal="fade">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
