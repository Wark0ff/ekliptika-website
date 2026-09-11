'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login, type LoginState } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold mt-6 w-full disabled:opacity-60">
      {pending ? 'Проверяем…' : 'Войти'}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState<LoginState, FormData>(login, {});

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5 text-paper">
      <div className="w-full max-w-sm">
        <p className="label-gold">Эклиптика</p>
        <h1 className="mt-3 text-2xl font-black uppercase">Панель управления</h1>
        <p className="mt-2 text-sm text-paper/50">Добавление кейсов и статей блога.</p>

        <form action={formAction} className="mt-8">
          <label htmlFor="password" className="label text-paper/60">
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            className="mt-2 w-full rounded-sm border border-lineDark bg-coal px-4 py-3 text-paper outline-none transition-colors focus:border-gold"
          />

          {state.error && (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
