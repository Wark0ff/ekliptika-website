import type { Metadata, Viewport } from 'next';
import { fontVars } from './fonts';
import './base.css';

export const metadata: Metadata = {
  title: 'Эклиптика: варианты сайта',
  description: 'Три варианта главной страницы сайта ООО «Эклиптика».',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={fontVars} suppressHydrationWarning>
      <head>
        {/* Класс js включает скрытие элементов до их появления. Без JS всё видно сразу. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
