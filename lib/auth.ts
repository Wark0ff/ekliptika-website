import 'server-only';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies, headers, type UnsafeUnwrappedCookies, type UnsafeUnwrappedHeaders } from 'next/headers';



const COOKIE = 'ekl_admin';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;



export function verifyPassword(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored || !password) return false;
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}


function sign(payload: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function createToken(): string {
  const exp = String(Date.now() + SESSION_TTL_MS);
  const nonce = randomBytes(8).toString('hex');
  const payload = `${exp}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [exp, nonce, sig] = parts;
  const payload = `${exp}.${nonce}`;
  const expected = sign(payload);

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}


export function startSession(): void {
  (cookies() as unknown as UnsafeUnwrappedCookies).set(COOKIE, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function endSession(): void {
  (cookies() as unknown as UnsafeUnwrappedCookies).delete(COOKIE);
}


export function isAuthenticated(): boolean {
  return verifyToken((cookies() as unknown as UnsafeUnwrappedCookies).get(COOKIE)?.value);
}


type Attempt = { count: number; until: number };
const attempts = new Map<string, Attempt>();
const MAX_FAILS = 5;
const LOCK_MS = 10 * 60 * 1000;

function clientIp(): string {
  const h = (headers() as unknown as UnsafeUnwrappedHeaders);




  const real = h.get('x-real-ip');
  if (real) return real.trim();
  const xff = h.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',');
    return parts[parts.length - 1].trim();
  }
  return 'unknown';
}


export function isLockedOut(): boolean {
  const a = attempts.get(clientIp());
  return !!a && a.until > Date.now();
}

export function recordFailure(): void {
  const ip = clientIp();
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.until > now) {
    a.count += 1;
    return;
  }
  const count = (a?.count ?? 0) + 1;
  attempts.set(ip, { count, until: count >= MAX_FAILS ? now + LOCK_MS : 0 });
}

export function clearFailures(): void {
  attempts.delete(clientIp());
}
