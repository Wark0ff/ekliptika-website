'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { reachGoal } from '@/components/Analytics';
import { CTA, SITE } from '@/lib/brand';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Field = 'name' | 'phone' | 'email' | 'consent';
type Errors = Partial<Record<Field, string>>;

/** Форма заявки. Отправляет на /api/lead (письмо на почту компании через SMTP, см. deploy/README-deploy.md).
 *  Проверка на клиенте, ловушка для ботов, согласие на обработку персональных данных (152-ФЗ). */
export default function LeadForm({ id = 'lead', defaultBrief = '' }: { id?: string; defaultBrief?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (String(fd.get('company_url') || '').trim()) {
      setStatus('sent');
      return;
    }
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const next: Errors = {};
    if (name.length < 2) next.name = 'Укажите, как к вам обращаться';
    if (phone.replace(/\D/g, '').length < 10) next.phone = 'Нужен номер из 10 цифр или больше';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Проверьте адрес почты';
    if (!fd.get('consent')) next.consent = 'Без согласия мы не можем принять заявку';
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus('sending');
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 12000);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name, phone, email,
          company: fd.get('company'),
          tender: fd.get('message'),
          page: window.location.href,
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
      reachGoal('lead');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    } finally {
      window.clearTimeout(timer);
    }
  }

  if (status === 'sent') {
    return (
      <div className="rq rq-done" role="status">
        <p className="rq-done-t">Заявка отправлена</p>
        <p>Свяжемся с вами в течение рабочего дня. Коммерческое предложение направим в течение 24 часов.</p>
        <button type="button" className="rq-again" onClick={() => setStatus('idle')}>Отправить ещё одну</button>
      </div>
    );
  }

  const field = (name: Field, label: string, type: string, autoComplete: string, required = false) => (
    <p className="rq-f">
      <label htmlFor={`${id}-${name}`}>{label}{required && <b aria-hidden="true"> *</b>}</label>
      <input id={`${id}-${name}`} name={name} type={type} autoComplete={autoComplete} required={required}
        inputMode={type === 'tel' ? 'tel' : undefined} spellCheck={type === 'email' ? false : undefined}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${id}-${name}-e` : undefined} />
      {errors[name] && <span className="rq-err" id={`${id}-${name}-e`} role="alert">{errors[name]}</span>}
    </p>
  );

  return (
    // method/action нужны, если JS ещё не загрузился: тогда форма уходит POST-ом на API,
    // а не GET-ом, и имя с телефоном не попадают в адресную строку и логи.
    <form className="rq" method="post" action="/api/lead" noValidate onSubmit={onSubmit}>
      <div className="rq-row">
        {field('name', 'Как к вам обращаться', 'text', 'name', true)}
        {field('phone', 'Телефон', 'tel', 'tel', true)}
      </div>
      <div className="rq-row">
        {field('email', 'Почта', 'email', 'email')}
        <p className="rq-f">
          <label htmlFor={`${id}-company`}>Компания</label>
          <input id={`${id}-company`} name="company" type="text" autoComplete="organization" />
        </p>
      </div>
      <p className="rq-f">
        <label htmlFor={`${id}-message`}>Объект и задача</label>
        <textarea id={`${id}-message`} name="message" defaultValue={defaultBrief}
          placeholder="Тип объекта, площадь, адрес, срок. Можно ссылку на закупку." />
      </p>

      <label className="rq-ok">
        <input type="checkbox" name="consent" aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? `${id}-consent-e` : undefined} />
        <span>
          Согласен на обработку персональных данных в соответствии с{' '}
          <Link href="/privacy">политикой конфиденциальности</Link>
        </span>
      </label>
      {errors.consent && <span className="rq-err" id={`${id}-consent-e`} role="alert">{errors.consent}</span>}

      <input className="rq-hp" name="company_url" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {status === 'error' && (
        <p className="rq-fail" role="alert">
          Не удалось отправить заявку. Позвоните по номеру <a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>{' '}
          или напишите на <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      )}

      <button className="rq-go" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Отправляем…' : CTA}
      </button>
    </form>
  );
}
