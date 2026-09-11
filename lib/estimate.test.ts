import { describe, it, expect } from 'vitest';
import {
  SEGMENTS,
  SMETA_SECTIONS,
  gradeMult,
  regionMult,
  estimateSegment,
} from './estimate';

const zhilye = SEGMENTS.find((s) => s.key === 'zhilye')!;

describe('множители', () => {
  it('класс', () => {
    expect(gradeMult('standart')).toBe(0.85);
    expect(gradeMult('biznes')).toBe(1);
    expect(gradeMult('premium')).toBe(1.45);
  });

  it('регион', () => {
    expect(regionMult('msk')).toBe(1.15);
    expect(regionMult('mo')).toBe(1);
    expect(regionMult('region')).toBe(0.78);
  });
});

describe('estimateSegment', () => {
  it('базовый расчёт (жильё, 300 м², бизнес, МО)', () => {
    const { low, high, months } = estimateSegment(zhilye, 300, 'biznes', 'mo', false);
    expect(low).toBe(zhilye.low * 300);
    expect(high).toBe(zhilye.high * 300);
    expect(months).toBe(8);
  });

  it('срочность повышает вилку на 18%', () => {
    const base = estimateSegment(zhilye, 300, 'biznes', 'mo', false);
    const rush = estimateSegment(zhilye, 300, 'biznes', 'mo', true);
    expect(rush.low).toBeCloseTo(base.low * 1.18, 5);
    expect(rush.months).toBeLessThanOrEqual(base.months);
  });

  it('класс и регион перемножаются', () => {
    const { low } = estimateSegment(zhilye, 100, 'premium', 'msk', false);
    expect(low).toBeCloseTo(zhilye.low * 100 * 1.45 * 1.15, 5);
  });

  it('срок не ниже минимума и не выше 36 мес.', () => {
    expect(estimateSegment(zhilye, 20, 'biznes', 'mo', false).months).toBe(zhilye.minMonths);
    expect(estimateSegment(zhilye, 999999, 'biznes', 'mo', false).months).toBe(36);
  });

  it('low всегда меньше high', () => {
    for (const seg of SEGMENTS) {
      const { low, high } = estimateSegment(seg, seg.minArea, 'biznes', 'mo', false);
      expect(low).toBeLessThan(high);
    }
  });
});

describe('целостность данных', () => {
  it('у каждого сегмента корректный диапазон площади', () => {
    for (const seg of SEGMENTS) {
      expect(seg.minArea).toBeGreaterThan(0);
      expect(seg.maxArea).toBeGreaterThan(seg.minArea);
      expect(seg.stepArea).toBeGreaterThan(0);
    }
  });

  it('id разделов сметы уникальны, ставки неотрицательны', () => {
    const ids = SMETA_SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SMETA_SECTIONS) {
      expect(s.work).toBeGreaterThanOrEqual(0);
      expect(s.mat).toBeGreaterThanOrEqual(0);
    }
  });
});
