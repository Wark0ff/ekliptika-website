import Link from 'next/link';
import SiteLayout from './(site)/layout';

/** 404 в оформлении сайта: с шапкой и подвалом, чтобы можно было уйти в любой раздел. */
export default function NotFound() {
  return (
    <SiteLayout>
      <section className="v1-state-page">
        <div>
          <p className="v1-num">Ошибка 404</p>
          <h1 className="v1-h2">Страница не найдена</h1>
          <p>Возможно, её перенесли или в адресе ошибка.</p>
          <Link className="v1-pill" href="/">На главную<i aria-hidden="true">↗</i></Link>
        </div>
      </section>
    </SiteLayout>
  );
}
