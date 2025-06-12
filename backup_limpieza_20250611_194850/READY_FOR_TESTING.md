# ✅ CONFIGURACIÓN LISTA PARA PRUEBAS EN RED

## 🎉 **¡TODO FUNCIONANDO!**

Los servicios están configurados y funcionando correctamente:

### 📡 **URLs de Acceso:**

#### **Desde tu computadora (servidor):**
- **Frontend:** http://localhost:3000 o http://192.168.1.172:3000
- **Backend:** http://localhost:3001 o http://192.168.1.172:3001

#### **Desde otras computadoras:**
- **Frontend:** http://192.168.1.172:3000
- **Backend API:** http://192.168.1.172:3001/api

### 🚀 **Cómo Iniciar las Pruebas:**

#### **Opción 1: Script Automático**
```bash
./start-network-mode.sh
```

#### **Opción 2: Manual (Ya funcionando)**
Los servicios YA están corriendo:
- ✅ Backend: Corriendo en puerto 3001
- ✅ Frontend: Corriendo en puerto 3000

### 🎯 **Flujo de Prueba Sugerido:**

#### **👤 Usuario 1 (Tu computadora):**
1. 🌐 Abrir: http://localhost:3000
2. 📝 Registrarse como "Juan Propietario"
3. ➕ Crear productos:
   - Laptop Gaming (50€/día)
   - Bicicleta (15€/día)
   - Cámara (25€/día)

#### **👤 Usuario 2 (Segunda computadora):**
1. 🌐 Abrir: http://192.168.1.172:3000
2. 📝 Registrarse como "María Inquilina"
3. 🔍 Buscar productos de Juan
4. 🏠 Alquilar la Laptop Gaming
5. ⏳ Ver estado "pendiente"

#### **👤 Usuario 1 (Volver a tu computadora):**
1. 🔔 Ver badge en "Solicitudes"
2. 📋 Ir a Perfil → Solicitudes
3. ✅ Confirmar alquiler de María
4. 📱 Verificar notificación

#### **👤 Usuario 2 (Volver a segunda computadora):**
1. 🔄 Refrescar página
2. ✅ Ver estado "confirmado"
3. 📱 Ver notificación de confirmación

### 🔧 **Funcionalidades a Probar:**

#### **Sistema de Alquileres:**
- ✅ Crear productos
- ✅ Buscar y filtrar
- ✅ Solicitar alquiler
- ✅ Confirmar/rechazar
- ✅ Ver historial

#### **Sistema de Notificaciones:**
- ✅ Notificaciones in-app
- ✅ Badges de pendientes
- ✅ Estados visuales

#### **Tiempo Real:**
- ✅ Cambios instantáneos entre dispositivos
- ✅ Sincronización de estados
- ✅ Notificaciones cruzadas

### 🛑 **Para Detener los Servicios:**
```bash
# Detener ambos servicios
pkill -f "node server.js"
pkill -f "next dev"
```

### 🔄 **Para Volver al Modo Local:**
```bash
./revert-to-local.sh
```

### 🚨 **Troubleshooting:**

#### **Si no puedes conectar desde otra PC:**
1. **Red:** Verificar que ambas estén en misma WiFi
2. **Firewall:** Desactivar temporalmente en tu Mac
3. **URLs:** Usar exactamente http://192.168.1.172:3000

#### **Si hay errores de conexión:**
1. **Verificar servicios:**
   ```bash
   curl http://localhost:3001/api/health
   ```
2. **Reiniciar si es necesario:**
   ```bash
   pkill -f "next dev" && npx next dev -H 0.0.0.0 -p 3000
   ```

## 🎉 **¡LISTO PARA PROBAR!**

Todo está configurado correctamente. Puedes empezar a probar el flujo completo de confirmación de alquileres en tiempo real entre dos computadoras.

**¡Disfruta probando tu aplicación!** 🚀

---
**Estado:** ✅ FUNCIONANDO
**Backend:** http://192.168.1.172:3001
**Frontend:** http://192.168.1.172:3000
**Fecha:** $(date)
