# 🚀 COMANDOS RENT-ALL - GUÍA COMPLETA

## 🏠 ENTORNO DE DESARROLLO (Local)

### 📋 PASOS DESPUÉS DE HACER CAMBIOS

#### PASO 1: Detener servicios
```bash
npm run dev:stop:windows
```

#### PASO 2: Reiniciar todo
```bash
npm run dev:background
```

#### PASO 3: Verificar que funciona
- Abrir: http://localhost:3000
- Backend: http://localhost:3001/api/health

### ⚡ COMANDO RÁPIDO (TODO EN UNO)
```bash
npm run dev:stop:windows && npm run dev:background
```

### 📊 COMANDOS DE MONITOREO
```bash
# Ver logs del backend
type logs\backend.log

# Ver logs del frontend
type logs\frontend.log

# Ver logs de MongoDB
type logs\mongodb.log

# Ver todos los procesos Node
tasklist | findstr node
```

### 🔧 SERVICIOS EN DESARROLLO
- **MongoDB Local:** localhost:27017
- **Backend API:** http://localhost:3001
- **Frontend Web:** http://localhost:3000

---

## 🌐 ENTORNO DE PRODUCCIÓN (GCP Server)

### 📋 PASOS DESPUÉS DE HACER CAMBIOS

#### PASO 1: Guardar cambios en Git
```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

#### PASO 2: Desplegar en servidor
```bash
npm run deploy:prod:silent
```

#### PASO 3: Verificar que funciona
- Abrir: http://34.23.76.150:8080

### ⚡ COMANDO RÁPIDO (TODO EN UNO)
```bash
git add . && git commit -m "update" && git push && npm run deploy:prod:silent
```

### 📊 COMANDOS DE MONITOREO PRODUCCIÓN
```bash
# Verificar estado del servidor
gcloud compute ssh alexvilcarapa@servidor-web-app --zone=us-east1-d --command="sudo systemctl status nginx"

# Ver logs del backend en servidor
gcloud compute ssh alexvilcarapa@servidor-web-app --zone=us-east1-d --command="tail -f apps/rent-all-platform/logs/backend.log"

# Verificar procesos en servidor
gcloud compute ssh alexvilcarapa@servidor-web-app --zone=us-east1-d --command="ps aux | grep node"
```

### 🔧 SERVICIOS EN PRODUCCIÓN
- **Servidor Principal:** http://34.23.76.150:8080
- **Backend Interno:** Puerto 3001
- **Frontend Interno:** Puerto 3000
- **MongoDB Local:** localhost:27017 (en el servidor)

---

## 📋 FLUJO DIARIO DE TRABAJO

### 🌅 AL EMPEZAR EL DÍA
```bash
cd d:\RENT-ALL\rent-all-platform
npm run dev:background
```

### 💻 MIENTRAS DESARROLLAS
```bash
# Cada vez que hagas cambios importantes
npm run dev:stop:windows && npm run dev:background
```

### 🌙 AL TERMINAR EL DÍA
```bash
npm run dev:stop:windows
```

### 📤 CUANDO QUIERAS SUBIR A PRODUCCIÓN
```bash
git add . && git commit -m "descripción de cambios" && git push && npm run deploy:prod:silent
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### 🏠 DESARROLLO NO FUNCIONA
```bash
# Limpiar todo completamente
npm run dev:stop:windows
taskkill /f /im mongod.exe
taskkill /f /im node.exe
timeout 5
npm run dev:background
```

### 🌐 PRODUCCIÓN NO FUNCIONA
```bash
# Re-deploy forzado
npm run deploy:prod:silent

# Si persiste el problema, reiniciar nginx en servidor
gcloud compute ssh alexvilcarapa@servidor-web-app --zone=us-east1-d --command="sudo systemctl restart nginx"
```

### 🔍 VERIFICAR QUE TODO ESTÁ FUNCIONANDO

#### ✅ DESARROLLO OK:
- MongoDB: `✅ Conectado a MongoDB Local exitosamente`
- Backend: `🚀 Servidor backend corriendo en puerto 3001`
- Frontend: `▲ Next.js 15.2.4 - Local: http://localhost:3000`

#### ✅ PRODUCCIÓN OK:
- Servidor responde: http://34.23.76.150:8080
- Deploy exitoso: `✅ Aplicación desplegada exitosamente`

---

## 📚 COMANDOS DE REFERENCIA RÁPIDA

| Acción | Comando |
|--------|---------|
| **🚀 Iniciar desarrollo** | `npm run dev:background` |
| **🛑 Parar desarrollo** | `npm run dev:stop:windows` |
| **🔄 Reiniciar desarrollo** | `npm run dev:stop:windows && npm run dev:background` |
| **📤 Deploy producción** | `npm run deploy:prod:silent` |
| **📊 Ver logs backend** | `type logs\backend.log` |
| **🌐 Abrir app local** | `start http://localhost:3000` |
| **🌍 Abrir app producción** | `start http://34.23.76.150:8080` |

---

## 💡 TIPS IMPORTANTES

1. **Siempre** usa `npm run dev:background` para desarrollo
2. **Siempre** haz `git push` antes de deployer a producción
3. **MongoDB** está local en ambos entornos (desarrollo y producción)
4. **Los logs** están en la carpeta `logs/` para debugging
5. **Puedes cerrar** la terminal después de ejecutar `npm run dev:background`

---

## 🎯 COMANDOS MÁS USADOS (COPIA Y PEGA)

### 🏠 Desarrollo diario:
```bash
npm run dev:background
```

### 🔄 Reiniciar después de cambios:
```bash
npm run dev:stop:windows && npm run dev:background
```

### 🌐 Subir a producción:
```bash
git add . && git commit -m "update" && git push && npm run deploy:prod:silent
```

### 🛑 Parar todo:
```bash
npm run dev:stop:windows
```

**¡Guarda este archivo como referencia! 📌**
