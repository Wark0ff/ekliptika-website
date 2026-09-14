'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveCaseAction, type CaseFormState } from '@/app/admin/(protected)/cases/actions';
import GalleryField from '@/components/admin/GalleryField';
import { CATEGORIES } from '@/lib/types';
import type { Project, CaseStage } from '@/lib/types';



type KpiRow = { value: string; suffix: string; label: string };

const field =
  'mt-1.5 w-full rounded-sm border border-line bg-paper px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-gold';
const labelCls = 'label text-graphite-400';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold disabled:opacity-60">
      {pending ? 'Сохраняем…' : 'Сохранить'}
    </button>
  );
}

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  className = '',
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelCls}>{label}</label>
      <input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} className={field} />
    </div>
  );
}

export default function CaseForm({ project }: { project?: Project }) {
  const [state, formAction] = useActionState<CaseFormState, FormData>(saveCaseAction, {});
  const v = state.values;
  const [stages, setStages] = useState<CaseStage[]>(
    project?.stages?.length ? project.stages : [{ label: '', title: '', text: '' }],
  );


  const [kpi, setKpi] = useState<KpiRow[]>(
    project?.kpi?.length
      ? project.kpi.map((k) => ({ value: String(k.value), suffix: k.suffix ?? '', label: k.label }))
      : [{ value: '', suffix: '', label: '' }],
  );

  return (
    <form action={formAction} className="mt-8 max-w-3xl pb-16">
      <input type="hidden" name="editingSlug" value={project?.slug ?? ''} />
      <input type="hidden" name="stagesJson" value={JSON.stringify(stages)} />
      <input type="hidden" name="kpiJson" value={JSON.stringify(kpi)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="title" label="Название объекта *" defaultValue={v?.title ?? project?.title} className="sm:col-span-2" />
        <Field name="short" label="Короткое имя (для крупного шрифта)" defaultValue={v?.short ?? project?.short} placeholder="Квартира 75 м²" />
        <Field name="subtitle" label="Подзаголовок" defaultValue={v?.subtitle ?? project?.subtitle} placeholder="// Ремонт и отделка под ключ" />

        <div>
          <label htmlFor="category" className={labelCls}>Категория *</label>
          <select id="category" name="category" defaultValue={v?.category ?? project?.category ?? 'жильё'} className={field}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className={labelCls}>Статус</label>
          <select id="status" name="status" defaultValue={v?.status ?? project?.status ?? 'Сдан'} className={field}>
            <option>Сдан</option>
            <option>В работе</option>
          </select>
        </div>

        <Field name="customer" label="Заказчик" defaultValue={v?.customer ?? project?.customer} />
        <Field name="location" label="Локация" defaultValue={v?.location ?? project?.location} placeholder="Москва" />

        <div>
          <label htmlFor="law" className={labelCls}>Основание</label>
          <select id="law" name="law" defaultValue={v?.law ?? project?.law ?? 'Коммерческий'} className={field}>
            <option>Коммерческий</option>
            <option>44-ФЗ</option>
            <option>223-ФЗ</option>
          </select>
        </div>
        <Field name="year" label="Год" defaultValue={v?.year ?? project?.year} placeholder="2024" />

        <Field name="budget" label="Стоимость" defaultValue={v?.budget ?? project?.budget} placeholder="по смете" />
        <div>
          <label htmlFor="budgetLabel" className={labelCls}>Подпись стоимости</label>
          <select id="budgetLabel" name="budgetLabel" defaultValue={v?.budgetLabel ?? project?.budgetLabel ?? 'Бюджет'} className={field}>
            <option>Бюджет</option>
            <option>Цена</option>
          </select>
        </div>

        <Field name="term" label="Срок" defaultValue={v?.term ?? project?.term} placeholder="11 месяцев" />
        <Field name="area" label="Площадь" defaultValue={v?.area ?? project?.area} placeholder="340 м²" />

        <label className="flex items-start gap-3 rounded-sm border border-line bg-paper p-4 text-sm sm:col-span-2">
          <input type="checkbox" name="example" defaultChecked={v ? v.example === 'on' : !!project?.example} className="mt-0.5 h-4 w-4 accent-gold" />
          <span>
            <b>Пример объекта</b>
            <span className="block text-graphite-400">
              Для объектов со стоковыми фото и типовыми параметрами: на сайте появится пометка «Пример»,
              страница закрыта от поисковиков. Для своих объектов галочку снимите.
            </span>
          </span>
        </label>

        <div className="sm:col-span-2">
          <label htmlFor="summary" className={labelCls}>Краткое описание (для карточек)</label>
          <textarea id="summary" name="summary" defaultValue={v?.summary ?? project?.summary} rows={2} className={field} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-black uppercase tracking-wider">Фотографии</h2>
        <p className="mt-1 text-xs text-graphite-400">
          Первый кадр — обложка (карточка и фон страницы объекта), остальные идут в галерею объекта.
        </p>
        <div className="mt-3">
          <GalleryField defaultValue={v?.photos ? v.photos.split('\n').filter(Boolean) : project?.photos ?? []} />
        </div>
      </div>

      <div className="mt-8 grid gap-5">
        <div>
          <label htmlFor="task" className={labelCls}>Задача (по цели на строку)</label>
          <textarea id="task" name="task" defaultValue={v?.task ?? project?.task?.join('\n')} rows={3} className={field} />
        </div>
        <div>
          <label htmlFor="context" className={labelCls}>Контекст объекта</label>
          <textarea id="context" name="context" defaultValue={v?.context ?? project?.context} rows={3} className={field} />
        </div>
        <div>
          <label htmlFor="result" className={labelCls}>Результат</label>
          <textarea id="result" name="result" defaultValue={v?.result ?? project?.result} rows={3} className={field} />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider">Этапы работ</h2>
          <button
            type="button"
            onClick={() => setStages([...stages, { label: '', title: '', text: '' }])}
            className="text-sm font-semibold text-gold-dark hover:underline"
          >
            + этап
          </button>
        </div>
        <div className="mt-3 space-y-4">
          {stages.map((s, i) => (
            <div key={i} className="rounded-sm border border-line bg-paper p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={s.label}
                  onChange={(e) => setStages(stages.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  placeholder="Метка (Нулевой цикл)"
                  className={field}
                />
                <input
                  value={s.title}
                  onChange={(e) => setStages(stages.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                  placeholder="Заголовок этапа"
                  className={field}
                />
              </div>
              <textarea
                value={s.text}
                onChange={(e) => setStages(stages.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
                placeholder="Описание этапа"
                rows={2}
                className={`${field} mt-3`}
              />
              <button
                type="button"
                onClick={() => setStages(stages.filter((_, j) => j !== i))}
                className="mt-2 text-xs font-semibold text-graphite-400 hover:text-red-600"
              >
                удалить этап
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider">Цифры результата</h2>
          <button
            type="button"
            onClick={() => setKpi([...kpi, { value: '', suffix: '', label: '' }])}
            className="text-sm font-semibold text-gold-dark hover:underline"
          >
            + цифра
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {kpi.map((k, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-sm border border-line bg-paper p-3">
              <input
                type="text"
                inputMode="numeric"
                value={k.value}
                onChange={(e) => setKpi(kpi.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                placeholder="Число"
                className={`${field} mt-0 w-24`}
              />
              <input
                value={k.suffix ?? ''}
                onChange={(e) => setKpi(kpi.map((x, j) => (j === i ? { ...x, suffix: e.target.value } : x)))}
                placeholder="Суффикс ( м²)"
                className={`${field} mt-0 w-28`}
              />
              <input
                value={k.label}
                onChange={(e) => setKpi(kpi.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                placeholder="Подпись (Общая площадь)"
                className={`${field} mt-0 min-w-[10rem] flex-1`}
              />
              <button
                type="button"
                onClick={() => setKpi(kpi.filter((_, j) => j !== i))}
                className="text-xs font-semibold text-graphite-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {state.error && <p className="mt-6 text-sm text-red-600" role="alert">{state.error}</p>}

      <div className="mt-8 flex items-center gap-4">
        <SaveButton />
        <Link href="/admin/cases" className="text-sm font-semibold text-graphite-400 hover:text-ink">
          Отмена
        </Link>
        {project && <span className="ml-auto text-xs text-graphite-400">Адрес: /portfolio/{project.slug}</span>}
      </div>
    </form>
  );
}
