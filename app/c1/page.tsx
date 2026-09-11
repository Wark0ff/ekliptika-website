import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Switch from '@/components/Switch';
import Logo from '@/components/Logo';
import Lines from '@/components/Lines';
import RequestForm from '@/components/RequestForm';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Reveals from '@/components/motion/Reveals';
import HorizontalDirections from './HorizontalDirections';
import {
  CTA, about, conditions, directions, disclaimer, firm, hero, img, process, requisites, services, team,
} from '@/lib/data';
import './style.css';

export const metadata: Metadata = { title: 'Эклиптика: вариант 1' };

const HERO_WORDS = ['Строим', 'Отделываем', 'Сдаём'];
const idx = (i: number) => ({ '--i': i } as CSSProperties);

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="v1-pill" href={href}>
      {children}
      <i aria-hidden="true">↗</i>
    </a>
  );
}

export default function V1() {
  return (
    <>
      <SmoothScroll />
      <Reveals />
      <Switch current="c1" />

      <div className="v1">
        <div className="v1-pre" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="92" height="92">
            <path className="a" d="M15.5 22.5 A19 19 0 1 1 15.5 41.5" pathLength={1} />
            <path className="a b" d="M21 32 H37" pathLength={1} />
            <ellipse className="o" cx="32" cy="34" rx="29" ry="8.5" transform="rotate(-14 32 34)" pathLength={1} />
            <path className="s" d="M52 2.5 L53.7 8.3 L59.5 10 L53.7 11.7 L52 17.5 L50.3 11.7 L44.5 10 L50.3 8.3 Z" />
          </svg>
        </div>

        <header className="v1-head">
          <Logo size={38} />
          <nav aria-label="Разделы">
            <a href="#napravleniya">Направления</a>
            <a href="#uslugi">Услуги</a>
            <a href="#poryadok">Порядок работ</a>
            <a href="#zayavka">Контакты</a>
          </nav>
          <Pill href="#zayavka">{CTA}</Pill>
        </header>

        <main>
          <section className="v1-hero">
            <div className="v1-hero-bg">
              <Image src={img('night-facade.webp')} alt="" fill priority sizes="100vw" />
            </div>
            <div className="v1-hero-shade" aria-hidden="true" />
            <h1 className="v1-hero-h">
              {HERO_WORDS.map((w, i) => (
                <span className="ln" key={w}><span style={idx(i)}>{w}</span></span>
              ))}
              <span className="vh">{hero.title}</span>
            </h1>
            <div className="v1-hero-side">
              <p>{hero.lead}</p>
              <Pill href="#zayavka">{CTA}</Pill>
            </div>
          </section>

          <section className="v1-w v1-state" id="kompaniya">
            <p className="v1-state-t" data-reveal="fade">{about.statement}</p>
            <p className="v1-facts" data-reveal="fade" style={idx(1)}>
              Команда работает с <em>{team.since}</em> года, на её счету более <em>{team.objects}</em> объектов.
              Гарантия по договору <em>{team.warranty}</em> месяцев.
            </p>
            <p className="v1-note" data-reveal="fade" style={idx(2)}>{about.origin}</p>
          </section>

          <HorizontalDirections items={directions} />

          <section className="v1-w v1-svc" id="uslugi">
            <Lines lines={['Виды работ']} className="v1-h2" />
            <ol>
              {services.map((s, i) => (
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
              <p>{about.roleNote}</p>
            </div>
            <ol className="v1-proc-r">
              {process.map((s) => (
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

          <section className="v1-band" data-reveal="img" aria-labelledby="v1-cond-h">
            <Image src={img('concrete.webp')} alt="" fill sizes="100vw" />
            <div className="v1-w v1-band-tx">
              <h2 className="v1-h2" id="v1-cond-h">Что закрепляем<br />в договоре</h2>
            </div>
          </section>
          <section className="v1-w v1-cond" aria-label="Условия договора">
            {conditions.map((c, i) => (
              <article key={c.title} data-reveal="fade" style={idx(i % 2)}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </article>
            ))}
          </section>
        </main>

        <section className="v1-w v1-ask" id="zayavka">
          <Lines lines={['Обсудим', 'ваш объект']} className="v1-ask-h" />
          <div className="v1-ask-grid">
            <dl className="v1-contacts">
              <div><dt>Телефон</dt><dd><a href={`tel:${firm.phoneHref}`}>{firm.phone}</a></dd></div>
              <div><dt>Почта</dt><dd><a href={`mailto:${firm.mail}`}>{firm.mail}</a></dd></div>
              <div><dt>Регион</dt><dd>{firm.region}</dd></div>
              <div><dt>Режим работы</dt><dd>{firm.hours}</dd></div>
            </dl>
            <RequestForm submit={CTA} id="v1" />
          </div>
        </section>

        <footer className="v1-w v1-foot">
          <Logo size={34} />
          <p>
            {requisites.legalName}, ИНН {requisites.inn}, ОГРН {requisites.ogrn}<br />
            Генеральный директор {requisites.director}<br />
            <span className="v1-disc">{disclaimer}</span>
          </p>
          <p className="v1-values">{firm.values.join(' / ')}</p>
        </footer>
      </div>
    </>
  );
}
