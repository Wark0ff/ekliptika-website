import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('транслитерирует русский в латиницу', () => {
    expect(slugify('Детский сад')).toBe('detskiy-sad');
    expect(slugify('Жилой комплекс')).toBe('zhiloy-kompleks');
  });

  it('строит адрес кейса как в портфолио', () => {
    expect(slugify('ЖК «Комфорт Парк»')).toBe('zhk-komfort-park');
    expect(slugify('Поликлиника №3')).toBe('poliklinika-3');
  });

  it('убирает ъ и ь, ё → e', () => {
    expect(slugify('Подъезд')).toBe('podezd');
    expect(slugify('День')).toBe('den');
    expect(slugify('Ёлка')).toBe('elka');
  });

  it('схлопывает пробелы и знаки в один дефис', () => {
    expect(slugify('Офис  —  open   space')).toBe('ofis-open-space');
    expect(slugify('a / b \\ c')).toBe('a-b-c');
  });

  it('обрезает дефисы по краям и приводит к нижнему регистру', () => {
    expect(slugify('  ТЕСТ!  ')).toBe('test');
    expect(slugify('---Объект---')).toBe('obekt');
  });

  it('сохраняет латиницу и цифры', () => {
    expect(slugify('BC Rise 2024')).toBe('bc-rise-2024');
  });

  it('ограничивает длину 80 символами', () => {
    const long = 'а'.repeat(200);
    expect(slugify(long).length).toBe(80);
  });

  it('пустая или неслаггируемая строка даёт пустую', () => {
    expect(slugify('')).toBe('');
    expect(slugify('«»—…')).toBe('');
  });
});
