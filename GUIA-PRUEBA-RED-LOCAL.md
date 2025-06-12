# 🌐 PRUEBA DE RED LOCAL - RENT+ALL
## Guía completa para probar el acceso desde múltiples dispositivos

### 📊 **ESTADO ACTUAL DE SERVIDORES**

✅ **Backend funcionando**: `http://192.168.0.105:3001`  
✅ **Frontend funcionando**: `http://192.168.0.105:3000`  
✅ **Configuración de red**: Lista para acceso externo

---

## 📱 **URLS DE ACCESO DESDE OTROS DISPOSITIVOS**

### Para acceder desde cualquier dispositivo en la misma red WiFi:

**🔗 URL Principal**: `http://192.168.0.105:3000`

### 📲 **DISPOSITIVOS MÓVILES**
- **iPhone/iPad**: Abrir Safari → `http://192.168.0.105:3000`
- **Android**: Abrir Chrome → `http://192.168.0.105:3000`
- **Cualquier móvil**: Usar la cámara para escanear QR (si disponible)

### 💻 **OTRAS COMPUTADORAS**
- **Windows**: Abrir Chrome/Edge → `http://192.168.0.105:3000`
- **Mac**: Abrir Safari/Chrome → `http://192.168.0.105:3000`
- **Linux**: Abrir Firefox/Chrome → `http://192.168.0.105:3000`

---

## 🧪 **PRUEBAS A REALIZAR**

### 1️⃣ **Prueba de Conectividad Básica**
```
✅ Abrir http://192.168.0.105:3000
✅ Verificar que carga la página principal
✅ Confirmar que el diseño se ve correctamente
```

### 2️⃣ **Prueba de Funcionalidad de Usuario**
```
✅ Hacer clic en "Iniciar Sesión"
✅ Registrar un nuevo usuario
✅ Navegar por las páginas
✅ Ver productos disponibles
```

### 3️⃣ **Prueba de API Backend**
```
✅ Health check: http://192.168.0.105:3001/api/health
✅ Usuarios: http://192.168.0.105:3001/api/users
✅ Productos: http://192.168.0.105:3001/api/products
```

### 4️⃣ **Prueba Multi-Dispositivo**
```
✅ Registrar usuario desde móvil
✅ Ver productos desde tablet
✅ Publicar producto desde PC
✅ Verificar sincronización en tiempo real
```

---

## 🔧 **CONFIGURACIÓN ACTUAL**

### **Red WiFi**: 192.168.0.x
- **IP del servidor**: 192.168.0.105
- **Puerto frontend**: 3000  
- **Puerto backend**: 3001

### **Configuración de acceso**:
- ✅ Frontend acepta conexiones externas (`--hostname 0.0.0.0`)
- ✅ Backend configurado para red local
- ✅ Base de datos MongoDB Atlas (acceso remoto)
- ✅ Cors habilitado para todos los orígenes

---

## 📋 **CHECKLIST DE PRUEBA**

### **Desde tu computadora principal:**
- [ ] ✅ Backend funcionando en http://192.168.0.105:3001
- [ ] ✅ Frontend funcionando en http://192.168.0.105:3000
- [ ] ✅ Health check responde correctamente

### **Desde otro dispositivo:**
- [ ] 🔍 Conectado a la misma red WiFi
- [ ] 🌐 Abrir http://192.168.0.105:3000
- [ ] 📱 Página carga correctamente
- [ ] 🔐 Puede registrarse/iniciar sesión
- [ ] 📦 Puede ver productos
- [ ] ⚡ Respuesta rápida del servidor

---

## 🚨 **RESOLUCIÓN DE PROBLEMAS**

### **Si no puede acceder desde otro dispositivo:**

1. **Verificar red WiFi**:
   ```bash
   # Ambos dispositivos en la misma red
   # Verificar IP del servidor: 192.168.0.105
   ```

2. **Verificar firewall**:
   ```bash
   # macOS: Verificar que no bloquee puertos 3000/3001
   # Windows: Permitir Node.js en firewall
   ```

3. **Reiniciar servidores**:
   ```bash
   # Si hay problemas, reiniciar ambos servidores
   ```

4. **Verificar puertos**:
   ```bash
   # Asegurar que puertos 3000 y 3001 estén libres
   ```

---

## 🎯 **CASOS DE USO REALES**

### **📱 Demostración a cliente desde móvil**
```
1. Cliente escanea QR o ingresa URL
2. Ve la plataforma funcionando
3. Puede registrarse y probar funciones
4. Experiencia completa sin instalar nada
```

### **👥 Prueba con equipo de desarrollo**
```
1. Cada desarrollador accede desde su dispositivo
2. Prueban diferentes funciones simultáneamente
3. Verifican responsive design en tiempo real
4. Detectan issues de usabilidad
```

### **🏢 Presentación en reunión**
```
1. Proyectar pantalla principal
2. Otros participantes acceden desde sus dispositivos
3. Interacción en tiempo real
4. Feedback inmediato
```

---

## ✅ **PRÓXIMOS PASOS**

1. **Probar desde al menos 2 dispositivos diferentes**
2. **Verificar responsive design**
3. **Testear funcionalidades principales**
4. **Documentar cualquier issue encontrado**

---

**🕐 Iniciado**: 11 de Junio, 2025 - 20:16  
**🌐 Estado**: Servidores activos y listos para prueba  
**📱 Compatibilidad**: iOS, Android, Windows, Mac, Linux
