import Link from 'next/link';
import { concepts } from '@/lib/concepts';

/** Плавающая панель переключения вариантов. Только для показа заказчику,
 *  не перекрывает первый экран: живёт в нижнем левом углу. */
export default function Switch({ current }: { current: string }) {
  return (
    <nav className="switch" aria-label="Варианты макета">
      <Link href="/" className="switch-all">Варианты</Link>
      {concepts.map((c) => (
        <Link key={c.id} href={`/${c.id}`} className={c.id === current ? 'on' : undefined}
          aria-current={c.id === current ? 'page' : undefined} aria-label={`Вариант ${c.n}`}>
          {c.n}
        </Link>
      ))}
    </nav>
  );
}
