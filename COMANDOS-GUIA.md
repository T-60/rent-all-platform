# 🚀 GUÍA DE COMANDOS - RENT-ALL

## 🔧 **ENTORNO DE DESARROLLO** (Local)

### 📋 **Flujo típico después de hacer cambios:**

#### 1️⃣ **Detener todo**
```bash
npm run dev:stop:windows
```

#### 2️⃣ **Iniciar todo de nuevo**
```bash
npm run dev:background
```

### 🔄 **Comandos de desarrollo disponibles:**

| Comando | Descripción |
|---------|-------------|
| `npm run dev:background` | **PRINCIPAL** - Inicia MongoDB + Backend + Frontend en segundo plano |
| `npm run dev:stop:windows` | Detiene TODOS los servicios |
| `npm run dev:logs` | Ver logs en tiempo real |
| `npm run dev:full:windows` | Método manual con 2 terminales |

### 📊 **Ver logs por separado:**
```bash
# MongoDB
type logs\mongodb.log

# Backend  
type logs\backend.log

# Frontend
type logs\frontend.log
```

### 🎯 **Servicios en desarrollo:**
- **MongoDB:** `localhost:27017`
- **Backend:** `http://localhost:3001`
- **Frontend:** `http://localhost:3000`

---

## 🌐 **ENTORNO DE PRODUCCIÓN** (GCP Server)

### 📋 **Flujo típico después de hacer cambios:**

#### 1️⃣ **Subir cambios a Git**
```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

#### 2️⃣ **Desplegar en producción**
```bash
npm run deploy:prod:silent
```

### 🔄 **Comandos de producción disponibles:**

| Comando | Descripción |
|---------|-------------|
| `npm run deploy:prod:silent` | **PRINCIPAL** - Deploy completo sin warnings |
| `npm run deploy:prod` | Deploy con output completo |

### 🎯 **Servicios en producción:**
- **Servidor:** `http://34.23.76.150:8080`
- **Backend:** Puerto 3001 (interno)
- **Frontend:** Puerto 3000 (interno)
- **MongoDB:** Local en el servidor (puerto 27017)

---

## ⚡ **COMANDOS RÁPIDOS - CHEAT SHEET**

### 🏠 **DESARROLLO (Local)**
```bash
# Workflow completo
npm run dev:stop:windows && npm run dev:background

# Solo ver si funciona
start http://localhost:3000
```

### 🌍 **PRODUCCIÓN (GCP)**
```bash
# Workflow completo  
git add . && git commit -m "update" && git push && npm run deploy:prod:silent

# Solo verificar
start http://34.23.76.150:8080
```

---

## 🔍 **VERIFICACIÓN RÁPIDA**

### ✅ **Desarrollo funcionando:**
- MongoDB logs: `✅ Conectado a MongoDB Local exitosamente`
- Backend: `🚀 Servidor backend corriendo en puerto 3001`
- Frontend: `▲ Next.js 15.2.4 - Local: http://localhost:3000`

### ✅ **Producción funcionando:**
- Respuesta del servidor: `http://34.23.76.150:8080`
- Deploy exitoso: `✅ Aplicación desplegada exitosamente`

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### 🏠 **Desarrollo no funciona:**
```bash
# Limpiar todo y reiniciar
npm run dev:stop:windows
taskkill /f /im mongod.exe
timeout 5
npm run dev:background
```

### 🌍 **Producción no funciona:**
```bash
# Verificar servidor
gcloud compute ssh alexvilcarapa@servidor-web-app --zone=us-east1-d --command="sudo systemctl status nginx"

# Re-deploy forzado
npm run deploy:prod:silent
```

---

## 💡 **TIPS IMPORTANTES**

1. **En desarrollo:** Siempre usa `npm run dev:background` - es el comando principal
2. **En producción:** Siempre haz `git push` antes de `npm run deploy:prod:silent`
3. **MongoDB:** En desarrollo es local, en producción también es local (en el servidor)
4. **Logs:** Usa `type logs\archivo.log` para debug en desarrollo
5. **Puertos:** Desarrollo usa 3000/3001, producción usa nginx proxy en 8080

**🎯 Comandos más usados:**
- **Desarrollo:** `npm run dev:background`
- **Producción:** `npm run deploy:prod:silent`
- **Detener:** `npm run dev:stop:windows`
