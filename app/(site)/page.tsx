import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import Lines from '@/components/site/Lines';
import LeadForm from '@/components/site/LeadForm';
import ProjectCard from '@/components/site/ProjectCard';
import Faq from '@/components/site/Faq';
import HorizontalDirections from '@/components/site/HorizontalDirections';
import { JsonLd, faqJsonLd } from '@/lib/seo';
import { fmtDate as fmt } from '@/lib/text';
import { getPosts, getProjects } from '@/lib/content';
import {
  ABOUT, CONDITIONS, CTA, FAQ, HERO, OBJECT_TYPES, PROCESS, SERVICES, SITE, TEAM, WARRANTY_MONTHS,
} from '@/lib/site';

export const revalidate = 600;

const idx = (i: number) => ({ '--i': i }) as CSSProperties;

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const shown = projects.slice(0, 3);
  const examplesOnly = projects.length > 0 && projects.every((p) => p.example);
  const latest = [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 3);
  const dirs = OBJECT_TYPES.map(({ slug, title, card, term, law, photo }) => ({ slug, title, card, term, law, photo }));

  return (
    <>
      <JsonLd data={faqJsonLd()} />

      <div className="v1-pre" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="92" height="92">
          <path className="a" d="M15.5 22.5 A19 19 0 1 1 15.5 41.5" pathLength={1} />
          <path className="a b" d="M21 32 H37" pathLength={1} />
          <ellipse className="o" cx="32" cy="34" rx="29" ry="8.5" transform="rotate(-14 32 34)" pathLength={1} />
          <path className="s" d="M52 2.5 L53.7 8.3 L59.5 10 L53.7 11.7 L52 17.5 L50.3 11.7 L44.5 10 L50.3 8.3 Z" />
        </svg>
      </div>

      <section className="v1-hero">
        <div className="v1-hero-bg">
          <Image src="/img/night-facade.webp" alt="" fill priority sizes="100vw" />
        </div>
        <div className="v1-hero-shade" aria-hidden="true" />
        <h1 className="v1-hero-h">
          {HERO.words.map((w, i) => (
            <span className="ln" key={w} aria-hidden="true"><span style={idx(i)}>{w}</span> </span>
          ))}
          <span className="vh">{HERO.title}</span>
        </h1>
        <div className="v1-hero-side">
          <p>{HERO.lead}</p>
          <a className="v1-pill" href="#zayavka">
            {CTA}
            <i aria-hidden="true">↗</i>
          </a>
        </div>
      </section>

      <section className="v1-w v1-state" id="kompaniya" aria-label="О компании">
        <p className="v1-state-t" data-reveal="fade">{ABOUT.statement}</p>
        <p className="v1-facts" data-reveal="fade" style={idx(1)}>
          Команда работает с <em>{TEAM.since}</em> года, на её счету более <em>{TEAM.objects}</em> объектов.
          Гарантия по договору <em>{WARRANTY_MONTHS}</em> месяцев.
        </p>
        <p className="v1-note" data-reveal="fade" style={idx(2)}>{ABOUT.origin}</p>
      </section>

      <HorizontalDirections items={dirs} />

      <section className="v1-w v1-svc" id="uslugi">
        <Lines lines={['Виды работ']} className="v1-h2" />
        <ol>
          {SERVICES.map((s, i) => (
            <li className="v1-svc-row" key={s.id} data-reveal="fade" style={idx(i)}>
              <span className="v1-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="v1-w v1-proc" id="poryadok">
        <div className="v1-proc-l">
          <Lines lines={['Шесть этапов', 'до акта', 'приёмки']} className="v1-h2" />
          <p>{ABOUT.roleNote}</p>
        </div>
        <ol className="v1-proc-r">
          {PROCESS.map((s) => (
            <li key={s.n} data-reveal="fade">
              <span className="v1-proc-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="v1-band" data-reveal="img" aria-labelledby="cond-h">
        <Image src="/img/concrete.webp" alt="" fill sizes="100vw" />
        <div className="v1-w v1-band-tx">
          <h2 className="v1-h2" id="cond-h">Что закрепляем<br />в договоре</h2>
        </div>
      </section>
      <section className="v1-w v1-cond" aria-label="Условия договора">
        {CONDITIONS.map((c, i) => (
          <article key={c.title} data-reveal="fade" style={idx(i % 2)}>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </article>
        ))}
      </section>

      {shown.length > 0 && (
        <section className="v1-w v1-sec" id="obekty">
          <div className="v1-objs-head">
            <div>
              <Lines lines={[examplesOnly ? 'Примеры объектов' : 'Объекты']} className="v1-h2" />
              {examplesOnly && (
                <p className="v1-objs-note">
                  Фотографии иллюстративные, параметры типовые. Показываем состав и порядок работ по направлениям.
                </p>
              )}
            </div>
            <Link className="v1-link" href="/portfolio">Все объекты <span aria-hidden="true">→</span></Link>
          </div>
          <div className="v1-objs">
            {shown.map((p, i) => (
              <div key={p.slug} data-reveal="fade" style={idx(i)}>
                <ProjectCard project={p} variant={i === 0 ? 'lg' : undefined}
                  sizes={i === 0 ? '(max-width:900px) 100vw, 58vw' : '(max-width:900px) 100vw, 40vw'} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="v1-w v1-sec v1-faq" id="voprosy">
        <div>
          <Lines lines={['Вопросы']} className="v1-h2" />
        </div>
        <Faq items={FAQ} />
      </section>

      {latest.length > 0 && (
        <section className="v1-w v1-sec" id="stati">
          <div className="v1-objs-head">
            <Lines lines={['Статьи']} className="v1-h2" />
            <Link className="v1-link" href="/blog">Все статьи <span aria-hidden="true">→</span></Link>
          </div>
          <div className="v1-posts">
            {latest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="v1-post-row">
                <time dateTime={p.date}>{fmt(p.date)}</time>
                <h3>{p.title}</h3>
                <i aria-hidden="true">↗</i>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="v1-w v1-ask" id="zayavka">
        <Lines lines={['Обсудим', 'ваш объект']} className="v1-ask-h" />
        <div className="v1-ask-grid">
          <dl className="v1-contacts">
            <div><dt>Телефон</dt><dd><a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a></dd></div>
            <div><dt>Почта</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
            <div><dt>Регион</dt><dd>{SITE.region}</dd></div>
            <div><dt>Режим работы</dt><dd>{SITE.workHours}</dd></div>
          </dl>
          <LeadForm id="home" />
        </div>
      </section>
    </>
  );
}
