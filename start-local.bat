@echo off
echo 🚀 Iniciando RENT-ALL Local Stack...

echo.
echo 📁 Navegando al directorio del proyecto...
cd /d "D:\RENT-ALL\rent-all-platform"

echo.
echo 🗄️ Iniciando MongoDB...
start "MongoDB" /min "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"

echo.
echo ⏳ Esperando que MongoDB inicie...
timeout /t 3 /nobreak >nul

echo.
echo 🔧 Iniciando Backend...
start "Backend" /min cmd /c "cd backend && node server.js"

echo.
echo ⏳ Esperando que Backend inicie...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Iniciando Frontend...
start "Frontend" cmd /c "npm run dev"

echo.
echo ✅ RENT-ALL Local Stack iniciado!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:3001
echo 🗄️ MongoDB:  mongodb://localhost:27017
echo.
echo 🔗 Presiona cualquier tecla para abrir la aplicación...
pause >nul

start http://localhost:3000
