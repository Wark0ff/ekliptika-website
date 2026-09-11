#!/usr/bin/env node



import { randomBytes, scryptSync } from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('Использование: node scripts/gen-admin-hash.mjs "ваш-пароль"');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Пароль слишком короткий — минимум 8 символов.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log('# Вставьте эти две строки в .env.production (или .env.local для разработки):');
console.log(`ADMIN_PASSWORD_HASH=${salt.toString('hex')}:${hash.toString('hex')}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString('hex')}`);
