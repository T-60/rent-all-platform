@echo off
echo ========================================
echo RENT-ALL - DETENER DESARROLLO
echo ========================================
echo.

echo Deteniendo todos los procesos de Node.js...
taskkill /f /im node.exe >nul 2>&1

echo Deteniendo MongoDB local...
taskkill /f /im mongod.exe >nul 2>&1

echo Deteniendo procesos en puertos 3000 y 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1

echo Deteniendo procesos en puerto 27017 (MongoDB)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :27017') do taskkill /f /pid %%a >nul 2>&1

echo.
echo Todos los servicios han sido detenidos:
echo   - MongoDB (puerto 27017)
echo   - Backend (puerto 3001) 
echo   - Frontend (puerto 3000)
echo.
echo Puertos liberados correctamente
echo.

pause====================================
echo 🛑 RENT-ALL - DETENER DESARROLLO
echo ========================================
echo.

echo � Deteniendo todos los procesos de Node.js...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im "Next.js" >nul 2>&1

echo 🛑 Deteniendo procesos en puertos 3000 y 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1

echo.
echo ✅ Todos los servicios han sido detenidos
echo ✅ Puertos 3000 y 3001 liberados
echo.

pause
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
