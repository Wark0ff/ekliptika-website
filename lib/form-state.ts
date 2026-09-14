/** Состояние форм админки: текст ошибки и введённые значения. */
export type FormState = { error?: string; values?: Record<string, string> };

/** После ошибки React 19 сбрасывает форму. Возвращаем введённое, чтобы форма восстановила поля
 *  и текст статьи или описание объекта не пропали. */
export function fail(error: string, formData: FormData): FormState {
  const values = Object.fromEntries(
    [...formData.entries()].filter(([k, v]) => typeof v === 'string' && !k.startsWith('$')),
  ) as Record<string, string>;
  return { error, values };
}
