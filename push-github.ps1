# Script para fazer push da estrutura para o GitHub
# Uso: .\push-github.ps1

$repo_url = "https://github.com/rafaelrochaadvocacia-gif/blog-rrs-advocacia.git"
$script_dir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "🚀 Iniciando push para GitHub..." -ForegroundColor Cyan
Write-Host "Repositório: $repo_url" -ForegroundColor Gray

# 1. Inicializar git (se não existir)
if (-not (Test-Path "$script_dir\.git")) {
    Write-Host "`n1️⃣ Inicializando repositório git..." -ForegroundColor Yellow
    Push-Location $script_dir
    & git init
    & git remote add origin $repo_url
    Pop-Location
} else {
    Write-Host "`n1️⃣ Repositório git já existe" -ForegroundColor Green
}

# 2. Configurar git (se necessário)
Write-Host "`n2️⃣ Configurando git..." -ForegroundColor Yellow
Push-Location $script_dir
$user_name = & git config user.name 2>$null
$user_email = & git config user.email 2>$null

if (-not $user_name) {
    & git config user.name "Rafael Rocha"
}
if (-not $user_email) {
    & git config user.email "rafaelrochaadvocacia@gmail.com"
}

Write-Host "   Nome: $(& git config user.name)" -ForegroundColor Gray
Write-Host "   Email: $(& git config user.email)" -ForegroundColor Gray

# 3. Adicionar arquivos
Write-Host "`n3️⃣ Adicionando arquivos..." -ForegroundColor Yellow
& git add .
$status = & git status --short
if ($status) {
    Write-Host "   Arquivos a fazer commit:" -ForegroundColor Gray
    Write-Host $status -ForegroundColor Gray
} else {
    Write-Host "   Nenhum arquivo novo para commit" -ForegroundColor Gray
}

# 4. Criar commit
Write-Host "`n4️⃣ Criando commit..." -ForegroundColor Yellow
$commit_msg = "Estrutura inicial: scripts, briefings e diretrizes para tarefas agendadas de blog"
& git commit -m $commit_msg 2>&1 | Write-Host -ForegroundColor Gray

# 5. Fazer push
Write-Host "`n5️⃣ Fazendo push para GitHub..." -ForegroundColor Yellow
& git branch -M main
& git push -u origin main 2>&1 | Write-Host -ForegroundColor Gray

Write-Host "`n✅ Push concluído!" -ForegroundColor Green
Write-Host "Repositório: $repo_url" -ForegroundColor Cyan

Pop-Location
