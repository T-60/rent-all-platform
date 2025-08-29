# 📋 Guía de Desarrollo y Despliegue - RENT-ALL

## 🔄 Flujo de Trabajo Manual

### 1. 💻 Desarrollo Local

#### Levantar el entorno local (3 terminales):

**Terminal 1 - MongoDB:**
```bash
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"
```

**Terminal 2 - Backend:**
```bash
cd "D:\RENT-ALL\rent-all-platform\backend"
node server.js
```

**Terminal 3 - Frontend:**
```bash
cd "D:\RENT-ALL\rent-all-platform"
npm run dev
```

#### URLs de desarrollo:
- 🌐 Frontend: `http://localhost:3000`
- 🔧 Backend: `http://localhost:3001/api/health`
- 🗄️ MongoDB: `mongodb://localhost:27017`

### 2. 📤 Subir Cambios al Repositorio

```bash
# Revisar cambios
git status
git diff

# Añadir cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: descripción del cambio realizado"

# Subir al repositorio
git push origin main
```

### 3. 🌐 Actualizar en el Servidor

#### Conectar al servidor:
```bash
gcloud compute ssh rent-all-server --zone=us-central1-a
```

#### Actualizar código:
```bash
cd /var/www/rent-all-platform
sudo git pull origin main
```

#### Construir nueva versión:
```bash
sudo npm run build
```

#### Reiniciar servicios:
```bash
sudo pm2 restart all
sudo pm2 status
```

## ⚙️ Configuración Automática

### 🎯 Detección Inteligente de Entorno
Tu aplicación detecta automáticamente donde está ejecutándose:

- **Local**: Usa `http://localhost:3001/api`
- **Servidor**: Usa `http://localhost:3001/api` (PM2 maneja los servicios)
- **Red**: Se adapta automáticamente a la IP detectada

### 📁 Archivos de Configuración
- `.env.local`: Configuración para ambos entornos
- `lib/api.ts`: Lógica de detección automática

## 🔧 Comandos Útiles

### Git:
```bash
git status                  # Ver estado
git log --oneline          # Ver historial
git diff                   # Ver cambios
```

### PM2 (en servidor):
```bash
sudo pm2 list             # Listar procesos
sudo pm2 logs             # Ver logs
sudo pm2 restart all      # Reiniciar todo
```

### Verificación de Estado:
```bash
# Local
curl http://localhost:3001/api/health

# Servidor
curl http://localhost:3001/api/health
```

## 📝 Mejores Prácticas

1. **Siempre probar localmente antes de subir**
2. **Usar mensajes de commit descriptivos**
3. **Hacer commits pequeños y frecuentes**
4. **Verificar que el servidor funciona después del despliegue**

## 🚨 En Caso de Problemas

### Si algo falla en el servidor:
```bash
sudo pm2 logs --err
sudo pm2 restart all
sudo systemctl status nginx
```

### Verificar puertos:
```bash
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3001
```
