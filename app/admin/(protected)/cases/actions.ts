'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { fail, type FormState } from '@/lib/form-state';
import { getProjectBySlug, saveProject, deleteProject, slugify } from '@/lib/content';
import { CATEGORIES } from '@/lib/types';
import type { Project, CaseStage, CaseKPI, ProjectCategory } from '@/lib/types';

export type CaseFormState = FormState;

function revalidateCases(slug: string) {
  revalidatePath('/');
  revalidatePath('/portfolio');
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath('/uslugi/[slug]', 'page');
  revalidatePath('/sitemap.xml');
}

function parseStages(raw: string): CaseStage[] {
  try {
    const arr = JSON.parse(raw) as CaseStage[];
    return arr
      .map((s) => ({ label: s.label?.trim() ?? '', title: s.title?.trim() ?? '', text: s.text?.trim() ?? '' }))
      .filter((s) => s.title || s.text);
  } catch {
    return [];
  }
}

function parseKpi(raw: string): CaseKPI[] {
  try {
    const arr = JSON.parse(raw) as Record<string, unknown>[];
    return arr
      .map((k) => {
        const kpi: CaseKPI = { value: Number(k.value) || 0, label: String(k.label ?? '').trim() };
        if (k.suffix) kpi.suffix = String(k.suffix);
        if (k.prefix) kpi.prefix = String(k.prefix);
        if (k.decimals !== undefined && k.decimals !== '') kpi.decimals = Number(k.decimals) || 0;
        return kpi;
      })
      .filter((k) => k.label);
  } catch {
    return [];
  }
}

export async function saveCaseAction(
  _prev: CaseFormState,
  formData: FormData,
): Promise<CaseFormState> {
  if (!(await isAuthenticated())) redirect('/admin/login');

  const g = (k: string) => String(formData.get(k) ?? '').trim();
  const title = g('title');
  const editingSlug = g('editingSlug');

  if (!title) return fail('Укажите название объекта.', formData);

  const category = g('category') as ProjectCategory;
  if (!CATEGORIES.includes(category)) return fail('Выберите категорию из списка.', formData);

  const slug = editingSlug || slugify(g('short') || title);
  if (!slug) return fail('Не удалось построить адрес (slug). Заполните название.', formData);
  if (!editingSlug && (await getProjectBySlug(slug))) {
    return fail(`Объект с адресом «${slug}» уже есть. Измените короткое имя.`, formData);
  }

  const statusRaw = g('status');
  const lawRaw = g('law');
  const budgetLabelRaw = g('budgetLabel');

  const project: Project = {
    slug,
    title,
    short: g('short') || title,
    category,
    subtitle: g('subtitle'),
    customer: g('customer'),
    status: statusRaw === 'В работе' ? 'В работе' : 'Сдан',
    budget: g('budget'),
    budgetLabel: budgetLabelRaw === 'Цена' ? 'Цена' : 'Бюджет',
    term: g('term'),
    year: Number(g('year')) || new Date().getFullYear(),
    law: lawRaw === '44-ФЗ' || lawRaw === '223-ФЗ' ? lawRaw : 'Коммерческий',
    area: g('area'),
    location: g('location'),
    summary: g('summary'),
    task: g('task').split(/\n+/).map((s) => s.trim()).filter(Boolean),
    context: g('context'),
    stages: parseStages(g('stagesJson')),
    result: g('result'),
    kpi: parseKpi(g('kpiJson')),

    photos: g('photos').split(/\n+/).map((s) => s.trim()).filter(Boolean),
  };
  // Пример со стоковыми фото помечается на сайте и закрыт от индексации. Снятая галочка делает объект обычным.
  if (formData.get('example')) project.example = true;
  if (!project.photos.length) return fail('Добавьте хотя бы одну фотографию: первая станет обложкой.', formData);

  try {
    await saveProject(project);
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Не удалось сохранить объект.', formData);
  }
  revalidateCases(slug);
  redirect('/admin/cases');
}

export async function deleteCaseAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) redirect('/admin/login');
  const slug = String(formData.get('slug') ?? '').trim();
  if (slug) {
    await deleteProject(slug);
    revalidateCases(slug);
  }
  redirect('/admin/cases');
}
