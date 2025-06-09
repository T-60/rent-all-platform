# Backend API - Plataforma de Alquiler

## 🚀 Inicio Rápido

### Instalación
```bash
cd backend
npm install
```

### Configuración de Base de Datos

#### Opción 1: MongoDB Local (Recomendado para desarrollo)
```bash
# Iniciar MongoDB local
brew services start mongodb/brew/mongodb-community

# Usar configuración local
npm run dev:local
```

#### Opción 2: MongoDB Atlas (Nube)
```bash
# Usar configuración de Atlas
npm run dev:atlas
```

### Scripts Disponibles
- `npm run dev` - Servidor en modo desarrollo (usa .env actual)
- `npm run dev:local` - Servidor con MongoDB local
- `npm run dev:atlas` - Servidor con MongoDB Atlas
- `npm start` - Servidor en modo producción
- `npm test` - Ejecutar tests

## 📡 API Endpoints

### Base URL
- **Local**: `http://localhost:3001/api`
- **Health Check**: `http://localhost:3001/api/health`

### Autenticación (`/auth`)

#### Registro de Usuario
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "password123",
  "phone": "1234567890"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "password123"
}
```

#### Perfil del Usuario
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

### Productos (`/products`)

#### Listar Productos
```bash
GET /api/products
# Parámetros opcionales:
# ?page=1&limit=10&category=electronics&search=cámara&sortBy=createdAt&sortOrder=desc
```

#### Obtener Producto
```bash
GET /api/products/:id
```

#### Crear Producto
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Campos requeridos:
# - title: string (mín. 3 caracteres)
# - description: string (mín. 10 caracteres)  
# - category: electronics|vehicles|tools|furniture|sports|others
# - pricePerDay: number (> 0)
# - location: string
# - images: archivo(s) de imagen (mín. 1, máx. 5)
```

#### Actualizar Producto
```bash
PUT /api/products/:id
Authorization: Bearer <token>
```

#### Eliminar Producto
```bash
DELETE /api/products/:id
Authorization: Bearer <token>
```

### Usuarios (`/users`)

#### Obtener Perfil
```bash
GET /api/users/profile
Authorization: Bearer <token>
```

#### Actualizar Perfil
```bash
PUT /api/users/profile
Authorization: Bearer <token>
```

### Alquileres (`/rentals`)

#### Crear Alquiler
```bash
POST /api/rentals
Authorization: Bearer <token>

{
  "productId": "648646a80c54cc2ee205c316",
  "startDate": "2025-06-15",
  "endDate": "2025-06-20"
}
```

#### Mis Alquileres
```bash
GET /api/rentals/my
Authorization: Bearer <token>
```

#### Alquileres de mis Productos
```bash
GET /api/rentals/owner
Authorization: Bearer <token>
```

## 🔧 Configuración

### Variables de Entorno

#### `.env.local` (MongoDB Local)
```
MONGODB_URI=mongodb://localhost:27017/rent-all-platform
JWT_SECRET=rent_all_platform_jwt_secret_2025_super_seguro
NODE_ENV=development
PORT=3001
```

#### `.env.atlas` (MongoDB Atlas)
```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/rent-all-platform?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=rent_all_platform_jwt_secret_2025_super_seguro
NODE_ENV=development
PORT=3001
```

## 📁 Estructura del Proyecto

```
backend/
├── models/          # Modelos de MongoDB
│   ├── User.js      # Modelo de usuario
│   ├── Product.js   # Modelo de producto
│   └── Rental.js    # Modelo de alquiler
├── routes/          # Rutas de la API
│   ├── auth.js      # Autenticación
│   ├── products.js  # Gestión de productos
│   ├── users.js     # Gestión de usuarios
│   └── rentals.js   # Gestión de alquileres
├── middleware/      # Middleware personalizado
│   └── auth.js      # Autenticación JWT
├── uploads/         # Archivos subidos
│   └── products/    # Imágenes de productos
├── server.js        # Servidor principal
├── .env            # Variables de entorno actuales
├── .env.local      # Configuración MongoDB local
└── .env.atlas      # Configuración MongoDB Atlas
```

## 🛠️ Desarrollo

### Cambiar entre Bases de Datos
```bash
# Cambiar a MongoDB local
npm run dev:local

# Cambiar a MongoDB Atlas
npm run dev:atlas
```

### Verificar Estado del Servidor
```bash
curl http://localhost:3001/api/health
```

### Ejemplo de Uso Completo
```bash
# 1. Registrar usuario
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456","phone":"1234567890"}'

# 2. Crear producto con imagen
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer <tu-token>" \
  -F "title=Mi Producto" \
  -F "description=Descripción del producto" \
  -F "category=electronics" \
  -F "pricePerDay=25" \
  -F "location=Madrid" \
  -F "images=@ruta/a/imagen.jpg"
```

## 🐛 Troubleshooting

### Puerto 5000 ocupado por AirTunes
El backend usa el puerto 3001 por defecto para evitar conflictos con AirTunes de macOS.

### MongoDB no conecta
1. Verificar que MongoDB esté ejecutándose:
   ```bash
   brew services list | grep mongodb
   ```
2. Iniciar MongoDB si no está ejecutándose:
   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

### Error de autenticación en Atlas
1. Verificar usuario y contraseña en MongoDB Atlas
2. Asegurarse de que la IP esté en la whitelist
3. Verificar que el cluster esté activo
