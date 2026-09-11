import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEAD_TO } = process.env;

function clean(v: unknown, max = 2000) {
  return String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
}

/** Без JS браузер отправляет обычную форму: отвечаем редиректом на страницу контактов.
 *  Location относительный: за прокси req.url указывает на внутренний адрес (localhost). */
function back(ok: boolean) {
  return new Response(null, { status: 303, headers: { Location: ok ? '/contacts?sent=1' : '/contacts' } });
}

export async function POST(req: Request) {
  const type = req.headers.get('content-type') || '';
  const isForm = type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data');

  let body: Record<string, unknown>;
  try {
    body = isForm ? Object.fromEntries((await req.formData()).entries()) : await req.json();
  } catch {
    return isForm ? back(false) : NextResponse.json({ ok: false }, { status: 400 });
  }

  // Ловушка для ботов: скрытое поле заполнено, делаем вид, что всё хорошо.
  if (clean(body.company_url)) {
    return isForm ? back(true) : NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 200);
  const phone = clean(body.phone, 50);
  const email = clean(body.email, 200);
  const company = clean(body.company, 200);
  const tender = clean(body.tender ?? body.message, 4000);
  const page = clean(body.page ?? req.headers.get('referer'), 500);

  // Форма с JS проверяет согласие на клиенте, у формы без JS проверяем здесь.
  if (!name || !phone || (isForm && !body.consent)) {
    return isForm ? back(false) : NextResponse.json({ ok: false, error: 'validation' }, { status: 422 });
  }

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !LEAD_TO) {
    return isForm ? back(false) : NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    // reg.ru закрывает исходящие 25/465/587, открыт 2525 (см. deploy/README-deploy.md).
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
    email && `Почта: ${email}`,
    company && `Компания: ${company}`,
    tender && `\nОписание:\n${tender}`,
    page && `\nСтраница: ${page}`,
  ].filter(Boolean);

  try {
    await transporter.sendMail({
      from: `"Сайт Эклиптика" <${SMTP_USER}>`,
      to: LEAD_TO,
      replyTo: email || undefined,
      subject: `Заявка с сайта: ${name}`,
      text: lines.join('\n'),
    });
    return isForm ? back(true) : NextResponse.json({ ok: true });
  } catch {
    return isForm ? back(false) : NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }
}
