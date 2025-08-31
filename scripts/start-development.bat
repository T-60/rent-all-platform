@echo off
REM 🚀 SCRIPT DE DESARROLLO PARA WINDOWS

echo 🏠 INICIANDO ENTORNO DE DESARROLLO...

REM 1. Configurar ambiente
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

REM 2. Verificar dependencias básicas
if not exist node_modules (
    echo 📦 Instalando dependencias del frontend...
    npm install --legacy-peer-deps
)

if not exist backend\node_modules (
    echo 📦 Instalando dependencias del backend...
    cd backend && npm install && cd ..
)

REM 3. Matar procesos previos
echo 🔄 Limpiando procesos previos...
taskkill /F /IM node.exe /T >NUL 2>&1

REM 4. Iniciar backend en segundo plano
echo 🔧 Iniciando backend en segundo plano...
cd backend
start /B /MIN cmd /c "node server.js > ../dev-backend.log 2>&1"
cd ..

REM 5. Esperar que el backend inicie
echo ⏳ Esperando que el backend inicie...
timeout /t 5 /nobreak >NUL

REM 6. Verificar backend
echo 🧪 Verificando backend...
curl -f -s http://localhost:3001/api/health >NUL 2>&1
if %errorlevel%==0 (
    echo ✅ Backend corriendo en http://localhost:3001
) else (
    echo ❌ ERROR: Backend no responde
    echo 📄 Revisar logs: type dev-backend.log
    pause
    exit /b 1
)

REM 7. Iniciar frontend en segundo plano
echo 🎨 Iniciando frontend en segundo plano...
start /B /MIN cmd /c "npm run dev > dev-frontend.log 2>&1"

REM 8. Esperar que el frontend inicie
echo ⏳ Esperando que el frontend inicie...
timeout /t 10 /nobreak >NUL

REM 9. Verificar frontend
echo 🧪 Verificando frontend...
curl -f -s http://localhost:3000 >NUL 2>&1
if %errorlevel%==0 (
    echo ✅ Frontend corriendo en http://localhost:3000
) else (
    echo ❌ ERROR: Frontend no responde
    echo � Revisar logs: type dev-frontend.log
    pause
    exit /b 1
)

REM 10. Mostrar información final
echo.
echo 🎉 ¡ENTORNO DE DESARROLLO LISTO!
echo.
echo 📊 Servicios corriendo EN SEGUNDO PLANO:
echo    🔧 Backend:  http://localhost:3001
echo    🎨 Frontend: http://localhost:3000
echo.
echo 📋 Para monitorear:
echo    📄 Logs backend:  type dev-backend.log
echo    📄 Logs frontend: type dev-frontend.log
echo.
echo 🛑 Para parar todo: npm run dev:stop:windows
echo.
echo 🌐 ¡Abre tu navegador en http://localhost:3000!
echo.
pause
