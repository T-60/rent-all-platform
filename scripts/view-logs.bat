@echo off
REM 📄 SCRIPT PARA VER LOGS DE DESARROLLO

echo 📄 LOGS DE DESARROLLO
echo.

if not exist dev-backend.log (
    echo ❌ No existe dev-backend.log - El backend no se ha iniciado
) else (
    echo 🔧 BACKEND LOGS (últimas 20 líneas):
    echo ==========================================
    powershell "Get-Content dev-backend.log -Tail 20"
    echo.
)

if not exist dev-frontend.log (
    echo ❌ No existe dev-frontend.log - El frontend no se ha iniciado
) else (
    echo 🎨 FRONTEND LOGS (últimas 20 líneas):
    echo ==========================================
    powershell "Get-Content dev-frontend.log -Tail 20"
    echo.
)

echo 📋 Para ver logs en tiempo real:
echo    Backend:  powershell "Get-Content dev-backend.log -Wait"
echo    Frontend: powershell "Get-Content dev-frontend.log -Wait"
echo.
pause
