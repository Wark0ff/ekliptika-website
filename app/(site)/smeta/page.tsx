import { notFound } from 'next/navigation';

/** Онлайн-смета временно скрыта: ставки и состав разделов ещё не согласованы с заказчиком.
 *  Калькулятор (components/SmetaCalculator.tsx, lib/estimate.ts) сохранён. Чтобы вернуть страницу,
 *  восстановите её из git, ссылку в подвале и строку в app/sitemap.ts. */
export default function SmetaPage() {
  notFound();
}
