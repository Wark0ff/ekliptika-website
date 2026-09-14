import { NextResponse, type NextRequest } from 'next/server';

/**
 * Охрана админки. Работает ДО рендера страницы, поэтому защищённый контент
 * не попадает в ответ (в отличие от redirect() внутри layout, который отдаёт
 * 200 с уже отрисованным содержимым). Проверяет только подпись сессионного
 * пропуска — пароль (scrypt) сверяется в server action на Node-рантайме.
 *
 * Middleware исполняется на edge, поэтому HMAC — через Web Crypto, а не
 * node:crypto. Формат токена совпадает с lib/auth.ts: exp.nonce.sig.
 */

const COOKIE = 'ekl_admin';

function b64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Сравнение строк без утечки времени. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function isValidToken(token: string | undefined, secret: string | undefined): Promise<boolean> {
  if (!token || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  const payload = `${exp}.${nonce}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  if (!safeEqual(sig, b64url(mac))) return false;
  return Number(exp) > Date.now();
}

export async function middleware(req: NextRequest) {
  const valid = await isValidToken(req.cookies.get(COOKIE)?.value, process.env.ADMIN_SESSION_SECRET);
  if (valid) return NextResponse.next();

  // Куда редиректить на страницу входа. За reverse-прокси Next в standalone
  // отдаёт внутренний адрес (localhost:3000) и в req.nextUrl, и в заголовке
  // Host — поэтому не полагаемся на них: в проде берём известный домен,
  // в разработке — origin запроса (localhost). SITE_ORIGIN в .env
  // переопределяет домен, если он поменяется.
  const origin =
    process.env.SITE_ORIGIN ||
    (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) || req.nextUrl.origin;
  return NextResponse.redirect(`${origin}/admin/login`);
}

// Охраняем сам /admin и всё под ним, кроме страницы входа.
export const config = {
  matcher: ['/admin', '/admin/((?!login$).*)'],
};
