@echo off
echo ================================
echo    RENT-ALL - STRIPE TESTING
echo ================================
echo.

echo [1/3] Iniciando MongoDB...
echo Comando: "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"
echo.
echo NOTA: MongoDB debe ejecutarse en una ventana separada
echo Presiona cualquier tecla cuando MongoDB esté ejecutándose...
pause
echo.

echo [2/3] Iniciando Backend (Node.js)...
cd /d "d:\RENT-ALL\rent-all-platform\backend"
echo Directorio actual: %cd%
echo Comando: node server.js
echo.
start cmd /k "node server.js"
timeout /t 3 /nobreak > nul
echo.

echo [3/3] Iniciando Frontend (Next.js)...
cd /d "d:\RENT-ALL\rent-all-platform"
echo Directorio actual: %cd%
echo Comando: npm run dev
echo.
start cmd /k "npm run dev"
echo.

echo ================================
echo   SERVICIOS INICIADOS
echo ================================
echo.
echo MongoDB:  http://localhost:27017
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo ================================
echo   TESTING DE PAGOS STRIPE
echo ================================
echo.
echo 1. Ve a http://localhost:3000
echo 2. Registrate/Inicia sesion
echo 3. Crea un producto o solicita alquiler
echo 4. Confirma el alquiler (como propietario)
echo 5. Ve al perfil y haz clic en "Pagar"
echo 6. Usa tarjeta de test: 4242 4242 4242 4242
echo.
echo Presiona cualquier tecla para continuar...
pause
