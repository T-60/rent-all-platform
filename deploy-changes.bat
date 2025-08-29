@echo off
echo 📤 Subiendo cambios a GitHub...

echo.
echo 📁 Navegando al directorio del proyecto...
cd /d "D:\RENT-ALL\rent-all-platform"

echo.
echo 📋 Revisando cambios...
git status

echo.
echo 📤 Añadiendo cambios...
git add .

echo.
set /p commit_message="💬 Escribe el mensaje del commit: "

echo.
echo 📝 Haciendo commit...
git commit -m "%commit_message%"

echo.
echo 🚀 Subiendo al repositorio...
git push origin main

echo.
echo ✅ ¡Cambios subidos exitosamente!
echo.
echo 📖 Instrucciones para actualizar el servidor:
echo    1. Conectar: gcloud compute ssh rent-all-server --zone=us-central1-a
echo    2. Actualizar: cd /var/www/rent-all-platform && sudo git pull origin main
echo    3. Construir: sudo npm run build
echo    4. Reiniciar: sudo pm2 restart all
echo.
pause
