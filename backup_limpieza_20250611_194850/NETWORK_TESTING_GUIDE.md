# 🏠 Guía de Pruebas en Red Local - RentAll Platform

## 🌐 **Configuración Completada**

Tu RentAll Platform está configurado para funcionar en red local con:
- **IP Local:** 192.168.1.172
- **Frontend:** http://192.168.1.172:3000
- **Backend:** http://192.168.1.172:5000

## 🚀 **Cómo Iniciar las Pruebas**

### **En la Computadora Principal (Servidor):**

1. **Iniciar los servicios:**
   ```bash
   ./start-network-mode.sh
   ```

2. **Verificar que funciona:**
   - Abrir http://192.168.1.172:3000 en tu navegador
   - Deberías ver la aplicación funcionando

### **En la Segunda Computadora:**

1. **Conectarse a la misma red WiFi**
2. **Abrir navegador y ir a:**
   ```
   http://192.168.1.172:3000
   ```
3. **¡Ya puedes usar la aplicación!**

## 🎯 **Flujo de Pruebas Sugerido**

### **👤 Usuario 1 (Computadora Principal):**
1. **Registro:** Crear cuenta como "Juan Propietario"
2. **Crear Productos:** 
   - Laptop Gaming (50€/día)
   - Bicicleta Mountain Bike (15€/día)
   - Cámara Canon (25€/día)
3. **Explorar:** Ver todos los productos disponibles

### **👤 Usuario 2 (Segunda Computadora):**
1. **Registro:** Crear cuenta como "María Inquilina"
2. **Buscar:** Explorar productos de Juan
3. **Alquilar:** Solicitar la Laptop Gaming
4. **Verificar:** Estado "pendiente" en "Mis Alquileres"

### **👤 Usuario 1 (Volver a Computadora Principal):**
1. **Notificación:** Debería aparecer badge en "Solicitudes"
2. **Gestionar:** Ir a Perfil → Solicitudes
3. **Confirmar:** Aprobar el alquiler de María
4. **Verificar:** Cambio de estado y notificación

### **👤 Usuario 2 (Volver a Segunda Computadora):**
1. **Actualizar:** Refrescar página o navegar
2. **Verificar:** Estado cambiado a "confirmado"
3. **Notificaciones:** Ver notificación de confirmación

## 🔧 **Funcionalidades a Probar**

### **Sistema de Alquileres:**
- ✅ Crear productos
- ✅ Buscar y filtrar productos
- ✅ Solicitar alquiler
- ✅ Confirmar/rechazar solicitudes
- ✅ Ver historial de alquileres

### **Sistema de Notificaciones:**
- ✅ Notificaciones in-app
- ✅ Badges de pendientes
- ✅ Estados visuales

### **Interfaz de Usuario:**
- ✅ Navegación entre páginas
- ✅ Responsividad en diferentes dispositivos
- ✅ Feedback visual (toasts, badges)

## 🚨 **Troubleshooting**

### **Si no puedes conectar desde la segunda PC:**
1. **Verificar red:** Ambas PCs en misma WiFi
2. **Firewall:** Desactivar temporalmente en computadora principal
3. **Puerto:** Verificar que puertos 3000 y 5000 estén libres

### **Si hay errores de CORS:**
- El backend ya está configurado para aceptar conexiones externas

### **Si no se actualizan los datos:**
- Usar el botón "Actualizar" en la página de productos
- Refrescar la página del navegador

## 📱 **URLs de Acceso**

### **Desde la Computadora Principal:**
- Frontend: http://localhost:3000 O http://192.168.1.172:3000
- Backend: http://localhost:5000 O http://192.168.1.172:5000

### **Desde Cualquier Otra Computadora:**
- Frontend: http://192.168.1.172:3000
- Backend: http://192.168.1.172:5000

## 🔄 **Después de las Pruebas**

**Para volver al modo local normal:**
```bash
./revert-to-local.sh
```

Esto restaurará todas las configuraciones originales.

## 🎉 **¡A Probar!**

Todo está listo para que pruebes el flujo completo de confirmación de alquileres en tiempo real entre dos computadoras. ¡Disfruta probando tu aplicación!

---
**Fecha:** $(date)
**IP Local:** 192.168.1.172
**Modo:** Red Local para Pruebas
