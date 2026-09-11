/** Три варианта главной страницы. Для заказчика без названий, только номера.
 *  Все в фирменной гамме «Эклиптики», различаются темой, шрифтом, композицией и движением. */

export type Concept = {
  id: 'c1' | 'c2' | 'c3';
  n: number;
  mood: string;
  world: string;
  palette: { name: string; hex: string }[];
  fonts: string;
  motion: string;
  refs: { name: string; url: string }[];
  shot: string;
};

export const concepts: Concept[] = [
  {
    id: 'c1',
    n: 1,
    mood: 'Тёмный, строгая типографика',
    world:
      'Глубокий тёмно-синий фон, ультратонкий шрифт крупным кеглем, золото только тонкими линиями. ' +
      'Первый экран держится на трёх словах поверх затемнённого фасада, направления проезжают ' +
      'горизонтальной лентой при прокрутке.',
    palette: [
      { name: 'Ночь', hex: '#0A0F1E' },
      { name: 'Свет', hex: '#EDEBE6' },
      { name: 'Золото', hex: '#C9A45C' },
    ],
    fonts: 'Jost, от 200 до 500',
    motion: 'Заставка с прорисовкой орбиты знака, строки выезжают из-под маски, горизонтальная лента',
    refs: [{ name: 'Nabil Issa', url: 'https://www.awwwards.com/sites/nabil-issa-architect' }],
    shot: 'night-facade.webp',
  },
  {
    id: 'c2',
    n: 2,
    mood: 'Светлый, фотография на первом месте',
    world:
      'Холодный светлый фон и минимум интерфейса. Первый экран отдан слайдшоу объектов на весь экран. ' +
      'Текст о компании проявляется по мере прокрутки, фото направлений всплывает за курсором.',
    palette: [
      { name: 'Туман', hex: '#F2F3F5' },
      { name: 'Тёмно-синий', hex: '#0E1A33' },
      { name: 'Сталь', hex: '#5B6478' },
    ],
    fonts: 'Onest',
    motion: 'Слайдшоу с полосами прогресса, проявление слов по прокрутке, раскрывающиеся полосы услуг',
    refs: [{ name: 'Storey Architecture', url: 'https://www.awwwards.com/sites/storey-architecture' }],
    shot: 'house.webp',
  },
  {
    id: 'c3',
    n: 3,
    mood: 'Насыщенный фирменный',
    world:
      'Синий из карточки компании, белый и золото. Название во всю ширину экрана, асимметричная ' +
      'мозаика направлений, этапы работ ложатся стопкой карточек.',
    palette: [
      { name: 'Кобальт', hex: '#1C3D9B' },
      { name: 'Белый', hex: '#F6F7FB' },
      { name: 'Золото', hex: '#E2B04A' },
    ],
    fonts: 'Unbounded + Manrope',
    motion: 'Буквы названия поднимаются по очереди, одна бегущая строка, стопка карточек этапов',
    refs: [{ name: 'ERA Residence', url: 'https://www.awwwards.com/sites/era-residence' }],
    shot: 'hero-glass.webp',
  },
];
