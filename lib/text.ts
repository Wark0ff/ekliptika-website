/** Неразрывный пробел после числа: «520 м²», «4 800 м²», «1 сентября» не разрываются переносом строки.
 *  Применяется при выводе, поэтому работает и для текста из админки. */
export const nb = (s: string) => s.replace(/(\d) (?=\S)/g, '$1 ');

export const fmtDate = (d: string) =>
  nb(new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }));
