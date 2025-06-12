@echo off
REM 🚀 SCRIPT DE INICIO RÁPIDO PARA DEMO - WINDOWS
REM ===============================================

echo 🎯 INICIANDO DEMO RENT+ALL - WINDOWS
echo =====================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no encontrado. Instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si PNPM está instalado
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PNPM no encontrado. Instalando PNPM...
    npm install -g pnpm
    if %errorlevel% neq 0 (
        echo ❌ Error instalando PNPM
        pause
        exit /b 1
    )
)

echo ✅ Dependencias verificadas
echo.

REM Obtener IP local de Windows
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do set "ip=%%a"
set "ip=%ip: =%"

if "%ip%"=="" (
    echo ⚠️  No se pudo detectar IP automáticamente
    echo 🔧 Usando localhost como respaldo
    set "ip=localhost"
) else (
    echo 📍 IP detectada automáticamente: %ip%
)

echo.
echo 🌐 CONFIGURACIÓN DE RED:
echo ========================
echo 🔗 Frontend: http://%ip%:3000
echo 🔧 Backend:  http://%ip%:3001
echo 🧪 Health:   http://%ip%:3001/api/health
echo.

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: Ejecuta este script desde el directorio raíz del proyecto
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Error: Directorio backend no encontrado
    pause
    exit /b 1
)

echo 🚀 INICIANDO SERVIDORES...
echo ==========================

REM Matar procesos existentes en los puertos
echo 🔧 Liberando puertos 3000 y 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1

REM Iniciar backend
echo 🔧 Iniciando backend en puerto 3001...
cd backend
start /b node server.js > ../backend.log 2>&1
cd ..

REM Esperar que el backend inicie
echo ⏳ Esperando backend (5 segundos)...
timeout /t 5 /nobreak >nul

echo ✅ Backend iniciado
echo.

REM Iniciar frontend
echo 🎯 Iniciando frontend en puerto 3000...
start /b pnpm dev --hostname 0.0.0.0 > frontend.log 2>&1

REM Esperar que el frontend inicie
echo ⏳ Esperando frontend (15 segundos)...
timeout /t 15 /nobreak >nul

echo.
echo 🎉 ¡SERVIDORES INICIADOS EXITOSAMENTE!
echo ======================================
echo.
echo 📱 URLS PARA COMPARTIR:
echo 🔗 Aplicación Principal: http://%ip%:3000
echo 🔧 API Backend:          http://%ip%:3001
echo 🧪 Health Check:         http://%ip%:3001/api/health
echo.
echo 📋 INSTRUCCIONES PARA DEMO:
echo 1. Comparte http://%ip%:3000 con dispositivos demo
echo 2. Abre la app en tu navegador: http://%ip%:3000
echo 3. Prueba registro/login desde móvil
echo 4. Navega por productos desde diferentes dispositivos
echo.

REM Abrir automáticamente en navegador
start http://%ip%:3000

echo 🌐 Aplicación abierta en navegador...
echo.
echo 🚨 PARA DETENER: Cierra esta ventana o presiona Ctrl+C
echo 🔄 Servidores ejecutándose...
echo.

pause
