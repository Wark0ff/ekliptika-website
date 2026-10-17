# Сборка готового артефакта Эклиптики для Linux-сервера на Windows-компьютере.
# На сервере Next.js не собираем: заливаем готовый standalone.
#
# Запуск из папки проекта:  powershell -ExecutionPolicy Bypass -File deploy\build-release.ps1
# Результат: ekliptika-release.tar.gz в папке проекта (в .gitignore).
#
# Код берётся из закоммиченной ветки site (git archive), а не из рабочей папки.
# sharp нативный: после сборки на Windows в standalone лежат бинарники win32,
# поэтому скрипт докладывает linux-x64 (glibc) и убирает win32.

$ErrorActionPreference = 'Stop'
$branch = 'site'
$project = (Resolve-Path "$PSScriptRoot\..").Path
$work = Join-Path $env:TEMP ("ekliptika-release-" + (Get-Date -Format 'yyyyMMdd-HHmmss'))
$src = Join-Path $work 'src'
$out = Join-Path $project 'ekliptika-release.tar.gz'

function Run($exe, [string[]]$argv) {
  & $exe @argv
  if ($LASTEXITCODE -ne 0) { throw "$exe $($argv -join ' ') -> код $LASTEXITCODE" }
}

New-Item -ItemType Directory -Force $src | Out-Null
$commit = (git -C $project rev-parse --short $branch).Trim()
Write-Host "Ветка $branch, коммит $commit, папка сборки $work"

# 1. Код из git
Run git @('-C', $project, 'archive', '--format=tar', '-o', "$work\src.tar", $branch)
Run tar @('-xf', "$work\src.tar", '-C', $src)

# 2. Публичные переменные сборки
Copy-Item "$src\deploy\build.env" "$src\.env.production"

# 3. Сборка
Push-Location $src
try {
  Run npm @('ci', '--no-audit', '--no-fund')
  Run npm @('run', 'build')
} finally { Pop-Location }

$sa = Join-Path $src '.next\standalone'
if (-not (Test-Path "$sa\server.js")) { throw 'Нет .next\standalone\server.js' }
Copy-Item -Recurse "$src\.next\static" "$sa\.next\static"
Copy-Item -Recurse "$src\public" "$sa\public"
New-Item -ItemType Directory -Force "$sa\deploy" | Out-Null
Copy-Item "$src\deploy\ekliptika.service", "$src\deploy\nginx.conf" "$sa\deploy\"
# Секретов в артефакте быть не должно, переменные сервера идут из EnvironmentFile.
Remove-Item -Force -ErrorAction SilentlyContinue "$sa\.env.production", "$sa\.env", "$sa\.env.local"

# 4. sharp под Linux, той же версии, что в lockfile
$lock = Get-Content "$src\package-lock.json" -Raw | ConvertFrom-Json
$sharpVer = $lock.packages.'node_modules/sharp'.version
$linux = Join-Path $work 'sharp-linux'
New-Item -ItemType Directory -Force $linux | Out-Null
Push-Location $linux
try {
  '{"name":"sharp-linux","private":true}' | Out-File -Encoding ascii package.json
  Run npm @('install', "sharp@$sharpVer", '--os=linux', '--cpu=x64', '--libc=glibc', '--no-audit', '--no-fund', '--no-package-lock')
} finally { Pop-Location }
$img = Join-Path $sa 'node_modules\@img'
New-Item -ItemType Directory -Force $img | Out-Null
Get-ChildItem $img -Directory | Where-Object { $_.Name -like 'sharp-*win32*' } | Remove-Item -Recurse -Force
foreach ($p in 'sharp-linux-x64', 'sharp-libvips-linux-x64') {
  $from = Join-Path $linux "node_modules\@img\$p"
  if (-not (Test-Path $from)) { throw "Не скачался @img/$p" }
  Copy-Item -Recurse -Force $from "$img\$p"
}

# 5. Метка версии и архив
"$branch $commit $(Get-Date -Format 's')" | Out-File -Encoding ascii "$sa\RELEASE"
if (Test-Path $out) { Remove-Item -Force $out }
Run tar @('-czf', $out, '-C', $sa, '.')
$n = (tar -tzf $out | Measure-Object -Line).Lines
$mb = [math]::Round((Get-Item $out).Length / 1MB, 1)
Write-Host "Готово: $out, файлов $n, $mb МБ, коммит $commit"
Write-Host "Папку сборки можно удалить: $work"
