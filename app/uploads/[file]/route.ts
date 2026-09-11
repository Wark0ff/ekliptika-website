import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { UPLOADS_DIR } from '@/lib/content';


export const runtime = 'nodejs';


export async function GET(_req: Request, props: { params: Promise<{ file: string }> }) {
  const params = await props.params;
  const name = params.file;
  if (!/^[a-zA-Z0-9_-]+\.webp$/.test(name)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, name));
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'image/webp',

        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
