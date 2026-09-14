# Деплой «Эклиптики» на VPS (Ubuntu 22.04)

Схема такая же, как у ТЕРА ГРУПП: Next.js в режиме standalone, systemd-юнит, nginx как обратный прокси,
сертификат Let's Encrypt. Каждую команду на сервере выполняем под `root`, если не сказано иное.
Плейсхолдеры: `IP_СЕРВЕРА`, `ДОМЕН`, `ПОЧТА_ДЛЯ_ЗАЯВОК`.

> Команды с сервера выполняются в SSH-сессии. Перед вставкой серверного блока проверьте, что в приглашении
> стоит `root@…` сервера, а не локальный PowerShell.

---

## 1. Сервер (один раз)

```bash
apt update && apt upgrade -y
timedatectl set-timezone Europe/Moscow
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
adduser --disabled-password --gecos "" deploy

apt install -y ufw && ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw --force enable

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx
mkdir -p /var/www/certbot
node -v   # v22.x, нужен Node 20.11 или новее
```

Если сайт ставится на тот же VPS, что и ТЕРА ГРУПП, пропустите этот шаг и возьмите свободный порт,
например 3001: `PORT=3001` в `deploy/ekliptika.service`, оба `proxy_pass` в `deploy/nginx.conf`
и адрес в проверке `curl` из шага 6.

## 2. Папки

```bash
mkdir -p /var/www/ekliptika /var/lib/ekliptika/content
chown -R deploy:deploy /var/www/ekliptika /var/lib/ekliptika
```

`/var/lib/ekliptika/content` хранит объекты, статьи и загруженные фото из админки. Папка лежит вне каталога
деплоя, поэтому обновления сайта её не стирают.

## 3. Код: только архивом из git

Архив собираем из закоммиченного состояния. Архив из рабочей папки однажды обрезался посреди записи
и уронил сайт ТЕРА ГРУПП.

С компьютера, из папки проекта (PowerShell):

```powershell
git archive --format=tar.gz -o site.tar.gz site
tar -tzf site.tar.gz | Measure-Object -Line
scp site.tar.gz root@IP_СЕРВЕРА:/root/
```

На сервере:

```bash
gzip -t /root/site.tar.gz && echo OK
tar -xzf /root/site.tar.gz -C /var/www/ekliptika
chown -R deploy:deploy /var/www/ekliptika
```

## 4. Переменные окружения

```bash
cat > /var/www/ekliptika/.env.production <<'EOF'
NEXT_PUBLIC_SITE_URL=https://ДОМЕН
NEXT_PUBLIC_INDEX=1
NEXT_PUBLIC_METRIKA_ID=

# Заявки: SMTP mail.ru. reg.ru режет исходящие 25/465/587, открыт 2525.
SMTP_HOST=smtp.mail.ru
SMTP_PORT=2525
SMTP_USER=ПОЧТА_ДЛЯ_ЗАЯВОК
SMTP_PASS=
LEAD_TO=ПОЧТА_ДЛЯ_ЗАЯВОК

# Хранилище админки вне каталога деплоя
CONTENT_DIR=/var/lib/ekliptika/content

# Вход в админку: node scripts/gen-admin-hash.mjs "пароль"
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
EOF
chown deploy:deploy /var/www/ekliptika/.env.production && chmod 600 /var/www/ekliptika/.env.production
```

`SMTP_PASS` это пароль для внешнего приложения (mail.ru: Настройки, Безопасность, Пароли для внешних
приложений), а не пароль от почты. Переменные `NEXT_PUBLIC_*` вшиваются при сборке: заполните их до `npm run build`.

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
curl -I http://127.0.0.1:3000
```

## 7. nginx и HTTPS

```bash
sed 's/__DOMAIN__/ДОМЕН/g' /var/www/ekliptika/deploy/nginx.conf > /etc/nginx/sites-available/ekliptika
ln -s /etc/nginx/sites-available/ekliptika /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d ДОМЕН -d www.ДОМЕН
```

DNS: записи `A @` и `A www` на `IP_СЕРВЕРА`, сертификат выпускать после того, как `dig +short ДОМЕН` вернёт IP.

## Обновление

```bash
cp /var/www/ekliptika/.env.production /root/env.keep
mv /var/www/ekliptika /var/www/ekliptika.old && mkdir -p /var/www/ekliptika
gzip -t /root/site.tar.gz && tar -xzf /root/site.tar.gz -C /var/www/ekliptika
cp /root/env.keep /var/www/ekliptika/.env.production && chown -R deploy:deploy /var/www/ekliptika
su - deploy -c "cd /var/www/ekliptika && npm ci && npm run build \
  && cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public"
test -f /var/www/ekliptika/.next/standalone/server.js && systemctl restart ekliptika
```

Откат: `/var/www/ekliptika.old`. После проверки удалить. Кэш картинок после деплоя холодный, первые
просмотры медленнее.

## Проверка после запуска

- главная и `/uslugi/remont-kvartir-i-domov` отвечают 200;
- `/admin` уводит на `/admin/login`;
- тестовая заявка с сайта приходит на почту;
- в Яндекс Метрике создана цель JavaScript-событие `lead`.
