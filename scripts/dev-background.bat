@echo off
cls
echo ========================================
echo RENT-ALL - DESARROLLO EN SEGUNDO PLANO
echo ========================================
echo.

REM Ir al directorio del proyecto
cd /d "d:\RENT-ALL\rent-all-platform"

REM Detener procesos previos
echo [1/7] Deteniendo procesos previos...
taskkill /f /im node.exe 2>nul
taskkill /f /im mongod.exe 2>nul
echo OK

REM Crear directorio de logs
echo [2/7] Preparando logs...
if not exist logs mkdir logs
echo. > logs\backend.log
echo. > logs\frontend.log
echo. > logs\mongodb.log
echo OK

REM Configurar entorno
echo [3/7] Configurando entorno...
if exist .env.development (
    copy /y .env.development .env 2>nul
) else (
    echo WARNING: No se encontro .env.development
)
echo OK

REM Verificar y crear directorio de MongoDB si no existe
echo [4/7] Verificando MongoDB...
if not exist "C:\data\db" (
    echo Creando directorio para MongoDB...
    mkdir "C:\data\db" 2>nul
)

REM Iniciar MongoDB local
echo Iniciando MongoDB local...
start /min "MongoDB-RENT-ALL" "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db" --logpath "logs\mongodb.log"
echo OK - MongoDB iniciado en segundo plano

REM Esperar que MongoDB se inicialice
echo Esperando que MongoDB se inicialice...
timeout /t 5 /nobreak >nul

REM Iniciar backend
echo [5/7] Iniciando backend...
cd backend
start /min "Backend-RENT-ALL" cmd /c "node server.js > ../logs/backend.log 2>&1"
cd ..
echo OK - Backend iniciado en segundo plano

REM Esperar un poco
echo [6/7] Esperando inicializacion...
timeout /t 3 /nobreak >nul

REM Iniciar frontend
echo [7/7] Iniciando frontend...
start /min "Frontend-RENT-ALL" cmd /c "npm run dev > logs/frontend.log 2>&1"
echo OK - Frontend iniciado en segundo plano

echo.
echo ============= COMPLETADO =============
echo.
echo MongoDB:  localhost:27017
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Para ver logs: 
echo   MongoDB:  type logs\mongodb.log
echo   Backend:  type logs\backend.log
echo   Frontend: type logs\frontend.log
echo.
echo Para detener:  npm run dev:stop:windows
echo.
echo Abriendo navegador en 3 segundos...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo Presiona cualquier tecla para cerrar (los servicios seguiran corriendo)
pause >nul
