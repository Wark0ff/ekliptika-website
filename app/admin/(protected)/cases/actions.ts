'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getProjectBySlug, saveProject, deleteProject, slugify } from '@/lib/content';
import { CATEGORIES } from '@/lib/site';
import type { Project, CaseStage, CaseKPI, ProjectCategory } from '@/lib/site';

export type CaseFormState = { error?: string };


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
  if (!isAuthenticated()) redirect('/admin/login');

  const g = (k: string) => String(formData.get(k) ?? '').trim();
  const title = g('title');
  const editingSlug = g('editingSlug');

  if (!title) return { error: 'Укажите название объекта.' };

  const category = g('category') as ProjectCategory;
  if (!CATEGORIES.includes(category)) return { error: 'Выберите категорию из списка.' };

  const slug = editingSlug || slugify(g('short') || title);
  if (!slug) return { error: 'Не удалось построить адрес (slug). Заполните название.' };
  if (!editingSlug && (await getProjectBySlug(slug))) {
    return { error: `Кейс с адресом «${slug}» уже есть. Измените короткое имя.` };
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

  await saveProject(project);
  revalidateCases(slug);
  redirect('/admin/cases');
}

export async function deleteCaseAction(formData: FormData): Promise<void> {
  if (!isAuthenticated()) redirect('/admin/login');
  const slug = String(formData.get('slug') ?? '').trim();
  if (slug) {
    await deleteProject(slug);
    revalidateCases(slug);
  }
  redirect('/admin/cases');
}
