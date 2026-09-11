import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import Logo from '@/components/Logo';
import { concepts } from '@/lib/concepts';
import { disclaimer, firm, img } from '@/lib/data';
import './pick.css';

export const metadata: Metadata = {
  title: 'Эклиптика: три варианта сайта',
  description: 'Три варианта главной страницы сайта ООО «Эклиптика».',
};

export default function Pick() {
  return (
    <div className="pk">
      <header className="pk-w pk-head">
        <Logo size={46} />
        <h1>Три варианта главной страницы</h1>
        <div className="pk-row">
          <p className="pk-lede">
            Все три в фирменной гамме компании и с её знаком. Отличаются темой, шрифтом,
            композицией и движением. Состав разделов общий: направления, услуги, порядок работ,
            условия договора, заявка и реквизиты.
          </p>
          <div>
            <p className="pk-warn">{disclaimer}</p>
            <Link className="pk-more" href="/map">Карта будущего сайта</Link>
          </div>
        </div>
      </header>

      <main className="pk-w pk-list">
        {concepts.map((c) => (
          <article className="pk-item" key={c.id}>
            <Link className="pk-shot" href={`/${c.id}`} aria-label={`Открыть вариант ${c.n}`}>
              <Image src={img(c.shot)} alt="" fill sizes="(max-width:820px) 100vw, 46vw" />
            </Link>

            <div className="pk-tx">
              <h2>Вариант {c.n}</h2>
              <p className="pk-idea">{c.mood}</p>
              <p className="pk-world">{c.world}</p>

              <dl className="pk-spec">
                <div>
                  <dt>Палитра</dt>
                  <dd>
                    <span className="pk-dots">
                      {c.palette.map((p) => (
                        <i key={p.hex} style={{ background: p.hex }} title={`${p.name} ${p.hex}`} />
                      ))}
                    </span>
                    {c.palette.map((p) => p.name).join(', ')}
                  </dd>
                </div>
                <div><dt>Шрифт</dt><dd>{c.fonts}</dd></div>
                <div><dt>Движение</dt><dd>{c.motion}</dd></div>
                <div>
                  <dt>Референс</dt>
                  <dd>
                    {c.refs.map((r) => (
                      <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                    ))}
                  </dd>
                </div>
              </dl>

              <Link className="pk-open" href={`/${c.id}`}>Открыть вариант {c.n}</Link>
            </div>
          </article>
        ))}
      </main>

      <footer className="pk-w pk-foot">
        <span>{firm.full}</span>
        <span>{firm.values.join(' / ')}</span>
      </footer>
    </div>
  );
}
