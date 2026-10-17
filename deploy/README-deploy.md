# Деплой «Эклиптики» на общий VPS

Сервер `185.182.110.38` (Рег.облако, Ubuntu 22.04, 3 ГБ RAM + 4 ГБ подкачки) общий с ТЕРА ГРУПП и агрегатором
тендеров. Схема как у ТЕРА ГРУПП: **Next.js на сервере не собираем**. Standalone собирается на компьютере,
на сервер едет готовый архив, systemd запускает `current/server.js`, nginx проксирует, сертификат Let's Encrypt.

| Что | Значение |
|---|---|
| Домен | `ekliptika.art` и `www.ekliptika.art` (reg.ru, A-записи на `185.182.110.38`) |
| Порт приложения | `127.0.0.1:3001` (3000 у ТЕРА ГРУПП, 8000 у тендеров) |
| Релизы | `/var/www/ekliptika/releases/<коммит>`, рабочий: ссылка `/var/www/ekliptika/current` |
| Данные админки | `/var/lib/ekliptika/content` (вне релизов) |
| Секреты | `/etc/ekliptika/env` (640 root:deploy) |
| Юнит | `/etc/systemd/system/ekliptika.service` |
| Nginx | `/etc/nginx/sites-available/ekliptika.art` + ссылка в `sites-enabled` |
| Пользователь | `deploy` |

## Соседи на сервере

- приложение слушает только `127.0.0.1`, порты в ufw не открываем;
- чужие файлы nginx не трогаем, `default_server` не ставим, перед reload всегда `nginx -t`;
- certbot только для своего домена;
- apt upgrade, перезагрузка, ufw и sshd только через ведущий чат ТЕРА ГРУПП и с согласия Сергея;
- всё, что удаляет или перезаписывает данные на сервере, согласуем с Сергеем.

Команды на сервере выполняются под `root` в SSH-сессии (`ssh root@185.182.110.38`). Перед вставкой
проверьте, что в приглашении `root@…` сервера, а не локальный PowerShell.

---

## 1. Сборка на компьютере

Из папки проекта, ветка `site` закоммичена (скрипт берёт код из git, а не из рабочей папки):

```powershell
powershell -ExecutionPolicy Bypass -File deploy\build-release.ps1
```

Что делает скрипт: `git archive site` во временную папку, `npm ci`, `next build` с публичными переменными
из `deploy/build.env`, кладёт `static` и `public` в standalone, меняет sharp win32 на linux-x64 (иначе на
сервере падают `/_next/image` и загрузка фото в админке), упаковывает в `ekliptika-<коммит>.tar.gz` и пишет
`.sha256`. Переменные `NEXT_PUBLIC_*` вшиваются при сборке: индексация и домен меняются в `deploy/build.env`
и пересборкой, а не на сервере.

```powershell
scp ekliptika-<коммит>.tar.gz ekliptika-<коммит>.tar.gz.sha256 deploy\release.sh root@185.182.110.38:/root/
```

## 2. Первая установка на сервере (один раз)

База (пользователь `deploy`, Node 22, nginx, certbot, ufw, swap) уже стоит. Проверка и свои папки:

```bash
id deploy && node -v && nginx -v && certbot --version
ss -ltnp | grep -E ':3001\b' || echo "3001 свободен"
mkdir -p /var/www/ekliptika/releases /var/lib/ekliptika/content /etc/ekliptika /var/www/certbot
chown -R deploy:deploy /var/www/ekliptika /var/lib/ekliptika
```

### Секреты

Значения вписывает человек на сервере. В чат, в git и в память их не пишем.

```bash
cat > /etc/ekliptika/env <<'EOF'
CONTENT_DIR=/var/lib/ekliptika/content

# Заявки: SMTP mail.ru, порт 2525
SMTP_HOST=smtp.mail.ru
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
LEAD_TO=

# Вход в админку: node scripts/gen-admin-hash.mjs "пароль" выдаёт обе строки
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
EOF
chown root:deploy /etc/ekliptika/env && chmod 640 /etc/ekliptika/env
```

| Переменная | Где | Что это |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `deploy/build.env` | `https://ekliptika.art`: canonical, sitemap, редирект на вход в админку |
| `NEXT_PUBLIC_INDEX` | `deploy/build.env` | пусто = `noindex` и закрытый robots; `1` открывает индексацию |
| `NEXT_PUBLIC_METRIKA_ID` | `deploy/build.env` | номер счётчика Метрики; пусто = без счётчика |
| `CONTENT_DIR` | сервер | `/var/lib/ekliptika/content` |
| `SMTP_HOST`, `SMTP_PORT` | сервер | `smtp.mail.ru`, `2525` |
| `SMTP_USER` | сервер | ящик-отправитель |
| `SMTP_PASS` | сервер | пароль для внешнего приложения (mail.ru: Настройки, Безопасность), не пароль от почты |
| `LEAD_TO` | сервер | куда приходят заявки (почта заказчика, её даст Сергей) |
| `ADMIN_PASSWORD_HASH` | сервер | `соль:хэш` в hex из `scripts/gen-admin-hash.mjs` |
| `ADMIN_SESSION_SECRET` | сервер | случайная hex-строка оттуда же |
| `SITE_ORIGIN` | сервер, по желанию | переопределяет домен редиректа на вход в админку |

Без SMTP сайт работает, а форма заявки честно отвечает ошибкой, так что выкладывать можно до появления
почты. Без `ADMIN_*` админка пишет «не настроена». После правки файла: `systemctl restart ekliptika`.

### Юнит

Юнит лежит в каждом архиве, ставим его до первой выкладки:

```bash
tar -xzOf /root/ekliptika-<коммит>.tar.gz ./deploy/ekliptika.service > /etc/systemd/system/ekliptika.service
systemctl daemon-reload && systemctl enable ekliptika
bash /root/ekliptika-release.sh /root/ekliptika-<коммит>.tar.gz   # распакует, запустит, дождётся 200
```

Лимиты памяти в юните: куча V8 до 256 МБ, `MemoryHigh=450M`, `MemoryMax=700M`.

### nginx

```bash
cp /var/www/ekliptika/current/deploy/nginx.conf /etc/nginx/sites-available/ekliptika.art
ln -s /etc/nginx/sites-available/ekliptika.art /etc/nginx/sites-enabled/ekliptika.art
nginx -t && systemctl reload nginx
curl -sI -H 'Host: ekliptika.art' http://127.0.0.1 | head -1
```

В конфиге только блок для порта 80: блок 443 без сертификата валит `nginx -t`, а на общем сервере это сломало
бы reload всем сайтам. Если `nginx -t` ругается, reload не делаем.

### HTTPS

```bash
dig +short ekliptika.art; dig +short www.ekliptika.art   # оба = 185.182.110.38
certbot --nginx --redirect -d ekliptika.art -d www.ekliptika.art
nginx -t && systemctl reload nginx
certbot renew --dry-run
```

## 3. Обновление

На компьютере: коммит в `site`, `deploy\build-release.ps1`, `scp` как в шаге 1. На сервере:

```bash
bash /root/ekliptika-release.sh /root/ekliptika-<коммит>.tar.gz
```

Скрипт проверяет sha256 и gzip, распаковывает в `releases/<коммит>`, переключает `current`, перезапускает
сервис и ждёт 200. Если ответа нет, он возвращает предыдущий релиз. Хранятся 3 последних релиза.
Ручной откат: `bash /root/ekliptika-release.sh --rollback <коммит>`.

## Проверка после запуска

- все публичные страницы отвечают 200 (`/`, `/about`, `/uslugi/<4 посадочные>`, `/portfolio`, `/blog`,
  `/contacts`, `/documents`, `/company-card`, `/privacy`, `/smeta`), несуществующая отдаёт 404;
- пока `NEXT_PUBLIC_INDEX` пуст: `noindex` в HTML и `Disallow: /` в robots;
- `/admin` уводит на `https://ekliptika.art/admin/login`, вход, выход и загрузка фото работают;
- `/_next/image` отдаёт webp (значит, sharp linux на месте);
- заявка: без SMTP форма показывает ошибку, с SMTP письмо приходит на `LEAD_TO`;
- `http://` и `www` уводят на `https://ekliptika.art`, сертификат валиден;
- terragroupmsk.ru после reload nginx открывается как раньше;
- вид на телефоне (375 px): шапка, меню, первый экран, форма.
