/** Шрифты трёх вариантов, у всех есть кириллица.
 *   1  Jost от 200 до 500: ультратонкий крупный кегль, одна гарнитура
 *   2  Onest: спокойный современный гротеск
 *   3  Unbounded для заголовков + Manrope для текста
 *  Страница выбора живёт на Manrope. Надпись знака во всех вариантах набрана Jost. */
import { Jost, Onest, Unbounded, Manrope } from 'next/font/google';

export const jost = Jost({
  weight: ['200', '300', '400', '500', '600', '700'], subsets: ['cyrillic', 'latin'], variable: '--f-jost', display: 'swap',
});
export const onest = Onest({
  weight: ['400', '500', '600'], subsets: ['cyrillic', 'latin'], variable: '--f-onest', display: 'swap',
});
export const unbounded = Unbounded({
  weight: ['500', '700', '800'], subsets: ['cyrillic', 'latin'], variable: '--f-unbounded', display: 'swap',
});
export const manrope = Manrope({
  weight: ['400', '500', '600', '700'], subsets: ['cyrillic', 'latin'], variable: '--f-manrope', display: 'swap',
});

export const fontVars = [jost.variable, onest.variable, unbounded.variable, manrope.variable].join(' ');
