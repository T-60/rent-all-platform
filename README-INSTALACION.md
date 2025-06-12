# 🚀 **RENT+ALL - Guía de Instalación para Desarrolladores**

<div align="center">

![RENT+ALL Logo](public/placeholder-logo.svg)

[![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)

**Plataforma de alquiler entre estudiantes - Setup completo para desarrollo**

</div>

---

## 📋 **¿Qué es RENT+ALL?**

RENT+ALL es una **plataforma moderna de alquiler** diseñada específicamente para estudiantes universitarios. Permite alquilar y publicar productos (electrónicos, herramientas, vehículos, etc.) de forma segura dentro del ecosistema estudiantil.

### ✨ **Características principales:**
- 🔐 **Autenticación segura** con JWT
- 📦 **Gestión completa de productos** con imágenes
- 🏠 **Sistema de alquileres** con fechas y costos
- 👤 **Perfiles de usuario** personalizables
- 🔔 **Notificaciones** en tiempo real
- 📱 **Responsive design** para móviles/tablets
- 🌐 **Multi-dispositivo** (funciona en red local)

---

## 🛠️ **INSTALACIÓN RÁPIDA**

### **📋 Prerrequisitos**

Asegúrate de tener instalado:

- **Node.js 18.0+** ([Descargar aquí](https://nodejs.org/))
- **PNPM** ([Instalar con](https://pnpm.io/installation): `npm install -g pnpm`)
- **Git** ([Descargar aquí](https://git-scm.com/))

### **⚡ Setup en 5 minutos**

#### **1. Clonar el repositorio**
```bash
git clone https://github.com/T-60/rent-all-platform.git
cd rent-all-platform
```

#### **2. Instalar dependencias del frontend**
```bash
pnpm install
```

#### **3. Instalar dependencias del backend**
```bash
cd backend
npm install
cd ..
```

#### **4. Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tus datos (opcional para desarrollo)
# La configuración por defecto funciona para pruebas locales
```

#### **5. ¡Ejecutar la aplicación!**
```bash
# Opción A: Script automático (recomendado)
./start-demo.sh

# Opción B: Manual
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend  
pnpm dev --hostname 0.0.0.0
```

#### **6. ¡Abrir en el navegador!**
```
🎯 Frontend: http://localhost:3000
🔧 Backend:  http://localhost:3001
🧪 Health:   http://localhost:3001/api/health
```

---

## 🌐 **CONFIGURACIÓN PARA PRUEBAS EN RED LOCAL**

### **¿Quieres probar en múltiples dispositivos?**

El proyecto está configurado para funcionar en **red local automáticamente**:

#### **1. Ejecutar con acceso en red:**
```bash
./start-demo.sh
```

#### **2. Obtener tu IP local:**
```bash
# El script te mostrará automáticamente:
# 📍 Frontend: http://TU-IP:3000
# 📍 Backend:  http://TU-IP:3001
```

#### **3. Conectar otros dispositivos:**
- **Móviles/tablets**: Abrir `http://TU-IP:3000` 
- **Otras PCs**: Mismo URL en cualquier navegador
- **Requisito**: Estar en la misma red WiFi

---

## 📁 **ESTRUCTURA DEL PROYECTO**

```
rent-all-platform/
├── 📱 Frontend (Next.js 15 + TypeScript)
│   ├── app/                    # App Router de Next.js
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── products/          # Gestión de productos
│   │   ├── profile/           # Perfil de usuario
│   │   └── notifications/     # Sistema de notificaciones
│   ├── components/            # Componentes React + shadcn/ui
│   ├── contexts/             # Contextos de estado global
│   ├── lib/                  # Utilidades y configuración
│   └── styles/               # Estilos globales
│
├── 🔧 Backend (Node.js + Express)
│   ├── server.js             # Servidor principal
│   ├── models/               # Modelos de MongoDB
│   ├── routes/               # Rutas de API
│   ├── controllers/          # Lógica de negocio
│   ├── middleware/           # Middlewares personalizados
│   └── services/             # Servicios auxiliares
│
└── 📄 Documentación y Scripts
    ├── start-demo.sh          # Script de inicio automático
    ├── GUIA-PRUEBA-RED-LOCAL.md
    └── README-INSTALACION.md  # Este archivo
```

---

## 🧪 **TESTING Y DESARROLLO**

### **🔍 Comandos útiles:**

```bash
# Compilar proyecto (verificar errores)
pnpm build

# Ejecutar en modo desarrollo
pnpm dev

# Verificar tipos TypeScript
pnpm type-check

# Formatear código
pnpm format

# Backend individual
cd backend && node server.js

# Logs del backend
cd backend && npm run dev
```

### **📱 Probar funcionalidades:**

1. **Registro de usuario**: Crear cuenta nueva
2. **Login**: Iniciar sesión  
3. **Crear producto**: Subir producto para alquilar
4. **Ver productos**: Explorar catálogo
5. **Perfil**: Gestionar información personal
6. **Responsive**: Probar en móvil/tablet

---

## 🐛 **RESOLUCIÓN DE PROBLEMAS**

### **❌ Error: "Cannot connect to database"**
```bash
# La app usa MongoDB Atlas (cloud) - funciona sin configuración
# Si persiste el error, verificar conexión a internet
```

### **❌ Error: "Port already in use"**
```bash
# Matar procesos en puertos 3000/3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### **❌ Error: "PNPM not found"**
```bash
# Instalar PNPM
npm install -g pnpm
```

### **❌ No se puede acceder desde otros dispositivos**
```bash
# Verificar que usas --hostname 0.0.0.0
pnpm dev --hostname 0.0.0.0

# O usar el script automático
./start-demo.sh
```

### **❌ Error de compilación TypeScript**
```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules
pnpm install
pnpm build
```

---

## 🚀 **FUNCIONALIDADES PRINCIPALES**

### **🔐 Autenticación**
- Registro con validación
- Login seguro con JWT
- Sesiones persistentes
- Logout automático

### **📦 Productos**
- Crear productos con imágenes
- Categorizar (Electrónicos, Vehículos, etc.)
- Búsqueda y filtros
- Disponibilidad en tiempo real

### **🏠 Alquileres**
- Reservar productos por fechas
- Cálculo automático de costos
- Estados de alquiler
- Historial completo

### **👤 Perfiles**
- Información personal
- Productos publicados
- Historial de alquileres
- Configuración de cuenta

---

## 🔧 **CONFIGURACIÓN AVANZADA**

### **🗄️ Base de datos**
El proyecto usa **MongoDB Atlas** (cloud) configurado automáticamente. No necesitas instalar MongoDB localmente.

### **🌐 Variables de entorno**
Archivo `.env.local` (opcional para desarrollo):
```env
# MongoDB (ya configurado automáticamente)
MONGODB_URI=mongodb+srv://...

# JWT Secret (generado automáticamente si no existe)
JWT_SECRET=tu-secreto-aqui

# Configuración de desarrollo
NODE_ENV=development
```

### **📸 Subida de imágenes**
Las imágenes se guardan localmente en `backend/uploads/`. Para producción, se puede configurar almacenamiento en cloud.

---

## 🤝 **COLABORACIÓN**

### **📋 Workflow sugerido:**

1. **Fork del repositorio**
2. **Crear rama feature**: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar y testear**: Usar `./start-demo.sh` para pruebas
4. **Commit con formato**: `feat: agregar nueva funcionalidad`
5. **Push y Pull Request**

### **🎯 Áreas para contribuir:**
- 🎨 **UI/UX**: Mejorar diseño y experiencia
- 🔧 **Backend**: Optimizaciones de API
- 🧪 **Testing**: Pruebas automatizadas  
- 📱 **Mobile**: Mejoras responsive
- 🔐 **Seguridad**: Validaciones y protecciones
- 📚 **Documentación**: Guías y tutoriales

---

## 📞 **SOPORTE Y CONTACTO**

### **🆘 ¿Necesitas ayuda?**

- **Issues**: [GitHub Issues](https://github.com/T-60/rent-all-platform/issues)
- **Documentación**: Ver archivos `GUIA-*.md` en el proyecto
- **Wiki**: [GitHub Wiki](https://github.com/T-60/rent-all-platform/wiki)

### **📄 Documentación adicional:**
- `GUIA-PRUEBA-RED-LOCAL.md` - Testing multi-dispositivo
- `LIMPIEZA-COMPLETADA.md` - Historial de optimizaciones
- `PLAN-CONTINGENCIA-UNIVERSIDAD.md` - Setup para presentaciones

---

## ✅ **CHECKLIST DE INSTALACIÓN**

### **Verificar que todo funciona:**

- [ ] ✅ Node.js 18+ instalado
- [ ] ✅ PNPM instalado  
- [ ] ✅ Repositorio clonado
- [ ] ✅ Dependencias instaladas (`pnpm install`)
- [ ] ✅ Backend dependencias (`cd backend && npm install`)
- [ ] ✅ Servidores iniciados (`./start-demo.sh`)
- [ ] ✅ Frontend carga en `http://localhost:3000`
- [ ] ✅ Backend responde en `http://localhost:3001/api/health`
- [ ] ✅ Registro de usuario funciona
- [ ] ✅ Login funciona
- [ ] ✅ Crear producto funciona
- [ ] ✅ Navegación por productos funciona

### **Para pruebas multi-dispositivo:**

- [ ] ✅ Script ejecutado con `./start-demo.sh`
- [ ] ✅ IP local detectada automáticamente
- [ ] ✅ Acceso desde móvil funciona
- [ ] ✅ Acceso desde otra PC funciona
- [ ] ✅ Misma red WiFi para todos los dispositivos

---

## 🎉 **¡LISTO PARA DESARROLLAR!**

Si completaste todos los pasos del checklist, **¡ya tienes RENT+ALL funcionando perfectamente!** 

### **🚀 Próximos pasos:**
1. **Explorar el código** para entender la arquitectura
2. **Probar todas las funcionalidades** 
3. **Experimentar con cambios** en el código
4. **Hacer tu primer contribution** 

### **💡 Tip para desarrolladores:**
Usa `./start-demo.sh` para iniciar rápidamente y `pnpm dev` + `node backend/server.js` para desarrollo más granular.

---

**🏗️ Hecho con ❤️ por el equipo de RENT+ALL**  
**📅 Última actualización: Junio 2025**  
**🏷️ Versión: 2.0 - Ultra Optimized**
