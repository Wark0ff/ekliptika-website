import { NextResponse, type NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import sharp from 'sharp';
import { isAuthenticated } from '@/lib/auth';
import { UPLOADS_DIR, UPLOADS_URL } from '@/lib/content';


export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(req: NextRequest) {

  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Файл не передан' }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: 'Только JPEG, PNG или WebP' }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Файл больше 8 МБ' }, { status: 413 });
  }

  const input = Buffer.from(await file.arrayBuffer());



  let output: Buffer;
  try {
    output = await sharp(input)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: 'Не удалось обработать изображение' }, { status: 422 });
  }

  const name = `${Date.now()}-${randomBytes(6).toString('hex')}.webp`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, name), output);

  return NextResponse.json({ url: `${UPLOADS_URL}/${name}` });
}
