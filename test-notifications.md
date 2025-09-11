# 🔔 Guía de Pruebas - Sistema de Notificaciones en Tiempo Real

## ✅ Cambios Implementados

### 1. **Backend Socket.io**
- ✅ NotificationService actualizado para emitir eventos en tiempo real
- ✅ Servidor configurado para unir usuarios automáticamente a sus salas personales
- ✅ Todas las notificaciones ahora emiten eventos `new_notification`

### 2. **Frontend Context**
- ✅ Socket.io client integrado en NotificationContext
- ✅ Escucha automática de eventos `new_notification`
- ✅ Actualización en tiempo real del contador de notificaciones
- ✅ Unión automática a sala personal del usuario

### 3. **UI Mejoradas**
- ✅ Badge agregado en la pestaña de Perfil
- ✅ Botón "Actualizar" removido (ya no es necesario)
- ✅ Cálculo correcto de notificaciones leídas (sin números negativos)
- ✅ Badges con variantes de colores (warning, destructive, outline)

## 🚀 Para Probar el Sistema

### 1. Levantar el Sistema:
```bash
# MongoDB
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"

# Backend
cd "d:\RENT-ALL\rent-all-platform\backend"; node server.js

# Frontend  
cd "d:\RENT-ALL\rent-all-platform"; npm run dev
```

### 2. Qué Esperar en la Consola del Backend:
```
✅ Conectado a MongoDB Local exitosamente
🚀 Servidor backend corriendo en puerto 3001
💬 Socket.io habilitado para chat en tiempo real
```

### 3. Qué Esperar en la Consola del Browser (F12):
```
✅ Conectado a Socket.io para notificaciones en tiempo real
👤 Usuario [ID] unido automáticamente a su sala personal
```

### 4. Pruebas a Realizar:

#### Prueba 1: Crear un Producto
1. Ve a Dashboard → Crear Producto
2. Completa el formulario y publícalo
3. **Resultado Esperado**: Badge de notificaciones se actualiza automáticamente sin refrescar

#### Prueba 2: Solicitar Alquiler
1. Desde otra sesión/usuario, solicita alquilar el producto
2. **Resultado Esperado**: El propietario ve la notificación en tiempo real

#### Prueba 3: Verificar Contadores
1. Ve a la página de Notificaciones
2. **Resultado Esperado**: 
   - Total: Número correcto de notificaciones
   - Sin leer: Número correcto (no negativo)
   - Leídas: Número correcto (calculado de notificaciones marcadas como leídas)

## 🎯 Funcionalidades en Tiempo Real

- ✅ **Notificación de bienvenida** (nuevos usuarios)
- ✅ **Producto creado** (cuando publicas un producto)
- ✅ **Solicitud de alquiler** (cuando alguien solicita tu producto)
- ✅ **Alquiler confirmado** (cuando confirmas un alquiler)
- ✅ **Alquiler creado** (cuando se crea un alquiler)
- ✅ **Alquiler cancelado** (cuando se cancela)
- ✅ **Producto alquilado** (cuando tu producto es alquilado)
- ✅ **Notificaciones del sistema** (comunicados generales)

## 🔧 Troubleshooting

### Si no ves notificaciones en tiempo real:
1. Verifica que la consola del browser muestre la conexión a Socket.io
2. Revisa que el backend muestre "Usuario [ID] unido a su sala personal"
3. Asegúrate de estar autenticado en la aplicación

### Si aparecen números negativos:
- El problema está resuelto con el nuevo cálculo usando `notifications.filter(n => n.read).length`

### Si el badge no aparece en el Perfil:
- El badge ahora aparece cuando hay notificaciones sin leer
- Usa la variante "warning" (color naranja)
