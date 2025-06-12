# 🚀 SETUP COMPLETO - RENT+ALL Platform

## 📋 Guía de Instalación para Compañeros de Equipo

Esta guía te permitirá configurar todo el entorno de desarrollo de **RENT+ALL** desde cero en tu computadora.

---

## ⚡ Instalación Rápida (5 minutos)

### 1️⃣ **Prerequisitos (Instalar si no los tienes)**

#### **Node.js 18+**
```bash
# Verificar instalación
node --version  # Debe ser 18.0 o superior

# Si no tienes Node.js:
# macOS: brew install node
# Windows: Descargar desde https://nodejs.org/
# Linux: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs
```

#### **pnpm (Gestor de paquetes)**
```bash
# Instalar pnpm
npm install -g pnpm

# Verificar
pnpm --version
```

#### **MongoDB**
```bash
# Opción A: MongoDB Local (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Opción B: MongoDB Atlas (Recomendado - más fácil)
# Solo necesitas crear cuenta en https://www.mongodb.com/atlas
```

#### **Git**
```bash
# Verificar Git
git --version

# Si no tienes Git:
# macOS: xcode-select --install
# Windows: https://git-scm.com/download/win
# Linux: sudo apt-get install git
```

### 2️⃣ **Clonar y Configurar**

```bash
# 1. Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd rent-all-platform

# 2. Instalar dependencias del frontend
pnpm install

# 3. Instalar dependencias del backend
cd backend
npm install
cd ..

# 4. Crear archivo de configuración
cp .env.example .env.local
```

### 3️⃣ **Configurar Variables de Entorno**

Edita el archivo `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Database - ELIGE UNA OPCIÓN:

# Opción A: MongoDB Local
MONGODB_URI=mongodb://localhost:27017/rentall

# Opción B: MongoDB Atlas (Recomendado)
# MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/rentall

# JWT Secret (puedes usar cualquier string largo)
JWT_SECRET=mi_super_secreto_jwt_para_desarrollo_12345

# Upload Settings
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4️⃣ **Iniciar Base de Datos**

#### **Opción A: MongoDB Local**
```bash
# Iniciar MongoDB
brew services start mongodb-community  # macOS
# O para Linux: sudo systemctl start mongod
```

#### **Opción B: MongoDB Atlas (Más fácil)**
1. Ve a https://www.mongodb.com/atlas
2. Crea cuenta gratuita
3. Crea cluster (usar tier gratuito)
4. Crea usuario de base de datos
5. Copia la URL de conexión
6. Pégala en `.env.local` como `MONGODB_URI`

### 5️⃣ **Ejecutar la Aplicación**

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend (nueva terminal)
cd rent-all-platform  # volver a la carpeta raíz
pnpm dev
```

### 6️⃣ **Verificar que Todo Funciona**

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

Si ves la página de RENT+ALL en el navegador, ¡todo está funcionando! 🎉

---

## 🧪 Crear Datos de Prueba

Para probar la aplicación con datos reales:

```bash
# Crear usuario de prueba automáticamente
node create-test-user.js

# Esto creará:
# Email: usuario1@universidad.edu
# Password: 123456
```

Ahora puedes:
1. Ir a http://localhost:3000/auth/login
2. Hacer login con las credenciales de arriba
3. Explorar la aplicación completa

---

## 🔧 Scripts Útiles para Desarrollo

```bash
# Frontend
pnpm dev           # Modo desarrollo
pnpm build         # Construir para producción
pnpm lint          # Verificar código

# Backend
cd backend
npm start          # Servidor de desarrollo
npm run dev        # Servidor con hot reload (si existe)

# Utilidades
./verify-profile-images.sh    # Verificar que todo funciona
node create-test-user.js      # Crear datos de prueba
```

---

## 🐛 Solución de Problemas Comunes

### **Error: "puerto 3000 ya está en uso"**
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O usar puerto diferente
pnpm dev -- --port 3001
```

### **Error: "MongoDB connection failed"**
```bash
# Verificar MongoDB local
brew services list | grep mongo  # macOS
mongosh --eval "db.runCommand({ping: 1})"

# O revisar tu URL de MongoDB Atlas
```

### **Error: "Cannot find module"**
```bash
# Limpiar e instalar dependencias
rm -rf node_modules .next
pnpm install

cd backend
rm -rf node_modules
npm install
```

### **Imágenes no cargan**
```bash
# Verificar que el backend sirve archivos estáticos
curl -I http://localhost:3001/uploads/test.png

# Crear directorio de uploads si no existe
mkdir -p backend/uploads/products
```

---

## 📱 Estructura del Proyecto

```
rent-all-platform/
├── 📁 app/                    # Páginas Next.js
│   ├── auth/                  # Login/Registro
│   ├── dashboard/             # Panel principal
│   ├── products/              # Gestión de productos
│   └── profile/               # Perfil de usuario
├── 📁 components/             # Componentes React
│   ├── ui/                    # Componentes base
│   └── forms/                 # Formularios
├── 📁 backend/                # Servidor Express
│   ├── routes/                # APIs
│   ├── models/                # Modelos de BD
│   └── uploads/               # Archivos subidos
├── 📁 contexts/               # Estado global React
├── 📁 lib/                    # Utilidades
└── 📁 public/                 # Archivos estáticos
```

---

## 💡 Tips para Desarrollo

### **Debugging**
- **Frontend:** Abre DevTools (F12) y ve a Console
- **Backend:** Los logs aparecen en terminal donde ejecutas `npm start`
- **Base de Datos:** Usa MongoDB Compass o mongosh

### **Hot Reload**
- Los cambios en frontend se reflejan automáticamente
- Para backend, reinicia el servidor si hay cambios

### **Páginas Útiles para Testing**
- `/image-debug` - Probar sistema de imágenes
- `/profile` - Ver perfil completo
- `/dashboard` - Panel principal

### **APIs Principales**
- `POST /api/auth/login` - Autenticación
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `POST /api/rentals` - Crear alquiler

---

## 🚀 Despliegue (Opcional)

### **Frontend (Vercel)**
```bash
# Conectar con Vercel
npm i -g vercel
vercel

# Seguir instrucciones en pantalla
```

### **Backend (Railway/Heroku)**
```bash
# Para Railway
npm i -g @railway/cli
railway login
railway init
railway up
```

---

## 📞 ¿Necesitas Ayuda?

### **Problemas Comunes**
1. **Puerto ocupado:** Cambia el puerto en package.json
2. **MongoDB no conecta:** Revisa la URL en .env.local
3. **Módulos faltantes:** Ejecuta `pnpm install` y `npm install` en backend

### **Contacto del Equipo**
- **Slack:** Canal #rent-all-dev
- **Email:** [tu-email@universidad.edu](mailto:tu-email@universidad.edu)
- **GitHub Issues:** Crea issue en el repositorio

---

## ✅ Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] pnpm instalado
- [ ] MongoDB configurado (local o Atlas)
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (frontend y backend)
- [ ] Variables de entorno configuradas
- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 3000
- [ ] Usuario de prueba creado
- [ ] Login funciona correctamente

---

## 🎯 Próximos Pasos

1. **Explora el código:** Empieza por `app/page.tsx` (homepage)
2. **Entiende la arquitectura:** Revisa `contexts/` y `lib/`
3. **Prueba las APIs:** Usa Postman o Thunder Client
4. **Modifica estilos:** Edita archivos en `components/`
5. **Agrega funcionalidades:** Sigue la estructura existente

---

<div align="center">

**¡Listo para desarrollar! 🚀**

Si todo funciona correctamente, deberías poder ver la aplicación ejecutándose en tu navegador.

**¿Algo no funciona?** Revisa la sección de solución de problemas o contacta al equipo.

</div>
