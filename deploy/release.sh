#!/usr/bin/env bash
# Выкладка готового артефакта НА СЕРВЕРЕ (под root). Сборки здесь нет.
#   bash /root/release.sh /root/ekliptika-<sha>.tar.gz
#
# Раскладка:
#   /var/www/ekliptika/releases/<sha>/   распакованные релизы
#   /var/www/ekliptika/current           ссылка на рабочий релиз (её запускает systemd)
#   /etc/ekliptika/env                   секреты и настройки, вне релизов
#   /var/lib/ekliptika/content           контент админки и загрузки, вне релизов
# Откат: bash /root/release.sh --rollback <sha>
set -euo pipefail

BASE=/var/www/ekliptika
REL="$BASE/releases"

switch_to() {
  ln -sfn "$REL/$1" "$BASE/current.tmp"
  mv -Tf "$BASE/current.tmp" "$BASE/current"
  systemctl restart ekliptika
  for i in $(seq 1 30); do
    code="$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3001/ || true)"
    [ "$code" = "200" ] && { echo "OK: релиз $1 отвечает 200"; return 0; }
    sleep 1
  done
  echo "ОШИБКА: релиз $1 не ответил 200 за 30 с (последний код: $code)"
  return 1
}

if [ "${1:-}" = "--rollback" ]; then
  test -d "$REL/${2:?укажи sha}" || { echo "нет релиза $2"; ls "$REL"; exit 1; }
  switch_to "$2"; exit
fi

ART="${1:?путь к ekliptika-<sha>.tar.gz}"
if [ -f "$ART.sha256" ]; then (cd "$(dirname "$ART")" && sha256sum -c "$(basename "$ART").sha256"); fi
gzip -t "$ART"

SHA="$(basename "$ART" .tar.gz)"; SHA="${SHA#ekliptika-}"
DEST="$REL/$SHA"
PREV="$(readlink -f "$BASE/current" 2>/dev/null || true)"

mkdir -p "$REL"
rm -rf "$DEST.tmp"; mkdir -p "$DEST.tmp"
tar -xzf "$ART" -C "$DEST.tmp"
test -f "$DEST.tmp/server.js" || { echo "ОШИБКА: в архиве нет server.js"; exit 1; }
test -d "$DEST.tmp/node_modules/@img/sharp-linux-x64" || { echo "ОШИБКА: нет sharp для linux"; exit 1; }
rm -rf "$DEST"; mv "$DEST.tmp" "$DEST"
chown -R deploy:deploy "$DEST"

if ! switch_to "$SHA"; then
  if [ -n "$PREV" ] && [ "$PREV" != "$DEST" ]; then
    echo "Возвращаю предыдущий релиз $(basename "$PREV")"
    switch_to "$(basename "$PREV")"
  fi
  journalctl -u ekliptika -n 30 --no-pager
  exit 1
fi

# держим 3 последних релиза, текущий не трогаем
ls -1dt "$REL"/*/ | tail -n +4 | while read -r d; do
  [ "$(readlink -f "$d")" = "$(readlink -f "$BASE/current")" ] || rm -rf "$d"
done
echo "Релизы: $(ls -1 "$REL" | tr '\n' ' ')"
