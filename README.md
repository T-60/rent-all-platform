# 🏠 RENT+ALL - Plataforma de Alquiler entre Estudiantes

<div align="center">

![RENT+ALL Logo](public/placeholder-logo.svg)

[![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)

**Plataforma moderna y segura para el alquiler de productos entre estudiantes universitarios**

[🚀 Demo](#demo) • [📋 Características](#características) • [🛠️ Instalación](#instalación) • [📖 Uso](#uso) • [🤝 Contribuir](#contribuir)

</div>

---

## 📖 Descripción

RENT+ALL es una plataforma integral que conecta estudiantes universitarios para el alquiler de productos, desde electrónicos hasta herramientas y equipos deportivos. La aplicación facilita transacciones seguras, gestión de inventario y comunicación entre usuarios dentro del ecosistema universitario.

### 🎯 Objetivo Principal
Crear un marketplace estudiantil donde los universitarios puedan:
- **Alquilar productos** de otros estudiantes de forma segura
- **Monetizar productos** que no usan frecuentemente
- **Acceder a equipos costosos** a precios estudiantiles
- **Fomentar la economía circular** dentro del campus

---

## ✨ Características

### 🔐 **Sistema de Autenticación Robusto**
- Registro/Login con validación universitaria
- Autenticación JWT con tokens seguros
- Gestión de sesiones persistentes
- Protección de rutas automática

### 📦 **Gestión Completa de Productos**
- **Creación de productos** con múltiples imágenes
- **Categorización inteligente** (Electrónicos, Vehículos, Herramientas, etc.)
- **Sistema de disponibilidad** en tiempo real
- **Búsqueda y filtros** avanzados

### 🏠 **Sistema de Alquileres**
- **Reservas con fechas específicas**
- **Cálculo automático de costos**
- **Estados de alquiler** (Pendiente, Activo, Completado)
- **Historial completo** de transacciones

### 👤 **Perfiles de Usuario Completos**
- **Dashboard personalizado** con estadísticas
- **Gestión de productos publicados**
- **Historial de alquileres** realizados
- **Sistema de notificaciones**

### 🖼️ **Sistema de Imágenes Avanzado**
- **Carga múltiple de imágenes** con validación
- **Optimización automática** de tamaños
- **Fallbacks inteligentes** con placeholders
- **Indicadores de carga visuales**

### 📱 **Interfaz Moderna y Responsiva**
- Diseño **Mobile-First** con Tailwind CSS
- Componentes **reutilizables** con shadcn/ui
- **Animaciones fluidas** y transiciones
- **Tema oscuro/claro** (próximamente)

---

## 🏗️ Arquitectura del Sistema

### **Frontend (Next.js 14)**
```
app/
├── auth/           # Páginas de autenticación
├── dashboard/      # Panel de control
├── products/       # Gestión de productos
├── profile/        # Perfil de usuario
└── notifications/  # Sistema de notificaciones

components/
├── ui/            # Componentes base (shadcn/ui)
├── forms/         # Formularios especializados
├── layout/        # Componentes de layout
└── common/        # Componentes reutilizables

contexts/
├── auth-context.tsx      # Estado de autenticación
└── products-context.tsx  # Estado de productos
```

### **Backend (Node.js + Express)**
```
backend/
├── routes/
│   ├── auth.js      # Autenticación y usuarios
│   ├── products.js  # Gestión de productos
│   └── rentals.js   # Sistema de alquileres
├── middleware/
│   ├── auth.js      # Verificación JWT
│   └── upload.js    # Manejo de archivos
├── models/
│   ├── User.js      # Schema de usuarios
│   ├── Product.js   # Schema de productos
│   └── Rental.js    # Schema de alquileres
└── uploads/         # Almacenamiento de imágenes
```

### **Base de Datos (MongoDB)**
```
Collections:
├── users        # Información de usuarios
├── products     # Catálogo de productos
└── rentals      # Registro de alquileres
```

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 14.2+ | Framework React con SSR |
| **TypeScript** | 5.0+ | Tipado estático |
| **Tailwind CSS** | 3.4+ | Styling utility-first |
| **shadcn/ui** | Latest | Componentes UI |
| **React Hook Form** | 7.0+ | Gestión de formularios |
| **Axios** | 1.0+ | Cliente HTTP |

### **Backend**
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18.0+ | Runtime JavaScript |
| **Express.js** | 4.19+ | Framework web |
| **MongoDB** | 6.0+ | Base de datos NoSQL |
| **Mongoose** | 8.0+ | ODM para MongoDB |
| **JWT** | 9.0+ | Autenticación |
| **Multer** | 1.4+ | Manejo de archivos |
| **Helmet** | 7.0+ | Seguridad HTTP |

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Husky** - Git hooks
- **pnpm** - Gestor de paquetes

---

## 📋 Requisitos del Sistema

### **Requisitos Mínimos**
- **Node.js** 18.0 o superior
- **pnpm** 8.0 o superior
- **MongoDB** 6.0 o superior
- **Git** para control de versiones
- **4GB RAM** mínimo
- **2GB** de espacio en disco

### **Sistemas Operativos Soportados**
- ✅ **macOS** 10.15+
- ✅ **Windows** 10/11
- ✅ **Linux** Ubuntu 20.04+

### **Navegadores Compatibles**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🚀 Instalación Rápida

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/rent-all-platform.git
cd rent-all-platform
```

### **2. Instalar Dependencias**
```bash
# Frontend
pnpm install

# Backend
cd backend
npm install
cd ..
```

### **3. Configurar Variables de Entorno**
```bash
# Crear archivo .env.local
cp .env.example .env.local

# Editar con tus configuraciones
nano .env.local
```

### **4. Configurar Base de Datos**
```bash
# Iniciar MongoDB (según tu instalación)
mongod --dbpath /path/to/your/db

# O usar MongoDB Atlas (recomendado)
```

### **5. Ejecutar la Aplicación**
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
pnpm dev
```

### **6. Verificar Instalación**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/health

---

## ⚙️ Configuración Detallada

### **Variables de Entorno (.env.local)**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Database
MONGODB_URI=mongodb://localhost:27017/rentall
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/rentall

# JWT Secret
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# CORS Origins
CORS_ORIGIN=http://localhost:3000
```

### **Configuración de MongoDB**

#### **Opción A: MongoDB Local**
```bash
# Instalar MongoDB
brew install mongodb-community  # macOS
# O descargar desde https://www.mongodb.com/try/download/community

# Iniciar servicio
brew services start mongodb-community
```

#### **Opción B: MongoDB Atlas (Recomendado)**
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear cluster gratuito
3. Configurar usuario y contraseña
4. Obtener string de conexión
5. Agregar IP a whitelist

### **Configuración de Desarrollo**

#### **Scripts Disponibles**
```bash
# Frontend
pnpm dev          # Desarrollo
pnpm build        # Construcción para producción
pnpm start        # Servidor de producción
pnpm lint         # Verificar código
pnpm test         # Ejecutar tests

# Backend
npm start         # Servidor de desarrollo
npm run prod      # Servidor de producción
npm run test      # Ejecutar tests
npm run lint      # Verificar código
```

---

## 📖 Guía de Uso

### **1. Registro de Usuario**
1. Ir a `/auth/register`
2. Completar formulario con:
   - Nombre completo
   - Email universitario
   - Contraseña segura
   - Universidad
3. Verificar email (si está configurado)

### **2. Crear Producto**
1. Acceder al Dashboard (`/dashboard`)
2. Hacer clic en "Añadir Producto"
3. Completar información:
   - Título y descripción
   - Categoría
   - Precio por día
   - Dirección de recogida
   - Subir imágenes (máx. 5)

### **3. Alquilar Producto**
1. Buscar producto en catálogo
2. Ver detalles del producto
3. Seleccionar fechas de alquiler
4. Confirmar reserva
5. Contactar al propietario

### **4. Gestionar Alquileres**
1. Ir a Perfil (`/profile`)
2. Ver tabs:
   - "Productos que he Alquilado"
   - "Productos que he Publicado"
3. Seguir estado de alquileres
4. Gestionar disponibilidad

---

## 🧪 Testing y Desarrollo

### **Datos de Prueba**
Para facilitar el testing, puedes crear datos de prueba:

```bash
# Crear usuario de prueba
node create-test-user.js

# Crear productos de ejemplo
cd backend
node create-test-products.js
```

**Usuario de Prueba:**
- Email: `usuario1@universidad.edu`
- Password: `123456`

### **Scripts de Verificación**
```bash
# Verificar sistema completo
./verify-profile-images.sh

# Probar APIs
./test-api-complete.sh

# Verificar autenticación
./debug-auth-complete.sh
```

### **Páginas de Debug**
- `/image-debug` - Prueba de sistema de imágenes
- `/image-test` - Test de componentes de imagen

---

## 🎨 Personalización

### **Temas y Estilos**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### **Componentes Personalizados**
```typescript
// components/custom-component.tsx
export function CustomComponent() {
  return (
    <div className="bg-primary-50 p-4 rounded-lg">
      {/* Tu contenido personalizado */}
    </div>
  )
}
```

---

## 🔧 Solución de Problemas

### **Problemas Comunes**

#### **Frontend no inicia**
```bash
# Limpiar dependencias
rm -rf node_modules .next
pnpm install
pnpm dev
```

#### **Backend no conecta a MongoDB**
```bash
# Verificar MongoDB
mongosh --eval "db.runCommand({ping: 1})"

# Verificar variables de entorno
echo $MONGODB_URI
```

#### **Imágenes no cargan**
```bash
# Verificar permisos de uploads
chmod 755 backend/uploads/
chmod 644 backend/uploads/products/*

# Verificar servidor estático
curl -I http://localhost:3001/uploads/products/test-image.png
```

#### **Errores de CORS**
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### **Logs y Debugging**

#### **Frontend (DevTools)**
```javascript
// Abrir consola del navegador
// Buscar logs con prefijos:
// 🖼️ [SimpleSmartImage] - Sistema de imágenes
// 🛡️ [ProtectedRoute] - Autenticación
// 📦 [ProductsContext] - Estado de productos
```

#### **Backend (Terminal)**
```bash
# Logs con nivel de detalle
DEBUG=app:* npm start

# Logs específicos
DEBUG=app:auth,app:products npm start
```

---

## 📈 Roadmap

### **Versión 1.1 (Próxima)**
- [ ] Sistema de chat en tiempo real
- [ ] Notificaciones push
- [ ] Integración con pasarelas de pago
- [ ] Sistema de calificaciones y reseñas

### **Versión 1.2**
- [ ] App móvil (React Native)
- [ ] Sistema de verificación de identidad
- [ ] Integración con calendarios
- [ ] Analytics y reportes

### **Versión 2.0**
- [ ] Marketplace multi-universidad
- [ ] IA para recomendaciones
- [ ] Sistema de seguros
- [ ] API pública

---

## 🤝 Contribuir

### **Cómo Contribuir**
1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### **Estándares de Código**
```bash
# Antes de hacer commit
pnpm lint          # Verificar linting
pnpm test          # Ejecutar tests
pnpm build         # Verificar build
```

### **Estructura de Commits**
```
feat: agregar nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de formato
refactor: refactorización de código
test: agregar o modificar tests
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Equipo

### **Desarrolladores**
- **Tu Nombre** - *Full Stack Developer* - [@tu-github](https://github.com/tu-usuario)

### **Agradecimientos**
- shadcn/ui por los componentes
- Vercel por Next.js
- MongoDB por la base de datos
- Tailwind CSS por el sistema de diseño

---

## 📞 Contacto y Soporte

### **Contacto**
- **Email:** contacto@rentall.com
- **GitHub:** [github.com/tu-usuario/rent-all-platform](https://github.com/tu-usuario/rent-all-platform)
- **Discord:** [Servidor de Discord](https://discord.gg/tu-servidor)

### **Reportar Bugs**
Por favor usa el [sistema de issues](https://github.com/tu-usuario/rent-all-platform/issues) de GitHub para reportar bugs o solicitar nuevas funcionalidades.

### **Documentación Adicional**
- [Guía de API](docs/API.md)
- [Guía de Despliegue](docs/DEPLOYMENT.md)
- [Guía de Contribución](docs/CONTRIBUTING.md)

---

<div align="center">

**¿Te gusta RENT+ALL? ¡Dale una ⭐ al repositorio!**

Made with ❤️ by [Tu Nombre](https://github.com/tu-usuario)

</div>