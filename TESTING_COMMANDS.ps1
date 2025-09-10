# 🚀 RENT-ALL - Scripts de Inicio para Testing con Stripe
# Ejecuta estos comandos en PowerShell en el orden indicado

# ================================================
# PASO 1: INICIAR MONGODB
# ================================================
# Ejecutar en PowerShell (Terminal 1):
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"

# ================================================
# PASO 2: INICIAR BACKEND
# ================================================
# Ejecutar en PowerShell (Terminal 2):
cd "d:\RENT-ALL\rent-all-platform\backend"
node server.js

# ================================================
# PASO 3: INICIAR FRONTEND
# ================================================
# Ejecutar en PowerShell (Terminal 3):
cd "d:\RENT-ALL\rent-all-platform"
npm run dev

# ================================================
# VERIFICACIÓN DE SERVICIOS
# ================================================
# MongoDB: http://localhost:27017 (debe estar corriendo)
# Backend API: http://localhost:3001/api (debe responder)
# Frontend: http://localhost:3000 (debe cargar la aplicación)

# ================================================
# TESTING DE STRIPE - FLUJO COMPLETO
# ================================================

# 1. REGISTRO/LOGIN
#    - Ve a http://localhost:3000
#    - Registrate o inicia sesión con tu cuenta

# 2. CREAR PRODUCTO (Opcional si no hay productos)
#    - Ve al Dashboard
#    - Crea un producto para alquilar

# 3. SOLICITAR ALQUILER
#    - Busca un producto disponible
#    - Solicita alquiler con fechas válidas
#    - Completa el formulario de alquiler

# 4. CONFIRMAR ALQUILER (Como Propietario)
#    - Cambia a la cuenta del propietario del producto
#    - Ve a Perfil → Tab "Solicitudes de Alquiler"
#    - Confirma el alquiler → Estado cambia a "Confirmado"

# 5. PROCESAR PAGO (Como Inquilino)
#    - Vuelve a la cuenta del inquilino
#    - Ve a Perfil → Tab "Mis Alquileres"
#    - El alquiler debe mostrar:
#      * Badge "Confirmado"
#      * Badge "⏳ Pago pendiente"
#      * Botón "💳 Pagar"

# 6. REALIZAR PAGO
#    - Haz clic en "💳 Pagar"
#    - Se abre modal con resumen del alquiler
#    - Clic en "Inicializar Pago"
#    - Aparece formulario de Stripe
#    - Usar datos de tarjeta de test:
#      * Número: 4242 4242 4242 4242
#      * Fecha: 12/34 (cualquier fecha futura)
#      * CVC: 123 (cualquier 3 dígitos)
#      * ZIP: 12345 (cualquier código postal)

# 7. VERIFICAR PAGO EXITOSO
#    - El pago debe procesarse exitosamente
#    - Modal se cierra automáticamente
#    - Badge cambia a "✓ Pagado"
#    - El propietario puede ahora programar entrega

# ================================================
# TARJETAS DE TEST ADICIONALES
# ================================================

# PAGOS EXITOSOS:
# 4242 4242 4242 4242 - Visa
# 5555 5555 5555 4444 - Mastercard
# 3782 822463 10005   - American Express

# PAGOS FALLIDOS (Para testing de errores):
# 4000 0000 0000 0002 - Generic decline
# 4000 0000 0000 9995 - Insufficient funds
# 4000 0000 0000 9987 - Lost card

# ================================================
# DEBUGGING Y LOGS
# ================================================

# LOGS DEL BACKEND:
# - Verificar que aparezcan logs de Payment Intent creation
# - Verificar logs de webhook processing (si configurado)
# - Verificar actualizaciones de estado del alquiler

# LOGS DEL FRONTEND:
# - Abrir DevTools (F12) → Console
# - Verificar que no hay errores de JavaScript
# - Verificar que los estados se actualizan correctamente

# STRIPE DASHBOARD:
# - Ve a https://dashboard.stripe.com/test/payments
# - Verifica que los pagos aparezcan en el dashboard
# - Revisa los logs de eventos y webhooks

# ================================================
# SOLUCIÓN DE PROBLEMAS COMUNES
# ================================================

# ERROR: "Cannot connect to MongoDB"
# SOLUCIÓN: Verificar que MongoDB esté ejecutándose correctamente

# ERROR: "Stripe key not found"
# SOLUCIÓN: Verificar que .env.local y backend/.env tengan las claves

# ERROR: "Payment Intent creation failed"
# SOLUCIÓN: Verificar que el alquiler esté en estado 'confirmed'

# ERROR: "Network error"
# SOLUCIÓN: Verificar que backend esté corriendo en puerto 3001

# ================================================
# PRESENTACIÓN - PUNTOS CLAVE
# ================================================

# ✅ Sistema de pagos real con Stripe
# ✅ Integración completa con flujo de alquileres
# ✅ Interfaz profesional y responsive
# ✅ Manejo de estados de pago
# ✅ Seguridad con Stripe Elements
# ✅ Experiencia de usuario fluida
# ✅ Arquitectura escalable y mantenible
