import Link from 'next/link';
import type { Metadata } from 'next';
import Logo from '@/components/Logo';
import { concepts } from '@/lib/concepts';
import { directions, firm, services } from '@/lib/data';
import '../pick.css';
import './map.css';

export const metadata: Metadata = {
  title: 'Эклиптика — карта сайта',
  description: 'Разделы будущего сайта и их связи.',
};

const pages = [
  {
    title: 'Главная',
    path: '/',
    items: [
      'Первый экран в логике выбранного концепта',
      'О компании и цифры команды',
      'Услуги и направления работ',
      'Порядок работ и условия договора',
      'Вопросы и форма заявки',
    ],
  },
  { title: 'Услуги', path: '/uslugi', items: services.map((s) => s.title) },
  { title: 'Направления', path: '/uslugi/…', items: directions.map((d) => `${d.title}, посадочная страница`) },
  {
    title: 'Объекты',
    path: '/portfolio',
    items: [
      'Список с фильтром по типу объекта',
      'Карточка объекта: задача, этапы, результат, фото',
      'Наполняется владельцем через админку',
    ],
  },
  {
    title: 'Блог',
    path: '/blog',
    items: ['Статьи для частных, коммерческих и тендерных заказчиков', 'Добавляются через админку без пересборки'],
  },
  {
    title: 'О компании',
    path: '/about',
    items: ['Команда и зоны ответственности', 'Документы, допуски и сертификаты', 'Карточка предприятия с реквизитами'],
  },
  { title: 'Расчёт', path: '/smeta', items: ['Ориентировочная стоимость по типу объекта и площади'] },
  { title: 'Контакты', path: '/contacts', items: ['Телефон, почта, адрес', 'Реквизиты', 'Форма заявки'] },
  { title: 'Служебное', path: '/admin', items: ['Вход по паролю', 'Объекты и статьи', 'Загрузка фото'] },
];

export default function SiteMap() {
  return (
    <div className="pk">
      <header className="pk-w pk-head">
        <Logo size={40} />
        <p className="pk-kick">{firm.full}</p>
        <h1>Карта сайта</h1>
        <div className="pk-row">
          <p className="pk-lede">
            Макеты показывают только главную страницу. После выбора концепта остальные разделы
            соберём в его оформлении на готовой платформе: админка, форма заявок на почту,
            блог, объекты, поисковая оптимизация.
          </p>
          <div>
            <Link className="pk-more" href="/">Вернуться к концептам</Link>
          </div>
        </div>
      </header>

      <main className="pk-w sm-grid">
        {pages.map((p) => (
          <section className="sm-card" key={p.title}>
            <div className="sm-top">
              <h2>{p.title}</h2>
              <span>{p.path}</span>
            </div>
            <ul>
              {p.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </section>
        ))}

        <section className="sm-card sm-wide">
          <div className="sm-top">
            <h2>На всех страницах</h2>
            <span>сквозное</span>
          </div>
          <ul className="sm-two">
            <li>Шапка и подвал в оформлении выбранного концепта</li>
            <li>Форма заявки с согласием на обработку персональных данных</li>
            <li>Заявки уходят на почту компании</li>
            <li>Уведомление о файлах cookie и Яндекс Метрика</li>
            <li>Мобильная вёрстка, проверка на 375, 768 и 1440 пикселях</li>
            <li>Учёт системной настройки «уменьшить движение»</li>
          </ul>
        </section>

        <section className="sm-card sm-wide">
          <div className="sm-top">
            <h2>Варианты</h2>
            <span>выбрать один</span>
          </div>
          <ul className="sm-two">
            {concepts.map((c) => (
              <li key={c.id}>
                <Link href={`/${c.id}`}>Вариант {c.n}</Link>, {c.mood.toLowerCase()}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
