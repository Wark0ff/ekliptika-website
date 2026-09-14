import type { Metadata, Viewport } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';
import './site.css';
import { SITE } from '@/lib/brand';

const jost = Jost({
  subsets: ['latin', 'cyrillic'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--f-jost',
  display: 'swap',
});

/** Индексация включается переменной NEXT_PUBLIC_INDEX=1 на боевом домене. До запуска сайт закрыт. */
const INDEX = process.env.NEXT_PUBLIC_INDEX === '1';

export const viewport: Viewport = {
  themeColor: '#0A0F1E',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand}: строительство, реконструкция и отделка в Москве и МО`,
    template: `%s | ${SITE.brand}`,
  },
  description: SITE.descriptionShort,
  applicationName: SITE.brand,
  authors: [{ name: SITE.brandFull }],
  creator: SITE.brandFull,
  publisher: SITE.brandFull,
  formatDetection: { telephone: true, address: false, email: true },
  alternates: { canonical: '/', languages: { 'ru-RU': '/' } },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE.url,
    siteName: SITE.brand,
    title: `${SITE.brand}: строительная компания полного цикла`,
    description: SITE.descriptionShort,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.brand}: строительство, реконструкция и отделка`,
    description: SITE.descriptionShort,
  },
  robots: INDEX
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
    : { index: false, follow: false },
  category: 'construction',
};

/** Класс js включает скрытие элементов до их появления (без JS всё видно сразу).
 *  Страховка: если через 4 с компонент Reveals так и не запустился (бандл не загрузился), класс снимается.
 *  Класс intro-seen убирает заставку, если её уже показывали в этой вкладке. */
const HEAD_SCRIPT =
  "var d=document.documentElement;d.classList.add('js');" +
  "setTimeout(function(){if(!d.dataset.rv)d.classList.remove('js')},4000);" +
  "try{if(sessionStorage.getItem('ekl-intro'))document.documentElement.classList.add('intro-seen');" +
  "else sessionStorage.setItem('ekl-intro','1')}catch(e){}";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={jost.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
