# 🚀 GUÍA PRÁCTICA: DESARROLLO DIARIO

## 📋 **COMANDOS SIMPLES QUE FUNCIONAN**

### **🟢 INICIAR DESARROLLO (Manual - 100% funcional):**

```powershell
# 1. Terminal 1 - Backend
cd "d:\RENT-ALL\rent-all-platform\backend"
node server.js

# 2. Terminal 2 - Frontend  
cd "d:\RENT-ALL\rent-all-platform"
npm run dev
```

### **🔴 PARAR DESARROLLO:**

```powershell
# Ctrl+C en ambas terminales
# O ejecutar:
npm run dev:stop:windows
```

## 🤖 **COMANDOS AUTOMÁTICOS (cuando funcionen):**

```powershell
# Configurar una sola vez
npm run dev:setup

# Iniciar todo (experimental)
npm run dev:ps        # PowerShell
npm run dev:simple    # Batch simple
```

## 📝 **FLUJO DIARIO RECOMENDADO:**

### **🌅 Al empezar (Método SEGURO):**

```powershell
# Terminal 1:
cd "d:\RENT-ALL\rent-all-platform"
npm run dev:setup  # Solo primera vez del día

# Luego:
cd backend
node server.js
# ✅ Backend en http://localhost:3001

# Terminal 2 (nueva):
cd "d:\RENT-ALL\rent-all-platform"
npm run dev
# ✅ Frontend en http://localhost:3000
```

### **🌇 Al terminar:**

```powershell
# En ambas terminales: Ctrl+C
# O en una nueva terminal:
npm run dev:stop:windows
```

## 🔍 **VERIFICAR QUE TODO FUNCIONA:**

```powershell
# Backend:
curl http://localhost:3001/api/health

# Frontend:
# Abrir http://localhost:3000 en el navegador
```

## 📊 **COMPARACIÓN: DESARROLLO vs PRODUCCIÓN**

### **🏠 DESARROLLO (2 terminales):**
```
Terminal 1: cd backend && node server.js
Terminal 2: npm run dev
✅ Cambios automáticos (hot reload)
✅ Logs visibles
✅ Fácil debug
```

### **🏢 PRODUCCIÓN (1 comando):**
```
gcloud compute ssh alexvilcarapa@servidor-web-app --zone=us-east1-d --command="cd apps/rent-all-platform && ./scripts/deploy-production-silent.sh"
✅ Todo automático
✅ Sin intervención manual
✅ Verificaciones incluidas
```

## 🎯 **RESUMEN SÚPER SIMPLE:**

### **Para Desarrollo:**
```
1. Abrir 2 terminales
2. Terminal 1: backend/node server.js
3. Terminal 2: npm run dev
4. ¡Listo!
```

### **Para Producción:**
```
1. git push origin main
2. Ejecutar script deployment
3. ¡Listo!
```

## 💡 **TIPS IMPORTANTES:**

### **✅ BUENAS PRÁCTICAS:**
- Usar 2 terminales para desarrollo (más control)
- Backend en puerto 3001, Frontend en 3000
- Verificar health checks antes de trabajar
- Hacer commits frecuentes

### **❌ EVITAR:**
- Cerrar terminales sin Ctrl+C (deja procesos zombie)
- Cambiar puertos sin actualizar configuración
- Trabajar sin verificar que backend responda

## 🛠️ **TROUBLESHOOTING RÁPIDO:**

### **Backend no inicia:**
```powershell
# Verificar puerto ocupado
netstat -ano | findstr :3001
# Matar proceso si es necesario
taskkill /PID [número] /F
```

### **Frontend no inicia:**
```powershell
# Verificar puerto ocupado
netstat -ano | findstr :3000
# Matar procesos Node
taskkill /F /IM node.exe /T
```

### **Variables de entorno:**
```powershell
# Verificar configuración
type .env.local
# Reconfigurar si es necesario
npm run dev:setup
```

¡Este método manual es 100% confiable y te da control total! 🎉
