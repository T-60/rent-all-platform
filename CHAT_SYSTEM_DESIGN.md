# 💬 Sistema de Chat para RENT+ALL

## 🎯 **Objetivo**
Permitir comunicación directa entre arrendatario y propietario durante el proceso de alquiler.

## 🔄 **Integración con Flujo Actual**

### **Cuando se activa el chat:**
1. ✅ Usuario crea solicitud de alquiler → **Chat se habilita automáticamente**
2. ✅ Propietario recibe notificación → **Puede chatear antes de confirmar**
3. ✅ Durante alquiler activo → **Chat para coordinación**

## 🏗️ **Arquitectura Técnica**

### **Frontend (React + Socket.io)**
```
components/chat/
├── ChatWindow.tsx       # Ventana principal del chat
├── ChatMessage.tsx      # Componente de mensaje individual
├── ChatInput.tsx        # Input para escribir mensajes
└── ChatNotification.tsx # Notificaciones de nuevos mensajes

contexts/
└── chat-context.tsx     # Estado global del chat
```

### **Backend (Node.js + Socket.io)**
```
routes/
└── chat.js             # API REST para historial

models/
└── Message.js          # Schema de mensajes

socket/
└── chatHandler.js      # Manejo de WebSockets
```

## 📊 **Schema de Base de Datos**

### **Modelo Message:**
```javascript
{
  _id: ObjectId,
  rental: ObjectId,        // Referencia al alquiler
  sender: ObjectId,        // Usuario que envía
  receiver: ObjectId,      // Usuario que recibe
  message: String,         // Contenido del mensaje
  timestamp: Date,         // Fecha y hora
  read: Boolean,          // Si fue leído
  type: 'text' | 'image'  // Tipo de mensaje
}
```

## 🎨 **Ubicación en UI**

### **1. En Página de Producto:**
- Botón "💬 Preguntar al propietario" (solo si hay solicitud)

### **2. En Perfil - Alquileres:**
- Icono de chat junto a cada alquiler activo
- Badge con mensajes no leídos

### **3. Notificaciones:**
- Integrar con sistema existente de notificaciones

## 🚀 **Implementación por Fases**

### **Fase 1: Estructura Básica** (1-2 días)
- ✅ Modelo de datos
- ✅ API REST para mensajes
- ✅ Componente ChatWindow básico

### **Fase 2: Tiempo Real** (1 día)
- ✅ Socket.io implementación
- ✅ Envío/recepción instantánea

### **Fase 3: Integración** (1 día)
- ✅ Integrar con alquileres existentes
- ✅ Notificaciones push
- ✅ Indicadores visuales

### **Fase 4: Mejoras** (1 día)
- ✅ Soporte para imágenes
- ✅ Timestamps mejorados
- ✅ Estado "escribiendo..."

## 🔒 **Seguridad**
- Solo usuarios involucrados en el alquiler pueden chatear
- Validación de permisos en cada mensaje
- Rate limiting para evitar spam

## 📱 **Experiencia de Usuario**
- Chat flotante no intrusivo
- Notificaciones discretas
- Integración natural con flujo existente
