@echo off
REM 🚀 SCRIPT DE DESARROLLO PARA WINDOWS

echo 🏠 INICIANDO ENTORNO DE DESARROLLO...

REM 1. Verificar MongoDB
echo 🗄️ Verificando MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe" >NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB ya está corriendo
) else (
    echo 🚀 Iniciando MongoDB...
    net start MongoDB >NUL 2>&1
    if errorlevel 1 (
        echo ⚠️ No se pudo iniciar MongoDB como servicio, intentando manual...
        start /B mongod --dbpath .\data\db
        timeout /t 3 /nobreak >NUL
    )
)

REM 2. Configurar ambiente
echo ⚙️ Configurando ambiente de desarrollo...
if not exist .env.local (
    if exist .env.development (
        copy .env.development .env.local >NUL
        echo ✅ Configuración de desarrollo aplicada
    ) else (
        copy .env.example .env.local >NUL
        echo ⚠️ Usando configuración de ejemplo
    )
)

REM 3. Verificar dependencias
echo 📦 Verificando dependencias...
if not exist node_modules (
    echo 📦 Instalando dependencias del frontend...
    npm install --legacy-peer-deps
)

if not exist backend\node_modules (
    echo 📦 Instalando dependencias del backend...
    cd backend
    npm install
    cd ..
)

REM 4. Matar procesos previos
echo 🔄 Limpiando procesos previos...
taskkill /F /IM node.exe /T >NUL 2>&1

REM 5. Iniciar backend
echo 🔧 Iniciando backend...
cd backend
start /B node server.js > ..\dev-backend.log 2>&1
cd ..

REM Esperar que inicie
timeout /t 3 /nobreak >NUL

REM 6. Verificar backend
curl -f -s http://localhost:3001/api/health >NUL 2>&1
if %errorlevel%==0 (
    echo ✅ Backend corriendo en http://localhost:3001
) else (
    echo ❌ ERROR: Backend no responde
    pause
    exit /b 1
)

REM 7. Mostrar información
echo.
echo 🎉 ¡ENTORNO DE DESARROLLO LISTO!
echo.
echo 📊 Servicios corriendo:
echo    🔧 Backend:  http://localhost:3001
echo    🎨 Frontend: http://localhost:3000 (iniciando...)
echo    🗄️ MongoDB:  puerto 27017
echo.
echo 📋 Para parar todo: Ctrl+C en ambas ventanas
echo.

REM 8. Iniciar frontend
echo 🎨 Iniciando frontend...
npm run dev
