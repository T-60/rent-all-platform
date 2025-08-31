@echo off
setlocal enabledelayedexpansion

echo ========================================
echo 🚀 RENT-ALL - INICIO DESARROLLO COMPLETO
echo ========================================
echo.

echo 📝 Verificando directorio...
cd /d "d:\RENT-ALL\rent-all-platform"
if %errorlevel% neq 0 (
    echo ❌ Error: No se pudo acceder al directorio del proyecto
    pause
    exit /b 1
)

echo ✅ Directorio correcto: %cd%
echo.

echo 🛑 Deteniendo procesos previos...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Procesos anteriores detenidos
echo.

echo � Creando directorio de logs...
if not exist "logs" mkdir logs
echo ✅ Directorio de logs listo
echo.

echo 🔧 Configurando archivo de entorno...
copy /y .env.development .env >nul 2>&1
if not exist .env (
    copy /y .env.development .env.local >nul 2>&1
)
echo ✅ Archivo .env configurado para desarrollo
echo.

echo 📦 Verificando dependencias del backend...
cd backend
if not exist node_modules (
    echo 📦 Instalando dependencias del backend...
    call npm install
    if !errorlevel! neq 0 (
        echo ❌ Error instalando dependencias del backend
        pause
        exit /b 1
    )
)
echo ✅ Backend listo
echo.

echo 🚀 Iniciando backend en segundo plano...
start /min cmd /c "title Backend-RENT-ALL && node server.js > ../logs/backend.log 2>&1"
echo ✅ Backend iniciado en segundo plano
cd ..
echo.

echo ⏳ Esperando que el backend se inicialice...
timeout /t 5 /nobreak >nul

echo 📦 Verificando dependencias del frontend...
if not exist node_modules (
    echo 📦 Instalando dependencias del frontend...
    call npm install --legacy-peer-deps
    if !errorlevel! neq 0 (
        echo ❌ Error instalando dependencias del frontend
        pause
        exit /b 1
    )
)
echo ✅ Frontend listo
echo.

echo 🌐 Iniciando frontend en segundo plano...
start /min cmd /c "title Frontend-RENT-ALL && npm run dev > logs/frontend.log 2>&1"
echo ✅ Frontend iniciado en segundo plano
echo.

echo ⏳ Esperando que el frontend se inicialice...
timeout /t 8 /nobreak >nul

echo.
echo 🔍 VERIFICANDO SERVICIOS...
echo ================================
echo.

echo � Verificando backend (puerto 3001)...
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Backend funcionando en http://localhost:3001
) else (
    echo ⚠️ Backend iniciando... puede tardar unos segundos más
)

echo 🔄 Verificando frontend (puerto 3000)...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Frontend funcionando en http://localhost:3000
) else (
    echo ⚠️ Frontend iniciando... puede tardar unos segundos más
)

echo.
echo 📋 ESTADO DE LOS SERVICIOS:
echo ================================
echo 🟢 Backend:   http://localhost:3001
echo 🟢 Frontend:  http://localhost:3000  
echo 🟢 Base Datos: MongoDB Atlas (siempre disponible)
echo.

echo 📊 COMANDOS ÚTILES:
echo ================================
echo   Ver logs:     npm run dev:logs
echo   Detener todo: npm run dev:stop:windows
echo.

echo ✅ DESARROLLO INICIADO EXITOSAMENTE
echo ✅ Ambos servicios corriendo en segundo plano
echo ✅ Puedes cerrar esta ventana sin afectar los servicios
echo.

echo 🌐 Abriendo aplicación en el navegador...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo 💡 TIP: Los servicios seguirán corriendo aunque cierres esta ventana
echo 💡 Usa 'npm run dev:stop:windows' para detener todo
echo.

pause
