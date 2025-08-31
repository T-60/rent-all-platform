@echo off
REM 🛑 SCRIPT PARA PARAR TODO EL ENTORNO DE DESARROLLO

echo 🛑 PARANDO ENTORNO DE DESARROLLO...

REM 1. Parar procesos Node.js
echo 🔧 Parando todos los procesos Node.js...
taskkill /F /IM node.exe /T >NUL 2>&1
if %errorlevel%==0 (
    echo ✅ Procesos Node.js parados
) else (
    echo ℹ️ No había procesos Node.js corriendo
)

REM 2. Preguntar por MongoDB
set /p mongodb="¿Parar MongoDB también? (y/n): "
if /i "%mongodb%"=="y" (
    echo 🗄️ Parando MongoDB...
    net stop MongoDB >NUL 2>&1
    if %errorlevel%==0 (
        echo ✅ MongoDB parado
    ) else (
        taskkill /F /IM mongod.exe >NUL 2>&1
        echo ✅ MongoDB forzado a parar
    )
) else (
    echo 🗄️ MongoDB sigue corriendo
)

REM 3. Limpiar logs
echo 🧹 Limpiando logs de desarrollo...
del /q dev-backend.log >NUL 2>&1

echo.
echo ✅ ¡ENTORNO DE DESARROLLO PARADO!
echo.
pause
