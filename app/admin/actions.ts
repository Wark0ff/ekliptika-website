'use server';

import { redirect } from 'next/navigation';
import {
  verifyPassword,
  startSession,
  endSession,
  isLockedOut,
  recordFailure,
  clearFailures,
} from '@/lib/auth';

export type LoginState = { error?: string };


export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (isLockedOut()) {
    return { error: 'Слишком много попыток. Попробуйте через несколько минут.' };
  }

  const password = String(formData.get('password') ?? '');

  if (!process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_SESSION_SECRET) {
    return { error: 'Админка не настроена: не заданы ADMIN_PASSWORD_HASH / ADMIN_SESSION_SECRET.' };
  }

  if (!verifyPassword(password)) {
    recordFailure();
    return { error: 'Неверный пароль.' };
  }

  clearFailures();
  startSession();
  redirect('/admin');
}


export async function logout(): Promise<void> {
  endSession();
  redirect('/admin/login');
}
