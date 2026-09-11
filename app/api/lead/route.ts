import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';



export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  LEAD_TO,
} = process.env;

function clean(v: unknown, max = 2000) {
  return String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }


  if (clean(body.company_url)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 200);
  const phone = clean(body.phone, 50);
  const email = clean(body.email, 200);
  const company = clean(body.company, 200);
  const tender = clean(body.tender, 4000);
  const page = clean(body.page, 500);

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }


  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !LEAD_TO) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,

    port: Number(SMTP_PORT) || 2525,
    secure: false,
    requireTLS: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },


    connectionTimeout: 7000,
    greetingTimeout: 7000,
    socketTimeout: 10000,
  });

  const lines = [
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    email && `Email: ${email}`,
    company && `Компания: ${company}`,
    tender && `\nОписание:\n${tender}`,
    page && `\nСтраница: ${page}`,
  ].filter(Boolean);

  try {
    await transporter.sendMail({
      from: `"Сайт Эклиптика" <${SMTP_USER}>`,
      to: LEAD_TO,
      replyTo: email || undefined,
      subject: `Заявка с сайта — ${name}`,
      text: lines.join('\n'),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
}
