@echo off
echo 🏠 DESARROLLO: Configurando...

REM Configurar ambiente
if not exist .env.local (
    copy .env.development .env.local >NUL 2>&1
    echo ✅ Configuracion aplicada
)

REM Limpiar procesos
taskkill /F /IM node.exe /T >NUL 2>&1

REM Iniciar backend
echo 🔧 Iniciando backend...
cd backend
start /MIN cmd /c "node server.js"
cd ..

echo ⏳ Esperando backend...
timeout /t 5 >NUL

REM Verificar backend
curl -s http://localhost:3001/api/health >NUL
if %errorlevel%==0 (
    echo ✅ Backend OK
) else (
    echo ❌ Backend ERROR
    pause
    exit
)

REM Iniciar frontend
echo 🎨 Iniciando frontend...
start /MIN cmd /c "npm run dev"

echo ⏳ Esperando frontend...
timeout /t 8 >NUL

echo.
echo 🎉 ¡LISTO!
echo 🌐 Backend:  http://localhost:3001
echo 🌐 Frontend: http://localhost:3000
echo.
echo 📋 Para parar: npm run dev:stop:windows
echo 📋 Para logs:  npm run dev:logs
echo.
pause
