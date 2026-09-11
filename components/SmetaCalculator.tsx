'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Printer, ArrowUpRight, RotateCcw, Check } from 'lucide-react';
import {
  SMETA_SECTIONS,
  SMETA_GROUPS,
  GRADES,
  REGIONS,
  gradeMult,
  regionMult,
  type GradeKey,
  type RegionKey,
} from '@/lib/estimate';

const rub = (n: number) =>
  Math.round(n).toLocaleString('ru-RU') + ' ₽';
const rubShort = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + ' млрд ₽';
  if (n >= 1e6) return (n / 1e6).toLocaleString('ru-RU', { maximumFractionDigits: 1 }) + ' млн ₽';
  return rub(n);
};

const isGrade = (v: string | null): v is GradeKey => GRADES.some((g) => g.key === v);
const isRegion = (v: string | null): v is RegionKey => REGIONS.some((r) => r.key === v);

export default function SmetaCalculator() {
  const params = useSearchParams();
  const seg = params.get('seg');

  const [area, setArea] = useState(() => {
    const a = Number(params.get('area'));
    return a >= 20 && a <= 100000 ? a : 300;
  });
  const [grade, setGrade] = useState<GradeKey>(() => {
    const g = params.get('grade');
    return isGrade(g) ? g : 'biznes';
  });
  const [region, setRegion] = useState<RegionKey>(() => {
    const r = params.get('region');
    return isRegion(r) ? r : 'mo';
  });


  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const onlyFinish = seg === 'otdelka';
    const finishIds = ['demontazh', 'electro', 'santeh', 'ovik', 'chernovaya', 'chistovaya', 'slabotochka'];
    return Object.fromEntries(
      SMETA_SECTIONS.map((s) => [s.id, onlyFinish ? finishIds.includes(s.id) : s.defaultOn]),
    );
  });


  useEffect(() => {
    if (params.get('area')) return;
    try {
      const saved = JSON.parse(localStorage.getItem('ekl-smeta') || 'null');
      if (saved) {
        if (typeof saved.area === 'number') setArea(saved.area);
        if (isGrade(saved.grade)) setGrade(saved.grade);
        if (isRegion(saved.region)) setRegion(saved.region);
        if (saved.enabled) setEnabled((e) => ({ ...e, ...saved.enabled }));
      }
    } catch {

    }

  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ekl-smeta', JSON.stringify({ area, grade, region, enabled }));
    } catch {

    }
  }, [area, grade, region, enabled]);

  const gm = gradeMult(grade);
  const rm = regionMult(region);

  const rows = useMemo(
    () =>
      SMETA_SECTIONS.map((s) => {
        const work = s.work * area * gm * rm;
        const mat = s.mat * area * gm;
        return { ...s, work, mat, total: work + mat, on: enabled[s.id] };
      }),
    [area, gm, rm, enabled],
  );

  const totals = rows.reduce(
    (acc, r) => (r.on ? { work: acc.work + r.work, mat: acc.mat + r.mat } : acc),
    { work: 0, mat: 0 },
  );
  const grand = totals.work + totals.mat;


  const hasShell = enabled['karkas'] || enabled['fundament'];
  const months = Math.max(
    1,
    Math.min(36, Math.round((area / 1000) * (hasShell ? 2.4 : 1.5)) || 1),
  );

  const gradeLabel = GRADES.find((g) => g.key === grade)?.label ?? '';
  const regionLabel = REGIONS.find((r) => r.key === region)?.label ?? '';
  const chosen = rows.filter((r) => r.on).map((r) => r.name).join(', ');
  const brief = `Заявка из сметы. Площадь ${area.toLocaleString('ru-RU')} м², класс ${gradeLabel}, регион ${regionLabel}. Итого ≈ ${rub(grand)} (работы ${rub(totals.work)}, материалы ${rub(totals.mat)}), срок ~${months} мес. Разделы: ${chosen}.`;
  const contactsHref = `/contacts?brief=${encodeURIComponent(brief)}`;

  const toggle = (id: string) => setEnabled((e) => ({ ...e, [id]: !e[id] }));
  const setAll = (on: boolean) =>
    setEnabled(Object.fromEntries(SMETA_SECTIONS.map((s) => [s.id, on])));
  const resetDefault = () =>
    setEnabled(Object.fromEntries(SMETA_SECTIONS.map((s) => [s.id, s.defaultOn])));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="space-y-8">
        <div className="rounded-sm border border-line bg-paper p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <label className="block">
              <span className="label text-graphite-400">Площадь, м²</span>
              <input
                type="number"
                min={20}
                max={100000}
                value={area}
                onChange={(e) => setArea(Math.max(0, Number(e.target.value)))}
                onBlur={(e) => setArea(Math.min(100000, Math.max(20, Number(e.target.value) || 20)))}
                className="mt-2 w-full rounded-sm border border-line bg-cream px-3 py-2.5 text-lg font-bold text-ink outline-none focus:border-gold"
              />
            </label>
            <label className="block">
              <span className="label text-graphite-400">Класс</span>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeKey)}
                className="mt-2 w-full rounded-sm border border-line bg-cream px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-gold"
              >
                {GRADES.map((g) => (
                  <option key={g.key} value={g.key}>{g.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label text-graphite-400">Регион</span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionKey)}
                className="mt-2 w-full rounded-sm border border-line bg-cream px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-gold"
              >
                {REGIONS.map((r) => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => setAll(true)} className="rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-ink">
              Всё включить
            </button>
            <button type="button" onClick={resetDefault} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider text-graphite-400 transition-colors hover:border-ink hover:text-ink">
              <RotateCcw size={13} /> Типовой набор
            </button>
            <button type="button" onClick={() => setAll(false)} className="rounded-full border border-line px-4 py-2 text-xs font-semibold uppercase tracking-wider text-graphite-400 transition-colors hover:border-ink hover:text-ink">
              Сбросить
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {SMETA_GROUPS.map((group) => (
            <div key={group}>
              <p className="label-gold text-gold-dark">{group}</p>
              <div className="mt-3 divide-y divide-line rounded-sm border border-line bg-paper">
                {rows.filter((r) => r.group === group).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggle(r.id)}
                    aria-pressed={r.on}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-cream"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                        r.on ? 'border-gold bg-gold text-ink' : 'border-line bg-paper'
                      }`}
                    >
                      {r.on && <Check size={13} strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-ink">{r.name}</span>
                      <span className="block text-xs text-graphite-400">{r.hint}</span>
                    </span>
                    <span className={`shrink-0 text-right tabular-nums ${r.on ? 'text-ink' : 'text-graphite-400'}`}>
                      <span className="block text-sm font-bold">{rubShort(r.total)}</span>
                      <span className="block text-[11px] text-graphite-400">
                        {area > 0 ? Math.round((r.work + r.mat) / area / 1000) : 0} тыс ₽/м²
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="lg:sticky lg:top-28">
        <div className="rounded-sm border border-lineDark bg-ink p-6 text-paper sm:p-8">
          <p className="label-gold">Предварительная смета</p>
          <p className="mt-2 text-4xl font-black leading-none tracking-tight text-gold tabular-nums">
            {rubShort(grand)}
          </p>
          <p className="mt-2 text-sm text-paper/50">
            {area.toLocaleString('ru-RU')} м² · ≈ {months} мес.
          </p>

          <dl className="mt-6 space-y-2 border-t border-lineDark pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-paper/60">Работы</dt>
              <dd className="font-semibold tabular-nums">{rub(totals.work)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-paper/60">Материалы</dt>
              <dd className="font-semibold tabular-nums">{rub(totals.mat)}</dd>
            </div>
            <div className="flex justify-between border-t border-lineDark pt-2 text-base">
              <dt className="font-bold">Итого</dt>
              <dd className="font-black text-gold tabular-nums">{rub(grand)}</dd>
            </div>
          </dl>

          <div className="mt-7 space-y-3">
            <Link href={contactsHref} className="btn-gold btn-shine group w-full">
              Получить точное КП
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <button type="button" onClick={() => window.print()} className="btn-outline w-full">
              <Printer size={16} /> Печать / PDF
            </button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-paper/40">
            Укрупнённый расчёт по средним ставкам Москвы/МО. Не является офертой — точная смета
            составляется после выезда на объект.
          </p>
        </div>
      </aside>
    </div>
  );
}
