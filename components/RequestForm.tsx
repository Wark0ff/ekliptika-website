'use client';

import { useState } from 'react';

type State = 'idle' | 'sending' | 'sent';
type Errors = { name?: string; phone?: string; ok?: string };

/** Форма заявки. Разметка общая (классы rq-*), внешний вид задаёт концепт.
 *  В макете ничего не отправляет, но проходит все состояния: проверку, отправку, подтверждение.
 *  В рабочей версии заявка уйдёт на почту компании, как на сайте ТЕРА ГРУПП. */
export default function RequestForm({ submit = 'Отправить заявку', id = 'rq' }: { submit?: string; id?: string }) {
  const [state, setState] = useState<State>('idle');
  const [errors, setErrors] = useState<Errors>({});

  if (state === 'sent') {
    return (
      <div className="rq rq-done" role="status">
        <p className="rq-done-t">Заявка принята</p>
        <p>
          Свяжемся в течение рабочего дня. В макете форма ничего не отправляет:
          в рабочей версии заявка уходит на почту компании.
        </p>
        <button className="rq-again" type="button" onClick={() => setState('idle')}>
          Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <form
      className="rq"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get('name') || '').trim();
        const phone = String(fd.get('phone') || '').trim();
        const next: Errors = {};
        if (name.length < 2) next.name = 'Укажите, как к вам обращаться';
        if (phone.replace(/\D/g, '').length < 10) next.phone = 'Нужен номер из 10 цифр или больше';
        if (!fd.get('ok')) next.ok = 'Без согласия мы не можем принять заявку';
        setErrors(next);
        const first = Object.keys(next)[0];
        if (first) {
          e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
          return;
        }
        setState('sending');
        window.setTimeout(() => setState('sent'), 700);
      }}
    >
      <p className="rq-f">
        <label htmlFor={`${id}-name`}>Как к вам обращаться</label>
        <input id={`${id}-name`} name="name" type="text" autoComplete="name"
          aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-e` : undefined} />
        {errors.name && <span className="rq-err" id={`${id}-name-e`} role="alert">{errors.name}</span>}
      </p>

      <p className="rq-f">
        <label htmlFor={`${id}-phone`}>Телефон</label>
        <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel"
          aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${id}-phone-e` : undefined} />
        {errors.phone && <span className="rq-err" id={`${id}-phone-e`} role="alert">{errors.phone}</span>}
      </p>

      <p className="rq-f">
        <label htmlFor={`${id}-obj`}>Объект и задача</label>
        <textarea id={`${id}-obj`} name="object" placeholder="Тип объекта, площадь, адрес, желаемый срок" />
      </p>

      <label className="rq-ok">
        <input type="checkbox" name="ok" aria-invalid={!!errors.ok} />
        <span>Согласен на обработку персональных данных в соответствии с политикой конфиденциальности</span>
      </label>
      {errors.ok && <span className="rq-err" role="alert">{errors.ok}</span>}

      <input className="vh" tabIndex={-1} autoComplete="off" name="site" aria-hidden="true" />

      <button className="rq-go" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Отправляем…' : submit}
      </button>
    </form>
  );
}
