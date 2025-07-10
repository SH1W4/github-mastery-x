# Script para preparar o repositório privado
# Este script configura o README apropriado para o repositório github-mastery-private

Write-Host "🔒 Preparando repositório privado..." -ForegroundColor Cyan

# Fazer backup do README atual
if (Test-Path "README.md") {
    Write-Host "📋 Fazendo backup do README atual..."
    Copy-Item "README.md" "README_GITFLOW.md" -Force
}

# Copiar README privado como principal
if (Test-Path "README_PRIVATE.md") {
    Write-Host "📝 Configurando README para repositório privado..."
    Copy-Item "README_PRIVATE.md" "README.md" -Force
    Write-Host "✅ README privado configurado!" -ForegroundColor Green
} else {
    Write-Host "❌ README_PRIVATE.md não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📊 Status dos arquivos README:" -ForegroundColor Yellow
Get-ChildItem "README*.md" | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor Gray
}

Write-Host "`n✅ Repositório privado preparado!" -ForegroundColor Green
Write-Host "💡 Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. git add README.md" -ForegroundColor Gray
Write-Host "  2. git commit -m 'docs: configurar README para repositório privado'" -ForegroundColor Gray
Write-Host "  3. git push private master" -ForegroundColor Gray
