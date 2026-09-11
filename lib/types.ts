/** Типы контента. Совместимы с админкой (формы кейсов и статей) и JSON-хранилищем. */

export const CATEGORIES = ['жильё', 'коммерция', 'соцобъекты', 'промышленность'] as const;
export type ProjectCategory = (typeof CATEGORIES)[number];

export interface CaseStage {
  label: string;
  title: string;
  text: string;
}

export interface CaseKPI {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  short: string;
  category: ProjectCategory;
  subtitle: string;
  customer: string;
  status: 'Сдан' | 'В работе';
  budget: string;
  budgetLabel: 'Цена' | 'Бюджет';
  term: string;
  year: number;
  law: '44-ФЗ' | '223-ФЗ' | 'Коммерческий';
  area: string;
  location: string;
  summary: string;
  task: string[];
  context: string;
  stages: CaseStage[];
  result: string;
  kpi: CaseKPI[];
  photos: string[];
  /** Пример объекта со стоковыми фото и типовыми параметрами. На сайте помечается «Пример». */
  example?: boolean;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  category: string;
  cover: string;
  body: string[];
}

export interface Service {
  id: string;
  num: string;
  title: string;
  text: string;
  points: string[];
  photo: string;
}

export interface ObjectTypeNorm {
  doc: string;
  about: string;
}

export interface ObjectTypePhase {
  title: string;
  duration: string;
  text: string;
}

export interface ObjectType {
  slug: string;
  title: string;
  /** Короткий текст для карточки направления на главной. */
  card: string;
  term: string;
  law: string;
  photo: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  works: { title: string; text: string }[];
  costDrivers: { title: string; text: string }[];
  phases: ObjectTypePhase[];
  specifics: { title: string; text: string }[];
  risks: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  norms: ObjectTypeNorm[];
  caseSlugs: string[];
}
