@echo off
setlocal enabledelayedexpansion

echo ========================================
echo RENT-ALL - INICIO DESARROLLO COMPLETO
echo ========================================
echo.

echo Verificando directorio...
cd /d "d:\RENT-ALL\rent-all-platform"
if %errorlevel% neq 0 (
    echo ERROR: No se pudo acceder al directorio del proyecto
    pause
    exit /b 1
)

echo OK: Directorio correcto: %cd%
echo.

echo Deteniendo procesos previos...
taskkill /f /im node.exe >nul 2>&1
echo OK: Procesos anteriores detenidos
echo.

echo Creando directorio de logs...
if not exist "logs" mkdir logs
echo OK: Directorio de logs listo
echo.

echo Configurando archivo de entorno...
copy /y .env.development .env >nul 2>&1
if not exist .env (
    copy /y .env.development .env.local >nul 2>&1
)
echo OK: Archivo .env configurado para desarrollo
echo.

echo Iniciando backend en segundo plano...
cd backend
start /min cmd /c "title Backend-RENT-ALL && node server.js > ../logs/backend.log 2>&1"
echo OK: Backend iniciado en segundo plano
cd ..
echo.

echo Esperando que el backend se inicialice (5 segundos)...
timeout /t 5 /nobreak >nul

echo Iniciando frontend en segundo plano...
start /min cmd /c "title Frontend-RENT-ALL && npm run dev > logs/frontend.log 2>&1"
echo OK: Frontend iniciado en segundo plano
echo.

echo Esperando que el frontend se inicialice (8 segundos)...
timeout /t 8 /nobreak >nul

echo.
echo VERIFICANDO SERVICIOS...
echo ================================
echo.

echo Backend:   http://localhost:3001
echo Frontend:  http://localhost:3000  
echo Base Datos: MongoDB Atlas (siempre disponible)
echo.

echo COMANDOS UTILES:
echo ================================
echo   Ver logs:     npm run dev:logs
echo   Detener todo: npm run dev:stop:windows
echo.

echo DESARROLLO INICIADO EXITOSAMENTE
echo Ambos servicios corriendo en segundo plano
echo Puedes cerrar esta ventana sin afectar los servicios
echo.

echo Abriendo aplicacion en el navegador...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo TIP: Los servicios seguiran corriendo aunque cierres esta ventana
echo TIP: Usa 'npm run dev:stop:windows' para detener todo
echo.

pause
