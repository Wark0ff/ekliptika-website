import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Switch from '@/components/Switch';
import Logo from '@/components/Logo';
import Lines from '@/components/Lines';
import RequestForm from '@/components/RequestForm';
import SmoothScroll from '@/components/motion/SmoothScroll';
import Reveals from '@/components/motion/Reveals';
import HeroSlides from './HeroSlides';
import ScrubWords from './ScrubWords';
import ProcessRow from './ProcessRow';
import {
  CTA, about, conditions, directions, disclaimer, faq, firm, hero, img, process, requisites, services, team,
} from '@/lib/data';
import './style.css';

export const metadata: Metadata = { title: 'Эклиптика: вариант 2' };

const idx = (i: number) => ({ '--i': i } as CSSProperties);

const numbers = [
  { k: 'объектов с участием команды', v: `${team.objects}+` },
  { k: 'работает команда', v: `${new Date().getFullYear() - team.since}`, u: 'лет' },
  { k: 'гарантии по договору', v: `${team.warranty}`, u: 'мес.' },
];

export default function V2() {
  return (
    <>
      <SmoothScroll />
      <Reveals />
      <Switch current="c2" />

      <div className="v2">
        <section className="v2-hero">
          <HeroSlides />
          <header className="v2-head">
            <Logo size={36} />
            <nav aria-label="Разделы">
              <a href="#napravleniya">Направления</a>
              <a href="#uslugi">Услуги</a>
              <a href="#kompaniya">Компания</a>
            </nav>
            <a className="v2-glass" href="#zayavka">{CTA}</a>
          </header>
          <div className="v2-hero-tx">
            <h1>{hero.title}</h1>
            <p>{hero.lead}</p>
            <a className="v2-arrow" href="#zayavka">
              <span>{CTA}</span>
              <i aria-hidden="true" />
            </a>
          </div>
        </section>

        <main>
          <section className="v2-w v2-about" id="kompaniya">
            <ScrubWords className="v2-scrub" text={about.statement} />
            <div className="v2-nums">
              {numbers.map((n, i) => (
                <div className="v2-num" key={n.k} data-reveal="fade" style={idx(i)}>
                  <span>{n.k}</span>
                  <b>{n.v}{n.u && <small>{n.u}</small>}</b>
                </div>
              ))}
            </div>
            <p className="v2-origin" data-reveal="fade">{about.origin} {about.roleNote}</p>
          </section>

          <section className="v2-w v2-dirs" id="napravleniya">
            <Lines lines={['Направления']} className="v2-h2" />
            <ul className="v2-idx">
              {directions.map((d, i) => (
                <li key={d.id} data-reveal="fade" style={idx(i)}>
                  <span className="v2-idx-n">0{i + 1}</span>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                  <span className="v2-idx-meta">{d.law}<br />{d.term}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="v2-svc" id="uslugi">
            <div className="v2-w">
              <Lines lines={['Что мы делаем']} className="v2-h2" />
            </div>
            <div className="v2-w">
              <div className="v2-strips">
                {services.map((s) => (
                  <article className="v2-strip" key={s.id} tabIndex={0} aria-label={s.title}>
                    <Image src={img(s.photo)} alt="" fill sizes="(max-width:900px) 100vw, 60vw" />
                    <div className="v2-strip-shade" aria-hidden="true" />
                    <span className="v2-strip-n">{s.num}</span>
                    <span className="v2-strip-v" aria-hidden="true">{s.title}</span>
                    <div className="v2-strip-tx">
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="v2-w v2-proc" id="poryadok">
            <Lines lines={['Порядок работ']} className="v2-h2" />
            <ProcessRow steps={process} />
          </section>

          <section className="v2-w v2-terms" id="usloviya">
            <div className="v2-terms-img" data-reveal="img">
              <Image src={img('flat-calm.webp')} alt="Светлая комната после отделки" fill sizes="(max-width:900px) 100vw, 40vw" />
            </div>
            <div className="v2-terms-tx">
              <Lines lines={['Условия договора']} className="v2-h2" />
              <div className="v2-cond">
                {conditions.map((c, i) => (
                  <article key={c.title} data-reveal="fade" style={idx(i)}>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </article>
                ))}
              </div>
              <div className="v2-faq">
                {faq.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <section className="v2-ask" id="zayavka">
          <div className="v2-w">
            <Lines lines={['Обсудим', 'ваш объект']} className="v2-ask-h" />
            <div className="v2-ask-grid">
              <dl className="v2-contacts">
                <div><dt>Телефон</dt><dd><a href={`tel:${firm.phoneHref}`}>{firm.phone}</a></dd></div>
                <div><dt>Почта</dt><dd><a href={`mailto:${firm.mail}`}>{firm.mail}</a></dd></div>
                <div><dt>Регион</dt><dd>{firm.region}</dd></div>
                <div><dt>Режим работы</dt><dd>{firm.hours}</dd></div>
              </dl>
              <div className="v2-form">
                <RequestForm submit={CTA} id="v2" />
              </div>
            </div>
          </div>
        </section>

        <footer className="v2-w v2-foot">
          <Logo size={32} />
          <p>{requisites.legalName}, ИНН {requisites.inn}, КПП {requisites.kpp}, ОГРН {requisites.ogrn}. Генеральный директор {requisites.director}.</p>
          <p className="v2-disc">{disclaimer}</p>
        </footer>
      </div>
    </>
  );
}
