# 🏠 SCRIPTS DE DESARROLLO - GUÍA COMPLETA

## 🎯 **¿PARA QUÉ SIRVEN?**

Ahora tienes scripts automáticos para desarrollo que hacen TODO por ti:
- 🗄️ Inician MongoDB
- 🔧 Inician el Backend
- 🎨 Inician el Frontend  
- ⚙️ Configuran variables de entorno
- 📦 Instalan dependencias si faltan

## 🚀 **COMANDOS DISPONIBLES**

### **Para Windows (tu caso):**
```bash
# 🟢 INICIAR TODO (MongoDB + Backend + Frontend)
npm run dev:full:windows

# 🔴 PARAR TODO
npm run dev:stop:windows
```

### **Para Linux/Mac:**
```bash
# 🟢 INICIAR TODO  
npm run dev:full

# 🔴 PARAR TODO
npm run dev:stop
```

## 📋 **FLUJO DIARIO SÚPER FÁCIL**

### **🌅 Al empezar a trabajar:**
```bash
cd "d:\RENT-ALL\rent-all-platform"
npm run dev:full:windows
```

**¿Qué hace automáticamente?**
1. ✅ Verifica si MongoDB está corriendo (si no, lo inicia)
2. ✅ Copia .env.development a .env.local
3. ✅ Instala dependencias si faltan
4. ✅ Inicia backend en http://localhost:3001
5. ✅ Inicia frontend en http://localhost:3000
6. ✅ Te dice si todo funciona

### **🌇 Al terminar de trabajar:**
```bash
# En otra terminal (sin cerrar la del frontend):
npm run dev:stop:windows
```

**¿Qué hace?**
1. ✅ Para el backend
2. ✅ Para el frontend  
3. ✅ Pregunta si quieres parar MongoDB
4. ✅ Limpia logs temporales

## 🆚 **DESARROLLO vs PRODUCCIÓN**

### **🏠 DESARROLLO (tu computadora):**
```bash
# Variables de entorno
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
PORT=3001

# Servicios
MongoDB:  localhost:27017
Backend:  localhost:3001  
Frontend: localhost:3000
```

### **🏢 PRODUCCIÓN (servidor GCP):**
```bash
# Variables de entorno  
NEXT_PUBLIC_API_URL=http://34.23.76.150:8080/api
NODE_ENV=production
PORT=3001

# Servicios
MongoDB:  localhost:27017 (en el servidor)
Backend:  localhost:3001 (en el servidor)
Frontend: localhost:3000 (en el servidor)
Nginx:    34.23.76.150:8080 (público)
```

## 📱 **EJEMPLO DE USO DIARIO**

### **Día típico de desarrollo:**

```bash
# 1. Llegar a la oficina/casa
cd "d:\RENT-ALL\rent-all-platform"
npm run dev:full:windows

# 2. Salida del script:
# 🏠 INICIANDO ENTORNO DE DESARROLLO...
# ✅ MongoDB ya está corriendo
# ✅ Configuración de desarrollo aplicada
# ✅ Backend corriendo en http://localhost:3001
# 🎨 Frontend estará disponible en http://localhost:3000
# 🎉 ¡ENTORNO DE DESARROLLO LISTO!

# 3. Trabajar todo el día...
# - Editar código
# - Ver cambios en http://localhost:3000
# - Probar API en http://localhost:3001

# 4. Al terminar:
npm run dev:stop:windows

# 5. Subir cambios:
git add .
git commit -m "✨ Nueva funcionalidad"
git push origin main
```

## 🔧 **TROUBLESHOOTING**

### **❌ "Error: MongoDB no inicia"**
```bash
# Solución 1: Verificar servicio Windows
net start MongoDB

# Solución 2: Crear directorio de datos
mkdir data\db

# Solución 3: Iniciar manual
mongod --dbpath .\data\db
```

### **❌ "Error: Puerto 3001 ocupado"**
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3001

# Matar proceso específico
taskkill /PID [PID_NUMBER] /F
```

### **❌ "Error: No encuentra .env.development"**
```bash
# El script usará .env.example automáticamente
# O crear manualmente:
cp .env.example .env.development
```

## 🎯 **SCRIPTS INDIVIDUALES (si necesitas más control)**

### **Solo Backend:**
```bash
cd backend
node server.js
```

### **Solo Frontend:**
```bash
npm run dev
```

### **Solo MongoDB:**
```bash
net start MongoDB
```

## 🔄 **COMPARACIÓN: ANTES vs DESPUÉS**

### **❌ ANTES (Manual - 5 pasos):**
```bash
1. net start MongoDB
2. cd backend && node server.js
3. # Abrir nueva terminal
4. cd ..
5. npm run dev
```

### **✅ DESPUÉS (Automático - 1 paso):**
```bash
npm run dev:full:windows
```

## 🎉 **VENTAJAS DEL NUEVO SISTEMA**

### **✅ Para Desarrollo:**
- 🚀 **1 comando** inicia todo
- 🔍 **Verificaciones automáticas** de servicios
- ⚙️ **Configuración automática** de ambiente
- 📦 **Dependencias automáticas**
- 🛑 **1 comando** para todo

### **✅ Para Producción:**
- 🚀 **1 comando** para deployment
- 🔇 **Sin warnings** molestos
- 🧪 **Verificaciones de salud**
- 🛡️ **Validaciones de seguridad**
- 📊 **Monitoreo incluido**

## 🎯 **RESUMEN SÚPER SIMPLE**

```
DESARROLLO:
💻 npm run dev:full:windows    ← Inicia todo
🛑 npm run dev:stop:windows    ← Para todo

PRODUCCIÓN:  
🚀 ./scripts/deploy-production-silent.sh    ← Deploy automático
📊 ./scripts/monitor.sh                     ← Ver estado
```

¡Ahora tienes un sistema completamente automatizado para desarrollo Y producción! 🎉
