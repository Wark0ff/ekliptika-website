import Link from 'next/link';
import Logo from './Logo';
import { CTA, DIRECTION_LINKS, SITE } from '@/lib/brand';

const COMPANY = [
  { href: '/about', label: 'О компании' },
  { href: '/portfolio', label: 'Объекты' },
  { href: '/blog', label: 'Статьи' },
  { href: '/smeta', label: 'Онлайн-смета' },
  { href: '/documents', label: 'Документы' },
  { href: '/company-card', label: 'Карточка предприятия' },
];

export default function Footer() {
  const r = SITE.requisites;
  return (
    <footer className="v1-footer">
      <div className="v1-w v1-footer-top">
        <div>
          <Logo size={42} />
          <p>{SITE.slogan}</p>
        </div>
        <Link className="v1-pill" href="/contacts">
          {CTA}
          <i aria-hidden="true">↗</i>
        </Link>
      </div>

      <div className="v1-w v1-footer-cols">
        <div>
          <p className="v1-footer-h">Направления</p>
          <ul>
            {DIRECTION_LINKS.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="v1-footer-h">Компания</p>
          <ul>
            {COMPANY.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="v1-footer-h">Контакты</p>
          <ul>
            <li><a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li>{SITE.workHours}</li>
            <li>{SITE.region}</li>
          </ul>
        </div>
      </div>

      <div className="v1-w v1-footer-bot">
        <p>© {new Date().getFullYear()} {r.legalName}. ИНН {r.inn}, ОГРН {r.ogrn}</p>
        <p className="v1-values">{SITE.values.join(' / ')}</p>
        <Link href="/privacy">Политика конфиденциальности</Link>
      </div>
    </footer>
  );
}
