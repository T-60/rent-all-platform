# 📚 DOCUMENTACIÓN COMPLETA - RENT+ALL PLATFORM

## 🎯 **Resumen Ejecutivo**

**RENT+ALL** es una plataforma web moderna de alquiler de productos entre estudiantes universitarios, desarrollada con tecnologías de vanguardia y arquitectura escalable. El sistema permite a estudiantes publicar, buscar, alquilar y gestionar productos de forma segura e intuitiva.

## 🏗️ **Arquitectura del Sistema**

### **Stack Tecnológico Completo**

#### **Frontend (Next.js 14 + TypeScript)**
```typescript
📁 Frontend Stack:
├── 🎯 Next.js 14.2+ - Framework React con SSR/SSG
├── 🔷 TypeScript 5.0+ - Tipado estático y mejor DX
├── 🎨 Tailwind CSS 3.4+ - Styling utility-first
├── 🧩 shadcn/ui - Sistema de componentes modernos
├── 📋 React Hook Form 7.0+ - Gestión de formularios
├── 🌐 Axios 1.0+ - Cliente HTTP para APIs
├── 🔄 React Context API - Estado global
└── 📱 Responsive Design - Mobile-first
```

#### **Backend (Node.js + Express)**
```javascript
📁 Backend Stack:
├── 🟢 Node.js 18.0+ - Runtime JavaScript
├── ⚡ Express.js 4.19+ - Framework web minimalista
├── 🍃 MongoDB 6.0+ - Base de datos NoSQL
├── 🔗 Mongoose 8.0+ - ODM para MongoDB
├── 🔐 JWT 9.0+ - Autenticación stateless
├── 📁 Multer 1.4+ - Manejo de archivos/imágenes
├── 🛡️ Helmet 7.0+ - Seguridad HTTP
├── 🌐 CORS 2.8+ - Cross-Origin Resource Sharing
└── ✅ Express Validator 7.2+ - Validación de datos
```

#### **Herramientas de Desarrollo**
```bash
🔧 DevTools:
├── 📦 pnpm - Gestor de paquetes eficiente
├── 🔍 ESLint - Linting de código
├── 💅 Prettier - Formateo automático
├── 🐺 Husky - Git hooks
├── 🧪 Jest - Testing framework
└── 🔄 Nodemon - Hot reload para backend
```

---

## 📂 **Estructura del Proyecto**

### **Estructura de Directorios**
```
rent-all-platform/
├── 📁 app/                    # Next.js App Router
│   ├── auth/                  # 🔐 Páginas de autenticación
│   │   ├── login/page.tsx     # Login de usuarios
│   │   └── register/page.tsx  # Registro de usuarios
│   ├── dashboard/             # 🏠 Panel principal
│   │   └── page.tsx           # Dashboard con resumen
│   ├── products/              # 📦 Gestión de productos
│   │   ├── page.tsx           # Lista de productos
│   │   ├── [id]/page.tsx      # Detalles de producto
│   │   ├── add/page.tsx       # Crear producto
│   │   └── edit/[id]/page.tsx # Editar producto
│   ├── profile/               # 👤 Perfil de usuario
│   │   └── page.tsx           # Gestión de perfil y alquileres
│   ├── notifications/         # 🔔 Sistema de notificaciones
│   │   └── page.tsx           # Centro de notificaciones
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Página de inicio
│   └── globals.css            # Estilos globales
│
├── 📁 components/             # Componentes reutilizables
│   ├── ui/                    # 🎨 Componentes base (shadcn/ui)
│   │   ├── button.tsx         # Botones
│   │   ├── input.tsx          # Inputs
│   │   ├── card.tsx           # Tarjetas
│   │   ├── dialog.tsx         # Modales
│   │   ├── select.tsx         # Selectores
│   │   └── toast.tsx          # Notificaciones
│   ├── forms/                 # 📋 Formularios especializados
│   │   ├── add-product-form.tsx
│   │   ├── edit-product-form.tsx
│   │   └── rental-form.tsx
│   ├── layout/                # 🏗️ Componentes de layout
│   │   ├── sidebar.tsx        # Navegación lateral
│   │   └── navbar.tsx         # Barra de navegación
│   ├── product-card.tsx       # 📦 Tarjeta de producto
│   ├── simple-smart-image.tsx # 🖼️ Sistema de imágenes inteligente
│   └── protected-route.tsx    # 🛡️ Rutas protegidas
│
├── 📁 contexts/               # Estado global
│   ├── auth-context.tsx       # 🔐 Estado de autenticación
│   ├── products-context.tsx   # 📦 Estado de productos
│   └── notification-context.tsx # 🔔 Estado de notificaciones
│
├── 📁 lib/                    # Utilidades y configuraciones
│   ├── api.ts                 # 🌐 Cliente API
│   ├── utils.ts               # 🔧 Utilidades generales
│   ├── utils-api.ts           # 🔧 Utilidades de API
│   └── mock-data.ts           # 🎭 Datos de prueba
│
├── 📁 backend/                # Servidor Express
│   ├── models/                # 📊 Modelos de datos
│   │   ├── User.js            # Usuario
│   │   ├── Product.js         # Producto
│   │   ├── Rental.js          # Alquiler
│   │   └── Notification.js    # Notificación
│   ├── routes/                # 🛣️ Rutas de API
│   │   ├── auth.js            # Autenticación
│   │   ├── products.js        # Productos
│   │   ├── rentals.js         # Alquileres
│   │   ├── users.js           # Usuarios
│   │   └── notifications.js   # Notificaciones
│   ├── middleware/            # 🛡️ Middlewares
│   │   └── auth.js            # Verificación JWT
│   ├── services/              # 🔧 Servicios
│   │   └── NotificationService.js # Servicio de notificaciones
│   ├── uploads/               # 📁 Archivos subidos
│   │   └── products/          # Imágenes de productos
│   ├── server.js              # 🚀 Servidor principal
│   └── package.json           # Dependencias backend
│
├── 📁 public/                 # Archivos estáticos
│   ├── images/                # Imágenes públicas
│   └── icons/                 # Iconos
│
├── 📁 styles/                 # Estilos
│   └── globals.css            # CSS global
│
├── 📄 Configuration Files
├── .env.local                 # Variables de entorno
├── .env.example               # Ejemplo de variables
├── next.config.mjs            # Configuración Next.js
├── tailwind.config.ts         # Configuración Tailwind
├── tsconfig.json              # Configuración TypeScript
├── package.json               # Dependencias frontend
├── pnpm-lock.yaml             # Lock file pnpm
└── README.md                  # Documentación principal
```

---

## 🔧 **Configuración del Sistema**

### **Variables de Entorno (.env.local)**
```env
# 🌐 API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 🍃 Database Configuration
MONGODB_URI=mongodb://localhost:27017/rentall
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rentall

# 🔐 JWT Configuration
JWT_SECRET=rent_all_platform_jwt_secret_2025_super_seguro

# 📁 Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# 🌐 CORS Configuration
CORS_ORIGIN=http://localhost:3000

# 🚀 Server Configuration
PORT=3001
NODE_ENV=development
```

### **Configuración de Next.js (next.config.mjs)**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
    ],
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers personalizados
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
        ],
      },
    ];
  },
  
  // Configuración de TypeScript/ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
```

---

## 🗄️ **Modelos de Datos**

### **Usuario (User)**
```javascript
// backend/models/User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  university: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  location: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Funcionalidades:
// ✅ Encriptación automática de contraseñas
// ✅ Validación de email único
// ✅ Timestamps automáticos
// ✅ Método comparePassword para login
```

### **Producto (Product)**
```javascript
// backend/models/Product.js
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['electronics', 'vehicles', 'tools', 'furniture', 'sports', 'books', 'music']
  },
  pricePerDay: { type: Number, required: true, min: 0 },
  images: [{ type: String, required: true }], // URLs de imágenes
  pickupAddress: { type: String, required: true },
  returnAddress: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  reviews: [{ /* esquema de reseñas */ }],
}, { timestamps: true });

// Funcionalidades:
// ✅ Relación con usuario propietario
// ✅ Múltiples imágenes por producto
// ✅ Sistema de calificaciones
// ✅ Especificaciones flexibles
// ✅ Filtrado por disponibilidad
```

### **Alquiler (Rental)**
```javascript
// backend/models/Rental.js
const rentalSchema = new mongoose.Schema({
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'refunded'], 
    default: 'pending' 
  },
  notes: { type: String },
  deliveryMethod: { 
    type: String, 
    enum: ['pickup', 'delivery'], 
    default: 'pickup' 
  },
}, { timestamps: true });

// Estados del Alquiler:
// 🟡 pending - Solicitud pendiente de aprobación
// ✅ confirmed - Confirmado por el propietario
// 🔵 active - Alquiler en curso
// ✅ completed - Completado exitosamente
// ❌ cancelled - Cancelado
```

### **Notificación (Notification)**
```javascript
// backend/models/Notification.js
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['rental_request', 'rental_confirmed', 'rental_cancelled', 'system'], 
    required: true 
  },
  read: { type: Boolean, default: false },
  relatedRental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental' },
  relatedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
}, { timestamps: true });

// Tipos de Notificaciones:
// 📋 rental_request - Nueva solicitud de alquiler
// ✅ rental_confirmed - Alquiler confirmado
// ❌ rental_cancelled - Alquiler cancelado
// ⚙️ system - Notificaciones del sistema
```

---

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**
```bash
# Verificar versiones requeridas
node --version     # ≥ 18.0.0
pnpm --version     # ≥ 8.0.0
mongosh --version  # ≥ 6.0.0 (para MongoDB local)
git --version      # Cualquier versión reciente
```

### **Instalación Completa**
```bash
# 1️⃣ Clonar repositorio
git clone [URL_DEL_REPOSITORIO]
cd rent-all-platform

# 2️⃣ Instalar dependencias del frontend
pnpm install

# 3️⃣ Instalar dependencias del backend
cd backend
npm install
cd ..

# 4️⃣ Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# 5️⃣ Crear datos de prueba (opcional)
node create-test-user.js

# 6️⃣ Verificar instalación
./verify-setup.sh
```

### **Ejecución del Sistema**
```bash
# Terminal 1: Backend
cd backend
npm start
# ✅ Servidor corriendo en http://localhost:3001

# Terminal 2: Frontend
pnpm dev
# ✅ Aplicación corriendo en http://localhost:3000

# O ejecutar ambos simultáneamente:
pnpm run full-dev
```

---

## 🌐 **API Endpoints**

### **Autenticación (/api/auth)**
```javascript
// 🔐 Registro de usuario
POST /api/auth/register
Body: { name, email, password, university, phone? }
Response: { token, user, message }

// 🔐 Login de usuario
POST /api/auth/login
Body: { email, password }
Response: { token, user, message }

// 🔐 Verificar perfil
GET /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Response: { user }

// 🔐 Verificar token
POST /api/auth/verify
Headers: { Authorization: "Bearer <token>" }
Response: { user, message }
```

### **Productos (/api/products)**
```javascript
// 📦 Listar productos (CON FILTRADO DE ALQUILADOS)
GET /api/products?page=1&limit=12&category=electronics&search=laptop
Response: { 
  products: [...], 
  pagination: { currentPage, totalPages, totalProducts, hasNextPage, hasPrevPage }
}

// 📦 Obtener producto específico
GET /api/products/:id
Response: { product }

// 📦 Crear nuevo producto
POST /api/products
Headers: { Authorization: "Bearer <token>" }
Body: FormData { title, description, category, pricePerDay, images[], pickupAddress, returnAddress }
Response: { message, product }

// 📦 Actualizar producto
PUT /api/products/:id
Headers: { Authorization: "Bearer <token>" }
Body: { título, descripción, etc. }
Response: { message, product }

// 📦 Eliminar producto
DELETE /api/products/:id
Headers: { Authorization: "Bearer <token>" }
Response: { message }

// 📦 Productos del usuario
GET /api/products/user/my-products
Headers: { Authorization: "Bearer <token>" }
Response: { products }

// 📦 Agregar reseña
POST /api/products/:id/reviews
Headers: { Authorization: "Bearer <token>" }
Body: { rating, comment }
Response: { message, product }
```

### **Alquileres (/api/rentals)**
```javascript
// 🏠 Crear solicitud de alquiler
POST /api/rentals
Headers: { Authorization: "Bearer <token>" }
Body: { productId, startDate, endDate, notes?, deliveryMethod? }
Response: { message, rental }

// 🏠 Listar alquileres del usuario (como inquilino)
GET /api/rentals/my-rentals
Headers: { Authorization: "Bearer <token>" }
Response: { rentals }

// 🏠 Listar solicitudes recibidas (como propietario)
GET /api/rentals/my-listings
Headers: { Authorization: "Bearer <token>" }
Response: { rentals }

// 🏠 Obtener alquiler específico
GET /api/rentals/:id
Headers: { Authorization: "Bearer <token>" }
Response: { rental }

// 🏠 Actualizar estado de alquiler
PUT /api/rentals/:id/status
Headers: { Authorization: "Bearer <token>" }
Body: { status: 'confirmed' | 'cancelled' }
Response: { message, rental }

// 🏠 Verificar disponibilidad
GET /api/rentals/availability/:productId?startDate=2024-01-01&endDate=2024-01-03
Response: { available, conflictingRentals? }

// 🏠 Cancelar alquiler
PUT /api/rentals/:id/cancel
Headers: { Authorization: "Bearer <token>" }
Response: { message, rental }
```

### **Notificaciones (/api/notifications)**
```javascript
// 🔔 Obtener notificaciones del usuario
GET /api/notifications
Headers: { Authorization: "Bearer <token>" }
Response: { notifications }

// 🔔 Marcar como leída
PUT /api/notifications/:id/read
Headers: { Authorization: "Bearer <token>" }
Response: { message, notification }

// 🔔 Marcar todas como leídas
PUT /api/notifications/mark-all-read
Headers: { Authorization: "Bearer <token>" }
Response: { message, updatedCount }

// 🔔 Eliminar notificación
DELETE /api/notifications/:id
Headers: { Authorization: "Bearer <token>" }
Response: { message }
```

---

## 🔐 **Sistema de Autenticación**

### **Flujo de Autenticación**
```javascript
// 1️⃣ Registro/Login → JWT Token
// 2️⃣ Token almacenado en localStorage
// 3️⃣ Token enviado en header Authorization
// 4️⃣ Middleware auth.js verifica token
// 5️⃣ Usuario agregado a req.user

// Middleware de Autenticación (backend/middleware/auth.js)
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Rutas Protegidas vs Públicas
// 🔓 Públicas: GET /api/products, GET /api/products/:id
// 🔐 Protegidas: Todo lo demás (crear, editar, alquilar)
```

### **Context de Autenticación (Frontend)**
```typescript
// contexts/auth-context.tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

// Funcionalidades:
// ✅ Estado global de autenticación
// ✅ Persistencia en localStorage
// ✅ Verificación automática de token
// ✅ Redirección automática
// ✅ Loading states
```

---

## 📦 **Sistema de Productos y Filtrado de Alquilados**

### **Funcionalidad Clave: Ocultar Productos Alquilados**
```javascript
// backend/routes/products.js - Líneas 123-205
// ✅ IMPLEMENTACIÓN COMPLETADA

// 1️⃣ Buscar productos con filtros básicos
let products = await Product.find(filters)
  .populate('owner', 'name email avatar location')
  .sort(sortOptions)
  .skip(skip)
  .limit(Number(limit));

// 2️⃣ Obtener productos con alquileres activos
const Rental = require('../models/Rental');
const rentedProductIds = await Rental.distinct('product', {
  status: { $in: ['confirmed', 'active'] }
});

// 3️⃣ Filtrar productos excluyendo los alquilados
const availableProducts = products.filter(product => 
  !rentedProductIds.some(rentedId => 
    rentedId.toString() === product._id.toString()
  )
);

// 4️⃣ Recalcular paginación
const allMatchingProducts = await Product.find(filters).select('_id');
const actuallyAvailableCount = allMatchingProducts.filter(product => 
  !rentedProductIds.some(rentedId => 
    rentedId.toString() === product._id.toString()
  )
).length;

const totalPages = Math.ceil(actuallyAvailableCount / limit);

// 5️⃣ Respuesta con productos realmente disponibles
res.json({
  products: availableProducts,
  pagination: {
    currentPage: Number(page),
    totalPages,
    totalProducts: actuallyAvailableCount, // ✅ Conteo real
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }
});

// Estados de Alquiler que Ocultan Productos:
// ✅ 'confirmed' - Alquiler confirmado por propietario
// ✅ 'active' - Alquiler en curso
// 
// Estados que NO Ocultan Productos:
// ⚪ 'pending' - Solo solicitud, aún disponible
// ⚪ 'completed' - Alquiler terminado, disponible nuevamente
// ⚪ 'cancelled' - Alquiler cancelado, disponible
```

### **Context de Productos (Frontend)**
```typescript
// contexts/products-context.tsx
interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  filters: ProductFilters;
  fetchProducts: () => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  clearProductsCache: () => void;
  refreshProducts: () => Promise<void>;
}

// Funcionalidades:
// ✅ Cache inteligente de productos
// ✅ Filtrado y búsqueda
// ✅ Paginación automática
// ✅ Actualización en tiempo real
// ✅ Gestión de errores
```

---

## 📁 **Sistema de Manejo de Archivos**

### **Configuración de Multer (Backend)**
```javascript
// backend/routes/products.js
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/products');
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
  }
});

// Características:
// ✅ Múltiples imágenes por producto
// ✅ Validación de tipos de archivo
// ✅ Límite de tamaño (5MB)
// ✅ Nombres únicos para evitar conflictos
// ✅ Creación automática de directorios
```

### **Servir Archivos Estáticos (Backend)**
```javascript
// backend/server.js
app.use('/uploads', (req, res, next) => {
  console.log('📁 Solicitud de archivo estático:', req.url);
  
  // Headers CORS para imágenes
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=31536000');
  },
  fallthrough: false
}));

// Características:
// ✅ CORS configurado para imágenes
// ✅ Cache de 1 año para imágenes
// ✅ Logging detallado
// ✅ Manejo de errores 404
```

### **Componente de Imágenes Inteligente (Frontend)**
```typescript
// components/simple-smart-image.tsx
interface SimpleSmartImageProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  debugId?: string;
}

// Funcionalidades:
// ✅ Validación de URLs antes de cargar
// ✅ Fallback automático en caso de error
// ✅ Logging detallado para debugging
// ✅ Optimización de carga
// ✅ Manejo de estados de carga
```

---

## 🔔 **Sistema de Notificaciones**

### **Servicio de Notificaciones (Backend)**
```javascript
// backend/services/NotificationService.js
class NotificationService {
  // Crear notificación de nueva solicitud
  static async createRentalRequestNotification(rental) {
    return await Notification.create({
      user: rental.owner,
      title: 'Nueva solicitud de alquiler',
      message: `${rental.renter.name} quiere alquilar tu producto "${rental.product.title}"`,
      type: 'rental_request',
      relatedRental: rental._id,
      relatedProduct: rental.product._id
    });
  }

  // Crear notificación de confirmación
  static async createRentalConfirmedNotification(rental) {
    return await Notification.create({
      user: rental.renter,
      title: 'Alquiler confirmado',
      message: `Tu solicitud para "${rental.product.title}" ha sido confirmada`,
      type: 'rental_confirmed',
      relatedRental: rental._id,
      relatedProduct: rental.product._id
    });
  }

  // Y más tipos de notificaciones...
}

// Tipos de Notificaciones:
// 📋 rental_request - Nueva solicitud
// ✅ rental_confirmed - Alquiler confirmado  
// ❌ rental_cancelled - Alquiler cancelado
// ⚙️ system - Notificaciones del sistema
```

### **Context de Notificaciones (Frontend)**
```typescript
// contexts/notification-context.tsx
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

// Funcionalidades:
// ✅ Estado global de notificaciones
// ✅ Contador de no leídas
// ✅ Actualización en tiempo real
// ✅ Acciones masivas
```

---

## 🚀 **Scripts Útiles**

### **Scripts del Frontend (package.json)**
```json
{
  "scripts": {
    "dev": "next dev",                    // 🔥 Desarrollo
    "build": "next build",                // 📦 Construir para producción
    "start": "next start",                // 🚀 Servidor de producción
    "lint": "next lint",                  // 🔍 Verificar código
    "setup": "cp .env.example .env.local && pnpm install && cd backend && npm install",
    "verify": "./verify-setup.sh",        // ✅ Verificar instalación
    "test-data": "node create-test-user.js", // 🎭 Crear datos de prueba
    "backend": "cd backend && npm start", // 🔧 Solo backend
    "full-dev": "concurrently \"cd backend && npm start\" \"pnpm dev\"", // 🚀 Frontend + Backend
    "clean": "rm -rf .next node_modules backend/node_modules", // 🧹 Limpiar
    "reinstall": "pnpm run clean && pnpm install && cd backend && npm install" // 🔄 Reinstalar todo
  }
}
```

### **Scripts del Backend (backend/package.json)**
```json
{
  "scripts": {
    "start": "node server.js",            // 🚀 Servidor de producción
    "dev": "nodemon server.js",           // 🔥 Desarrollo con hot reload
    "dev:atlas": "cp .env.atlas .env && nodemon server.js",  // ☁️ MongoDB Atlas
    "dev:local": "cp .env.local .env && nodemon server.js",  // 🏠 MongoDB Local
    "test": "jest"                        // 🧪 Ejecutar tests
  }
}
```

### **Scripts de Utilidades**
```bash
# 🔧 Verificar que todo funciona
./verify-setup.sh

# 🎭 Crear usuario de prueba
node create-test-user.js

# 🧹 Limpiar caché y datos
./clean-all-data.sh

# 🖼️ Verificar sistema de imágenes
./verify-profile-images.sh

# 🌐 Configurar para red universitaria
./setup-university-network.sh
```

---

## 🔍 **Debugging y Logs**

### **Logs del Frontend (DevTools Console)**
```javascript
// 🖼️ Sistema de imágenes
[SimpleSmartImage-ProductCard-123] 🖼️ URL inicial: {...}
[SimpleSmartImage-ProductCard-123] ✅ Imagen cargada exitosamente

// 🛡️ Autenticación
[ProtectedRoute] 🔐 Verificando autenticación...
[AuthContext] ✅ Usuario autenticado: usuario@email.com

// 📦 Productos
[ProductsContext] 📦 Cargando productos con filtros: {...}
[ProductsContext] ✅ 15 productos cargados, 2 filtrados por alquileres activos
```

### **Logs del Backend (Terminal)**
```bash
# 🔧 Requests generales
🔧 GET /api/products - Origin: http://localhost:3000
🔧 POST /api/rentals - Origin: http://localhost:3000

# 📁 Archivos estáticos  
📁 Solicitud de archivo estático: /uploads/products/image.jpg
✅ Archivo servido exitosamente: /uploads/products/image.jpg

# 🏠 Alquileres
🏠 Nuevo alquiler creado: {...}
🏠 Estado actualizado: pending → confirmed

# 🔔 Notificaciones
🔔 Notificación creada: rental_request para usuario 123
🔔 Email enviado exitosamente
```

### **Configuración de Debugging**
```bash
# Backend con logs detallados
DEBUG=app:* npm start

# Logs específicos
DEBUG=app:auth,app:products npm start

# Frontend con React DevTools
# Instalar extensión React Developer Tools
# Activar "Profiler" para análisis de rendimiento
```

---

## 📊 **Base de Datos**

### **Configuración de MongoDB**

#### **Opción 1: MongoDB Local**
```bash
# macOS
brew install mongodb/brew/mongodb-community
brew services start mongodb/brew/mongodb-community

# Linux
sudo apt-get install mongodb

# Windows
# Descargar desde https://www.mongodb.com/try/download/community

# Verificar conexión
mongosh --eval "db.runCommand({ping: 1})"
```

#### **Opción 2: MongoDB Atlas (Recomendado)**
```javascript
// 1️⃣ Crear cuenta en https://cloud.mongodb.com
// 2️⃣ Crear cluster gratuito
// 3️⃣ Configurar usuario y contraseña
// 4️⃣ Whitelist IP (0.0.0.0/0 para desarrollo)
// 5️⃣ Obtener connection string

// Connection String Example:
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/rentall?retryWrites=true&w=majority
```

### **Colecciones Principales**
```javascript
// 👥 users - Usuarios del sistema
db.users.find().count()  // Total usuarios

// 📦 products - Productos disponibles  
db.products.find({ available: true }).count()  // Productos disponibles

// 🏠 rentals - Historial de alquileres
db.rentals.find({ status: "active" }).count()  // Alquileres activos

// 🔔 notifications - Notificaciones
db.notifications.find({ read: false }).count()  // No leídas
```

### **Índices para Performance**
```javascript
// Índices automáticos por Mongoose
db.users.createIndex({ email: 1 })           // Email único
db.products.createIndex({ owner: 1 })        // Productos por propietario
db.products.createIndex({ category: 1 })     // Filtrado por categoría
db.rentals.createIndex({ renter: 1 })        // Alquileres por inquilino
db.rentals.createIndex({ owner: 1 })         // Solicitudes por propietario
db.rentals.createIndex({ product: 1, status: 1 })  // Disponibilidad de productos
```

---

## 🛡️ **Seguridad**

### **Medidas de Seguridad Implementadas**

#### **Backend Security**
```javascript
// 🛡️ Helmet - Headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:*"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

// 🌐 CORS configurado
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002', 
    'http://192.168.0.105:3000'
  ],
  credentials: true
}));

// 🔐 JWT con expiración
const token = jwt.sign(
  { userId: user._id }, 
  process.env.JWT_SECRET, 
  { expiresIn: '7d' }  // Token expira en 7 días
);

// ✅ Validación de datos con Express Validator
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 6 }),
body('pricePerDay').isNumeric().custom(value => value > 0)
```

#### **Frontend Security**
```typescript
// 🔐 Rutas protegidas
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// 🛡️ Validación de inputs
const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  pricePerDay: z.number().positive("Debe ser mayor a 0")
});

// 🔄 Auto-logout en token expirado
useEffect(() => {
  const interceptor = apiClient.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        logout();  // Auto-logout
      }
      return Promise.reject(error);
    }
  );
}, []);
```

### **Validaciones de Datos**
```javascript
// Backend - Validación exhaustiva
const productValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('category').isIn(['electronics', 'vehicles', 'tools', 'furniture', 'sports', 'books', 'music']),
  body('pricePerDay').isFloat({ min: 0.01 }),
  body('pickupAddress').trim().isLength({ min: 5 }),
  body('returnAddress').trim().isLength({ min: 5 })
];

// Frontend - Validación en tiempo real
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(productSchema)
});
```

---

## 🧪 **Testing y QA**

### **Datos de Prueba**
```javascript
// create-test-user.js
const testUsers = [
  {
    name: "Usuario Demo",
    email: "demo@universidad.edu", 
    password: "123456",
    university: "Universidad Demo"
  }
];

// Crear datos con:
node create-test-user.js
```

### **URLs para Testing**
```bash
# 🏠 Aplicación principal
http://localhost:3000

# 🔐 Páginas de autenticación
http://localhost:3000/auth/login
http://localhost:3000/auth/register

# 📦 Gestión de productos
http://localhost:3000/products
http://localhost:3000/products/add

# 👤 Perfil y alquileres
http://localhost:3000/profile

# 🔔 Notificaciones
http://localhost:3000/notifications

# 🩺 Health check backend
http://localhost:3001/api/health
```

### **Escenarios de Prueba**
```javascript
// 🧪 Flujo completo de alquiler
// 1️⃣ Registrar usuario A (propietario)
// 2️⃣ Crear producto 
// 3️⃣ Registrar usuario B (inquilino)
// 4️⃣ Solicitar alquiler
// 5️⃣ Confirmar alquiler (usuario A)
// 6️⃣ Verificar que producto no aparece en lista
// 7️⃣ Completar alquiler
// 8️⃣ Verificar que producto vuelve a estar disponible

// ✅ Casos de prueba implementados:
// - Autenticación completa
// - CRUD de productos
// - Sistema de alquileres
// - Notificaciones
// - Manejo de errores
// - Validación de formularios
```

---

## 📈 **Performance y Optimización**

### **Optimizaciones Implementadas**

#### **Frontend**
```typescript
// ⚡ Lazy Loading de componentes
const ProductCard = lazy(() => import('./components/product-card'));

// 🖼️ Optimización de imágenes
<Image
  src={imageUrl}
  alt={alt}
  width={400}
  height={300}
  priority={false}
  placeholder="blur"
/>

// 📱 Responsive images
const ImageComponent = {
  sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
};

// 🔄 Memoización de componentes
const ProductCard = React.memo(({ product }) => {
  // Component implementation
});

// 📦 Context optimizado
const ProductsContext = createContext();
const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};
```

#### **Backend**
```javascript
// 🗄️ Consultas optimizadas
// Solo campos necesarios
const products = await Product.find(filters)
  .select('title description pricePerDay images owner category')
  .populate('owner', 'name email avatar')
  .lean(); // Objetos JS planos (más rápido)

// 📊 Agregación eficiente para alquileres
const rentedProductIds = await Rental.distinct('product', {
  status: { $in: ['confirmed', 'active'] }
});

// 🗃️ Índices de base de datos
productSchema.index({ category: 1, available: 1 });
productSchema.index({ owner: 1 });
rentalSchema.index({ product: 1, status: 1 });

// 🔄 Cache de archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1y',  // Cache de 1 año
  etag: true,
  lastModified: true
}));
```

### **Métricas de Performance**
```javascript
// 📊 Tiempos objetivo
// - Carga inicial: < 2s
// - Navegación entre páginas: < 500ms  
// - Búsqueda de productos: < 1s
// - Carga de imágenes: < 3s
// - Respuesta de API: < 200ms

// 🔍 Monitoring
console.time('ProductsQuery');
const products = await Product.find(filters);
console.timeEnd('ProductsQuery');

// 📈 Lighthouse Score objetivo
// - Performance: > 90
// - Accessibility: > 95
// - Best Practices: > 90
// - SEO: > 90
```

---

## 🚀 **Despliegue**

### **Preparación para Producción**

#### **Frontend (Vercel/Netlify)**
```bash
# 📦 Build de producción
pnpm build

# 🚀 Deploy a Vercel
npm i -g vercel
vercel

# Variables de entorno en Vercel:
# NEXT_PUBLIC_API_URL=https://tu-backend.herokuapp.com/api
```

#### **Backend (Railway/Heroku)**
```bash
# 🚀 Deploy a Railway
npm i -g @railway/cli
railway login
railway init
railway up

# 🚀 Deploy a Heroku
npm i -g heroku
heroku create tu-app-backend
git push heroku main

# Variables de entorno necesarias:
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=tu_secreto_super_seguro
# NODE_ENV=production
# PORT=3001
```

### **Configuración de Producción**
```javascript
// next.config.mjs - Producción
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['tu-backend-domain.com'],
    unoptimized: false  // Activar optimización en producción
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
};

// backend/server.js - Producción
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-frontend.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
};
```

---

## 📞 **Soporte y Mantenimiento**

### **Logs y Monitoreo**
```javascript
// 📊 Sistema de logs estructurado
const logger = {
  info: (message, data) => console.log(`ℹ️ ${message}`, data),
  error: (message, error) => console.error(`❌ ${message}`, error),
  warn: (message, data) => console.warn(`⚠️ ${message}`, data),
  debug: (message, data) => console.debug(`🐛 ${message}`, data)
};

// 📈 Métricas importantes
// - Usuarios activos diarios
// - Productos publicados/día
// - Alquileres confirmados/día
// - Errores de API/hora
// - Tiempo de respuesta promedio
```

### **Backup y Recuperación**
```bash
# 💾 Backup de MongoDB
mongodump --uri="mongodb://localhost:27017/rentall" --out="/backup/$(date +%Y%m%d)"

# 🔄 Restore de MongoDB  
mongorestore --uri="mongodb://localhost:27017/rentall" /backup/20240101

# 📁 Backup de imágenes
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/
```

### **Escalabilidad**
```javascript
// 🚀 Mejoras futuras para escalar
// - Redis para cache de sesiones
// - CDN para imágenes (Cloudinary/AWS S3)
// - Load balancer para múltiples instancias
// - Database sharding
// - Microservicios separados
// - WebSockets para notificaciones en tiempo real
```

---

## 📋 **Checklist de Desarrollo**

### **Para Desarrolladores**
- [ ] ✅ Node.js 18+ instalado
- [ ] ✅ Git configurado correctamente
- [ ] ✅ Editor con extensiones TS/React
- [ ] ✅ MongoDB configurado (local o Atlas)
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Dependencias instaladas (frontend + backend)
- [ ] ✅ Aplicación ejecutándose sin errores
- [ ] ✅ Tests básicos pasando
- [ ] ✅ Hot reload funcionando

### **Para Testing/QA**
- [ ] ✅ Datos de prueba creados
- [ ] ✅ Flujos principales probados
- [ ] ✅ Responsive design verificado
- [ ] ✅ Cross-browser testing
- [ ] ✅ Performance testing
- [ ] ✅ Casos edge documentados
- [ ] ✅ Errores manejados correctamente

### **Para Product Managers**
- [ ] ✅ Features principales implementadas
- [ ] ✅ User stories validadas
- [ ] ✅ UX/UI reviewed
- [ ] ✅ Business logic correcta
- [ ] ✅ Métricas definidas
- [ ] ✅ Documentación actualizada

---

<div align="center">

## 🎉 **¡Sistema Completamente Documentado!**

**RENT+ALL Platform** está listo para desarrollo, testing y producción.

### 📚 **Documentos Relacionados**
- [FUNCIONALIDAD_PRODUCTOS_ALQUILADOS.md](./FUNCIONALIDAD_PRODUCTOS_ALQUILADOS.md)
- [SETUP.md](./SETUP.md) 
- [README.md](./README.md)

### 🔗 **Links Útiles**
- 🏠 **Frontend**: http://localhost:3000
- 🔧 **Backend**: http://localhost:3001  
- 🩺 **Health Check**: http://localhost:3001/api/health
- 📊 **MongoDB Compass**: mongodb://localhost:27017/rentall

</div>
