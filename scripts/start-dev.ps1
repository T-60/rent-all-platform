# 🚀 Script de desarrollo en PowerShell

Write-Host "🏠 INICIANDO ENTORNO DE DESARROLLO..." -ForegroundColor Green

# 1. Configurar ambiente
Write-Host "⚙️ Configurando ambiente..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    if (Test-Path ".env.development") {
        Copy-Item ".env.development" ".env.local"
        Write-Host "✅ Configuración aplicada" -ForegroundColor Green
    } else {
        Copy-Item ".env.example" ".env.local"
        Write-Host "⚠️ Usando configuración de ejemplo" -ForegroundColor Yellow
    }
}

# 2. Matar procesos previos
Write-Host "🔄 Limpiando procesos..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 3. Iniciar backend
Write-Host "🔧 Iniciando backend..." -ForegroundColor Cyan
Set-Location "backend"
Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Minimized
Set-Location ".."

# 4. Esperar backend
Write-Host "⏳ Esperando backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 5. Verificar backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend funcionando" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend no responde" -ForegroundColor Red
    Read-Host "Presiona Enter para continuar"
    exit 1
}

# 6. Iniciar frontend
Write-Host "🎨 Iniciando frontend..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run","dev" -WindowStyle Minimized

# 7. Esperar frontend
Write-Host "⏳ Esperando frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "🎉 ¡ENTORNO LISTO!" -ForegroundColor Green
Write-Host "🌐 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Para parar: npm run dev:stop:windows" -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona Enter para continuar"
