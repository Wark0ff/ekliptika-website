import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Switch from '@/components/Switch';
import Logo, { Mark } from '@/components/Logo';
import Lines from '@/components/Lines';
import RequestForm from '@/components/RequestForm';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Reveals from '@/components/motion/Reveals';
import {
  CTA, about, conditions, directions, disclaimer, firm, hero, img, process, requisites, services, team,
} from '@/lib/data';
import './style.css';

export const metadata: Metadata = { title: 'Эклиптика: вариант 3' };

const WORD = 'ЭКЛИПТИКА'.split('');
const idx = (i: number) => ({ '--i': i } as CSSProperties);

function Marquee() {
  const row = (
    <div className="v3-mq-row">
      {services.map((s) => (
        <span key={s.id} className="v3-mq-item">
          {s.title}
          <Mark size={34} />
        </span>
      ))}
    </div>
  );
  return (
    <div className="v3-mq" aria-hidden="true">
      <div className="v3-mq-track">{row}{row}</div>
    </div>
  );
}

export default function V3() {
  return (
    <>
      <SmoothScroll />
      <Reveals />
      <Switch current="c3" />

      <div className="v3">
        <section className="v3-hero">
          <header className="v3-head">
            <Logo size={38} />
            <nav className="v3-links" aria-label="Действия">
              <a className="v3-big" href="#zayavka">{CTA}</a>
              <a href={`tel:${firm.phoneHref}`}>Позвонить</a>
              <a href="#rekvizity">Реквизиты</a>
            </nav>
          </header>

          <p className="v3-word" aria-hidden="true">
            {WORD.map((ch, i) => <span key={i} style={idx(i)}>{ch}</span>)}
          </p>

          <div className="v3-hero-row">
            <h1>{hero.title}</h1>
            <div className="v3-hero-side">
              <p>{hero.lead}</p>
              <a className="v3-btn" href="#zayavka">{CTA}<i aria-hidden="true">↗</i></a>
            </div>
          </div>

          <div className="v3-hero-img">
            <Image src={img('hero-glass.webp')} alt="" fill priority sizes="100vw" />
          </div>
        </section>

        <Marquee />

        <main>
          <section className="v3-w v3-about" id="kompaniya">
            <div className="v3-bento">
              <div className="v3-b v3-b-img" data-reveal="img">
                <Image src={img('engineer.webp')} alt="Инженер сверяет рабочую документацию" fill sizes="(max-width:900px) 100vw, 40vw" />
              </div>
              <div className="v3-b v3-b-blue" data-reveal="fade">
                <strong>{team.objects}+</strong>
                <span>объектов с участием специалистов компании</span>
              </div>
              <div className="v3-b v3-b-line" data-reveal="fade" style={idx(1)}>
                <strong>{team.warranty}</strong>
                <span>месяцев гарантии по договору</span>
              </div>
              <div className="v3-b v3-b-text" data-reveal="fade" style={idx(2)}>
                <h2>Одна организация на весь цикл</h2>
                <p>{about.statement}</p>
                <p className="v3-small">{about.origin}</p>
              </div>
            </div>
          </section>

          <section className="v3-w v3-dirs" id="napravleniya">
            <Lines lines={['Направления']} className="v3-h2" />
            <div className="v3-mosaic">
              {directions.map((d, i) => (
                <article key={d.id} className={`v3-tile v3-t${i + 1}`} data-reveal="fade" style={idx(i)}>
                  <div className="v3-tile-img">
                    <Image src={img(d.photo)} alt="" fill sizes={i === 0 ? '(max-width:900px) 100vw, 58vw' : '(max-width:900px) 100vw, 40vw'} />
                  </div>
                  <div className="v3-tile-tx">
                    <h3>{d.title}</h3>
                    <p>{d.text}</p>
                    <span>{d.law} · {d.term}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="v3-proc" id="poryadok">
            <div className="v3-w">
              <Lines lines={['Порядок работ']} className="v3-h2" />
              <div className="v3-stack">
                {process.map((s, i) => (
                  <article key={s.n} className="v3-card" style={{ top: `calc(90px + ${i * 22}px)` }}>
                    <span className="v3-card-n">{s.n}</span>
                    <div>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="v3-w v3-cond" id="usloviya">
            <Lines lines={['Условия', 'договора']} className="v3-h2" />
            <div className="v3-cond-grid">
              {conditions.map((c, i) => (
                <article key={c.title} data-reveal="fade" style={idx(i)}>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <section className="v3-ask" id="zayavka">
          <div className="v3-w v3-ask-grid">
            <div>
              <Lines lines={['Обсудим', 'ваш объект']} className="v3-ask-h" />
              <p className="v3-ask-lead">Коммерческое предложение направим в течение 24 часов.</p>
              <dl className="v3-contacts">
                <div><dt>Телефон</dt><dd><a href={`tel:${firm.phoneHref}`}>{firm.phone}</a></dd></div>
                <div><dt>Почта</dt><dd><a href={`mailto:${firm.mail}`}>{firm.mail}</a></dd></div>
              </dl>
            </div>
            <div className="v3-form">
              <RequestForm submit={CTA} id="v3" />
            </div>
          </div>
        </section>

        <footer className="v3-foot" id="rekvizity">
          <div className="v3-w">
            <p className="v3-values">
              {firm.values.map((v, i) => <span key={v}>{i > 0 && <i aria-hidden="true" />}{v}</span>)}
            </p>
            <div className="v3-foot-grid">
              <Logo size={36} />
              <dl>
                <div><dt>Организация</dt><dd>{requisites.legalName}</dd></div>
                <div><dt>ИНН / КПП</dt><dd>{requisites.inn} / {requisites.kpp}</dd></div>
                <div><dt>ОГРН</dt><dd>{requisites.ogrn}</dd></div>
                <div><dt>Расчётный счёт</dt><dd>{requisites.account}</dd></div>
                <div><dt>Банк</dt><dd>{requisites.bank}, БИК {requisites.bik}</dd></div>
                <div><dt>Генеральный директор</dt><dd>{requisites.director}</dd></div>
              </dl>
            </div>
            <p className="v3-disc">{disclaimer}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
