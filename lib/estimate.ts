


export interface Segment {
  key: string;
  label: string;
  hint: string;
  low: number;
  high: number;
  monthsPerK: number;
  minMonths: number;
  minArea: number;
  maxArea: number;
  stepArea: number;
  caseSlug: string;
}

export const SEGMENTS: Segment[] = [
  {
    key: 'zhilye',
    label: 'Жильё',
    hint: 'Частный дом, коттедж, резиденция',
    low: 52000,
    high: 120000,
    monthsPerK: 26,
    minMonths: 6,
    minArea: 80,
    maxArea: 2000,
    stepArea: 10,
    caseSlug: 'dom-180',
  },
  {
    key: 'kommerciya',
    label: 'Коммерция',
    hint: 'Офис, бизнес-центр, торговый объект',
    low: 44000,
    high: 88000,
    monthsPerK: 2.2,
    minMonths: 8,
    minArea: 300,
    maxArea: 30000,
    stepArea: 100,
    caseSlug: 'ofis-520',
  },
  {
    key: 'promyshlennost',
    label: 'Промышленность',
    hint: 'Склад, логистика, производство',
    low: 30000,
    high: 64000,
    monthsPerK: 0.9,
    minMonths: 7,
    minArea: 500,
    maxArea: 50000,
    stepArea: 100,
    caseSlug: 'sklad-2400',
  },
  {
    key: 'otdelka',
    label: 'Отделка',
    hint: 'Ремонт и отделка под ключ, отделка помещений',
    low: 13000,
    high: 38000,
    monthsPerK: 1.6,
    minMonths: 1,
    minArea: 20,
    maxArea: 5000,
    stepArea: 10,
    caseSlug: 'kvartira-75',
  },
];


export const GRADES = [
  { key: 'standart', label: 'Стандарт', mult: 0.85 },
  { key: 'biznes', label: 'Бизнес', mult: 1.0 },
  { key: 'premium', label: 'Премиум', mult: 1.45 },
] as const;
export type GradeKey = (typeof GRADES)[number]['key'];

export const REGIONS = [
  { key: 'msk', label: 'Москва', mult: 1.15 },
  { key: 'mo', label: 'МО / СПб', mult: 1.0 },
  { key: 'mln', label: 'Города-миллионники', mult: 0.9 },
  { key: 'region', label: 'Регионы', mult: 0.78 },
] as const;
export type RegionKey = (typeof REGIONS)[number]['key'];

export const gradeMult = (k: GradeKey) => GRADES.find((g) => g.key === k)?.mult ?? 1;
export const regionMult = (k: RegionKey) => REGIONS.find((r) => r.key === k)?.mult ?? 1;


export function estimateSegment(
  seg: Segment,
  area: number,
  grade: GradeKey,
  region: RegionKey,
  urgent: boolean,
) {
  const m = gradeMult(grade) * regionMult(region) * (urgent ? 1.18 : 1);
  const low = seg.low * area * m;
  const high = seg.high * area * m;
  const months = Math.max(
    seg.minMonths,
    Math.round((area / 1000) * seg.monthsPerK * (urgent ? 0.8 : 1)),
  );
  return { low, high, months: Math.min(months, 36) };
}


export type SmetaGroup = 'Строймонтаж' | 'Инженерия' | 'Отделка' | 'Благоустройство';

export interface SmetaSection {
  id: string;
  group: SmetaGroup;
  name: string;
  hint: string;
  work: number;
  mat: number;
  defaultOn: boolean;
}


export const SMETA_SECTIONS: SmetaSection[] = [

  { id: 'proekt', group: 'Строймонтаж', name: 'Проектирование и согласования', hint: 'РД, инженерные разделы, экспертиза', work: 1400, mat: 0, defaultOn: true },
  { id: 'demontazh', group: 'Строймонтаж', name: 'Демонтаж и подготовка', hint: 'Расчистка, демонтаж, вывоз мусора', work: 700, mat: 200, defaultOn: false },
  { id: 'fundament', group: 'Строймонтаж', name: 'Земляные работы и фундамент', hint: 'Котлован, плита/сваи, гидроизоляция', work: 3200, mat: 4200, defaultOn: true },
  { id: 'karkas', group: 'Строймонтаж', name: 'Каркас / коробка', hint: 'Монолит, кладка, перекрытия', work: 5800, mat: 8200, defaultOn: true },
  { id: 'krovlya', group: 'Строймонтаж', name: 'Кровля', hint: 'Стропильная система, покрытие, водосток', work: 1700, mat: 2400, defaultOn: true },
  { id: 'fasad', group: 'Строймонтаж', name: 'Фасад', hint: 'Вентфасад / штукатурный, утепление', work: 2400, mat: 3400, defaultOn: true },

  { id: 'electro', group: 'Инженерия', name: 'Электромонтаж', hint: 'Щит, кабельные трассы, точки, свет', work: 1100, mat: 900, defaultOn: true },
  { id: 'santeh', group: 'Инженерия', name: 'Водоснабжение и канализация', hint: 'Трассы, приборы, коллекторы', work: 1100, mat: 1200, defaultOn: true },
  { id: 'ovik', group: 'Инженерия', name: 'Отопление и вентиляция (ОВиК)', hint: 'Радиаторы/тёплый пол, приточно-вытяжная', work: 1300, mat: 1900, defaultOn: true },
  { id: 'slabotochka', group: 'Инженерия', name: 'Слаботочные системы', hint: 'Интернет, СКУД, видеонаблюдение', work: 500, mat: 700, defaultOn: false },

  { id: 'chernovaya', group: 'Отделка', name: 'Черновая отделка', hint: 'Штукатурка, стяжка, шпаклёвка', work: 2400, mat: 1900, defaultOn: true },
  { id: 'chistovaya', group: 'Отделка', name: 'Чистовая отделка', hint: 'Покраска, плитка, полы, потолки', work: 2300, mat: 3100, defaultOn: true },

  { id: 'blagoustroystvo', group: 'Благоустройство', name: 'Благоустройство территории', hint: 'Мощение, озеленение, освещение', work: 1100, mat: 1500, defaultOn: false },
];

export const SMETA_GROUPS: SmetaGroup[] = ['Строймонтаж', 'Инженерия', 'Отделка', 'Благоустройство'];
