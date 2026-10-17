# Деплой «Эклиптики» на общий VPS (Ubuntu 22.04)

Сайт стоит на одном сервере с ТЕРА ГРУПП и агрегатором тендеров. Схема как у ТЕРА ГРУПП: Next.js в режиме
standalone, systemd-юнит, nginx как обратный прокси, сертификат Let's Encrypt.

| Что | Значение |
|---|---|
| Домен | `ekliptika.art` и `www.ekliptika.art` (reg.ru, DNS ns1/ns2.reg.ru) |
| Порт приложения | `3001` (3000 занят ТЕРА ГРУПП) |
| Код | `/var/www/ekliptika` |
| Данные админки | `/var/lib/ekliptika/content` (вне каталога кода) |
| Юнит | `/etc/systemd/system/ekliptika.service` |
| Nginx | `/etc/nginx/sites-available/ekliptika` |
| Пользователь | `deploy` |

Чужие конфиги (`teragroup`, `tenders`, `default`) не трогаем. Команды на сервере выполняются под `root`
в SSH-сессии: перед вставкой проверьте, что в приглашении `root@…` сервера, а не локальный PowerShell.
Плейсхолдер: `IP_СЕРВЕРА`.

---

## 1. Сервер

Базу (пользователь `deploy`, ufw, Node 22, nginx, certbot, swap) ставит ведущий чат ТЕРА ГРУПП.
Здесь только проверка, что она на месте:

```bash
id deploy && node -v && nginx -v && certbot --version
ss -ltnp | grep -E ':300[0-9]'   # 3001 должен быть свободен
mkdir -p /var/www/certbot
```

## 2. Папки

```bash
mkdir -p /var/www/ekliptika /var/lib/ekliptika/content
chown -R deploy:deploy /var/www/ekliptika /var/lib/ekliptika
```

`/var/lib/ekliptika/content` хранит объекты, статьи и загруженные фото из админки. Обновления сайта её
не стирают. На свежем сервере папка пустая, сайт стартует с сидов из `lib/data`.

## 3. Код: только архивом из git

Архив собираем из закоммиченного состояния ветки `site`. Архив из рабочей папки однажды обрезался
посреди записи и уронил сайт ТЕРА ГРУПП.

С компьютера, из папки проекта (PowerShell):

```powershell
git archive --format=tar.gz -o site.tar.gz site
tar -tzf site.tar.gz | Measure-Object -Line
scp site.tar.gz root@IP_СЕРВЕРА:/root/ekliptika.tar.gz
```

На сервере:

```bash
gzip -t /root/ekliptika.tar.gz && echo OK
tar -xzf /root/ekliptika.tar.gz -C /var/www/ekliptika
chown -R deploy:deploy /var/www/ekliptika
```

## 4. Переменные окружения

Значения в файл вписывает человек на сервере. В чат, в git и в память их не пишем.

```bash
cat > /var/www/ekliptika/.env.production <<'EOF'
NEXT_PUBLIC_SITE_URL=https://ekliptika.art
# Индексация закрыта до приёмки сайта заказчиком. Открыть: =1 и пересобрать.
NEXT_PUBLIC_INDEX=
NEXT_PUBLIC_METRIKA_ID=

# Заявки: SMTP mail.ru. reg.ru режет исходящие 25/465/587, открыт 2525.
SMTP_HOST=smtp.mail.ru
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
LEAD_TO=

CONTENT_DIR=/var/lib/ekliptika/content

# Вход в админку: node scripts/gen-admin-hash.mjs "пароль" выдаёт обе строки
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
EOF
chown deploy:deploy /var/www/ekliptika/.env.production && chmod 600 /var/www/ekliptika/.env.production
```

| Переменная | Обязательна | Что это |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | да | `https://ekliptika.art`: canonical, sitemap, редирект на вход в админку |
| `NEXT_PUBLIC_INDEX` | нет | пусто = `noindex` на всём сайте; `1` открывает индексацию |
| `NEXT_PUBLIC_METRIKA_ID` | нет | номер счётчика Яндекс Метрики; пусто = без счётчика |
| `SMTP_HOST`, `SMTP_PORT` | для заявок | `smtp.mail.ru`, `2525` |
| `SMTP_USER` | для заявок | ящик-отправитель |
| `SMTP_PASS` | для заявок | пароль для внешнего приложения (mail.ru: Настройки, Безопасность), не пароль от почты |
| `LEAD_TO` | для заявок | куда приходят заявки (почта заказчика, её даст Сергей) |
| `CONTENT_DIR` | да | `/var/lib/ekliptika/content` |
| `ADMIN_PASSWORD_HASH` | для админки | `соль:хэш` в hex из `scripts/gen-admin-hash.mjs` |
| `ADMIN_SESSION_SECRET` | для админки | случайная hex-строка оттуда же |
| `SITE_ORIGIN` | нет | переопределяет домен редиректа на вход, если он сменится |

Без SMTP-переменных сайт работает, а форма заявки честно отвечает ошибкой. Значит, выкладывать можно
до того, как появится почта заказчика. В значениях не используйте `$`: Next разворачивает его как
переменную. Переменные `NEXT_PUBLIC_*` вшиваются при сборке, поэтому после их правки нужна пересборка.

## 5. Сборка

```bash
su - deploy -c "cd /var/www/ekliptika && npm ci && npm run build \
  && cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public"
test -f /var/www/ekliptika/.next/standalone/server.js && echo BUILD_OK
```

## 6. systemd

```bash
cp /var/www/ekliptika/deploy/ekliptika.service /etc/systemd/system/ekliptika.service
systemctl daemon-reload && systemctl enable --now ekliptika
systemctl status ekliptika --no-pager
curl -sI http://127.0.0.1:3001 | head -1
```

## 7. nginx

```bash
cp /var/www/ekliptika/deploy/nginx.conf /etc/nginx/sites-available/ekliptika
ln -s /etc/nginx/sites-available/ekliptika /etc/nginx/sites-enabled/ekliptika
nginx -t && systemctl reload nginx
curl -sI -H 'Host: ekliptika.art' http://127.0.0.1 | head -1
```

Если `nginx -t` ругается, reload не делаем: сломанный конфиг уронит и соседние сайты. Убрать симлинк и
разобраться.

## 8. DNS и HTTPS

В reg.ru, зона `ekliptika.art`: записи `A @` и `A www` перевести с заглушки `95.163.244.138` на
`IP_СЕРВЕРА`. Сертификат выпускать, только когда оба имени смотрят на сервер:

```bash
dig +short ekliptika.art; dig +short www.ekliptika.art   # оба = IP_СЕРВЕРА
certbot --nginx --redirect -d ekliptika.art -d www.ekliptika.art
nginx -t && systemctl reload nginx
certbot renew --dry-run
```

## Обновление

```bash
cp /var/www/ekliptika/.env.production /root/ekliptika.env.keep
mv /var/www/ekliptika /var/www/ekliptika.old && mkdir -p /var/www/ekliptika
gzip -t /root/ekliptika.tar.gz && tar -xzf /root/ekliptika.tar.gz -C /var/www/ekliptika
cp /root/ekliptika.env.keep /var/www/ekliptika/.env.production && chown -R deploy:deploy /var/www/ekliptika
su - deploy -c "cd /var/www/ekliptika && npm ci && npm run build \
  && cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public"
test -f /var/www/ekliptika/.next/standalone/server.js && systemctl restart ekliptika
```

Откат: `/var/www/ekliptika.old`. Перед следующим обновлением старую копию убрать (согласовать с Сергеем).
Кэш картинок после деплоя холодный, первые просмотры медленнее.

## Проверка после запуска

- все публичные страницы отвечают 200, несуществующая отдаёт 404;
- в ответе есть `noindex`, пока `NEXT_PUBLIC_INDEX` пуст: `curl -s https://ekliptika.art | grep -o 'noindex'`;
- `/admin` уводит на `https://ekliptika.art/admin/login`, вход и выход работают, фото загружается;
- заявка: без SMTP форма показывает ошибку; с SMTP письмо приходит на `LEAD_TO`;
- `http://` и `www` уводят на `https://ekliptika.art`, сертификат валиден;
- сайт ТЕРА ГРУПП после reload nginx открывается как раньше;
- вид на телефоне (375 px): шапка, меню, первый экран, форма;
- когда появится Метрика: цель JavaScript-событие `lead`.
