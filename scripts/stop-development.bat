@echo off
REM 🛑 SCRIPT PARA PARAR TODO EL ENTORNO DE DESARROLLO

echo 🛑 PARANDO ENTORNO DE DESARROLLO...

REM 1. Parar todos los procesos Node.js
echo 🔧 Parando todos los procesos Node.js...
taskkill /F /IM node.exe /T >NUL 2>&1
if %errorlevel%==0 (
    echo ✅ Procesos Node.js parados
) else (
    echo ℹ️ No había procesos Node.js corriendo
)

REM 2. Parar procesos específicos de Next.js
echo 🎨 Parando procesos Next.js...
taskkill /F /FI "WINDOWTITLE eq npm*" /T >NUL 2>&1

REM 3. Limpiar logs de desarrollo
echo 🧹 Limpiando logs de desarrollo...
if exist dev-backend.log del /q dev-backend.log >NUL 2>&1
if exist dev-frontend.log del /q dev-frontend.log >NUL 2>&1

REM 4. Verificar que los puertos estén libres
echo � Verificando puertos...
netstat -ano | findstr :3000 >NUL 2>&1
if %errorlevel%==0 (
    echo ⚠️ Puerto 3000 aún ocupado
) else (
    echo ✅ Puerto 3000 libre
)

netstat -ano | findstr :3001 >NUL 2>&1
if %errorlevel%==0 (
    echo ⚠️ Puerto 3001 aún ocupado
) else (
    echo ✅ Puerto 3001 libre
)

echo.
echo ✅ ¡ENTORNO DE DESARROLLO PARADO!
echo.
echo 💡 Para volver a iniciar: npm run dev:full:windows
echo.
pause
