param(
    [switch]$Interactive
)

Write-Host "=== GitHub Token Setup ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se .env existe
$envPath = Join-Path $PSScriptRoot ".." ".env"

if (Test-Path $envPath) {
    Write-Host "Arquivo .env já existe." -ForegroundColor Yellow
    $overwrite = Read-Host "Deseja sobrescrever? (s/n)"
    if ($overwrite -ne 's' -and $overwrite -ne 'S') {
        Write-Host "Configuração cancelada." -ForegroundColor Red
        exit 0
    }
}

# Verificar se já existe um token no ambiente
if ($env:GITHUB_TOKEN) {
    Write-Host "GITHUB_TOKEN já está configurado no ambiente." -ForegroundColor Green
    $useExisting = Read-Host "Deseja usar o token existente? (s/n)"
    if ($useExisting -eq 's' -or $useExisting -eq 'S') {
        $token = $env:GITHUB_TOKEN
    }
}

# Se não tiver token ou for interativo, pedir ao usuário
if (-not $token -or $Interactive) {
    Write-Host ""
    Write-Host "Para obter um GitHub Personal Access Token:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://github.com/settings/tokens/new"
    Write-Host "2. Dê um nome ao token (ex: GitHub Mastery)"
    Write-Host "3. Selecione os escopos necessários:"
    Write-Host "   - repo (acesso completo aos repositórios)"
    Write-Host "   - user (ler informações do usuário)"
    Write-Host "   - workflow (atualizar GitHub Actions)"
    Write-Host "4. Clique em 'Generate token'"
    Write-Host "5. Copie o token gerado"
    Write-Host ""
    
    $token = Read-Host "Cole seu GitHub Token aqui" -AsSecureString
    $token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
    )
}

if (-not $token) {
    Write-Host "Token não fornecido. Configuração cancelada." -ForegroundColor Red
    exit 1
}

# Criar conteúdo do .env
$envContent = @"
# GitHub Configuration
GITHUB_TOKEN=$token
GITHUB_USERNAME=$env:USERNAME

# MCP Configuration
MCP_SERVER_PORT=3000
MCP_SERVER_NAME=github-mastery

# Feature Flags
ENABLE_AI_SUGGESTIONS=true
ENABLE_HEALTH_MONITORING=true
ENABLE_GIDEN_INTEGRATION=true

# Logging
LOG_LEVEL=info
DEBUG=false

# API Configuration
API_RATE_LIMIT=5000
API_TIMEOUT=30000

# Security
ENABLE_ENCRYPTION=true
SESSION_SECRET=$(New-Guid).ToString()
"@

# Salvar .env
$envContent | Out-File -FilePath $envPath -Encoding UTF8

Write-Host ""
Write-Host "✅ Arquivo .env criado com sucesso!" -ForegroundColor Green
Write-Host "✅ GITHUB_TOKEN configurado!" -ForegroundColor Green

# Verificar se .gitignore inclui .env
$gitignorePath = Join-Path $PSScriptRoot ".." ".gitignore"
if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath -Raw
    if ($gitignoreContent -notmatch "\.env") {
        Add-Content -Path $gitignorePath -Value "`n.env"
        Write-Host "✅ .env adicionado ao .gitignore" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Configuração concluída!" -ForegroundColor Cyan
Write-Host "Execute 'npm run validate-env' para verificar a configuração." -ForegroundColor Yellow
