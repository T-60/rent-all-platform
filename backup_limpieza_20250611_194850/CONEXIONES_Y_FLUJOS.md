# 🔗 CONEXIONES Y FLUJOS DEL SISTEMA - RENT+ALL

## 🌐 **Arquitectura de Conexiones**

### **Diagrama de Conexiones**
```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    Mongoose     ┌─────────────────┐
│                 │ ──────────────> │                 │ ──────────────> │                 │
│   FRONTEND      │    Port 3000    │    BACKEND      │    Port 27017   │    MONGODB      │
│   (Next.js)     │ <────────────── │   (Express)     │ <────────────── │    (Database)   │
│                 │    JSON/JWT     │                 │    Documents    │                 │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
        │                                    │                                    │
        │                                    │                                    │
        v                                    v                                    v
┌─────────────────┐                 ┌─────────────────┐                 ┌─────────────────┐
│   BROWSER       │                 │   FILE SYSTEM   │                 │   COLLECTIONS   │
│   localStorage  │                 │   /uploads      │                 │   users         │
│   sessionStorage│                 │   /products     │                 │   products      │
│   React Context│                 │   Static Files  │                 │   rentals       │
│                 │                 │                 │                 │   notifications │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
```

---

## 🔄 **Flujos de Datos Principales**

### **1. 🔐 Flujo de Autenticación**
```typescript
// Frontend (Login)
┌─────────────────────────────────────────────────────────────────┐
│ 1️⃣ Usuario ingresa credenciales en /auth/login                  │
│ 2️⃣ AuthContext.login() → apiService.login()                    │
│ 3️⃣ POST /api/auth/login { email, password }                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                v
// Backend (Autenticación)
┌─────────────────────────────────────────────────────────────────┐
│ 4️⃣ routes/auth.js recibe request                               │
│ 5️⃣ Busca usuario en MongoDB: User.findOne({ email })          │
│ 6️⃣ Compara contraseña: user.comparePassword(password)         │
│ 7️⃣ Genera JWT: jwt.sign({ userId }, JWT_SECRET, { expiresIn }) │
│ 8️⃣ Responde: { token, user, message }                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                v
// Frontend (Almacenamiento)
┌─────────────────────────────────────────────────────────────────┐
│ 9️⃣ AuthContext guarda token en localStorage                    │
│ 🔟 AuthContext actualiza estado: { user, token, isAuthenticated }│
│ 1️⃣1️⃣ ProtectedRoute permite acceso a rutas privadas           │
│ 1️⃣2️⃣ API client agrega token a headers: Authorization: Bearer  │
└─────────────────────────────────────────────────────────────────┘

// Código Frontend
const login = async (email: string, password: string) => {
  const response = await apiService.login({ email, password });
  
  localStorage.setItem('token', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
  
  setToken(response.token);
  setUser(response.user);
  setIsAuthenticated(true);
};

// Código Backend
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || !await user.comparePassword(password)) {
    return res.status(400).json({ message: 'Credenciales inválidas' });
  }
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  res.json({ token, user: { id: user._id, name: user.name, email: user.email }, message: 'Login exitoso' });
});
```

### **2. 📦 Flujo de Productos (Con Filtrado de Alquilados)**
```typescript
// Frontend (Solicitud)
┌─────────────────────────────────────────────────────────────────┐
│ 1️⃣ Usuario visita /products                                     │
│ 2️⃣ ProductsContext.fetchProducts() se ejecuta                  │
│ 3️⃣ GET /api/products?page=1&limit=12&category=electronics      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                v
// Backend (Procesamiento con Filtrado)
┌─────────────────────────────────────────────────────────────────┐
│ 4️⃣ routes/products.js GET / endpoint                           │
│ 5️⃣ Construye filtros: { available: true, category?, search? }  │
│ 6️⃣ Busca productos: Product.find(filters).populate('owner')   │
│ 7️⃣ 🔥 FILTRADO DE ALQUILADOS:                                 │
│     a. Rental.distinct('product', { status: ['confirmed', 'active'] })│
│     b. Filtra productos excluyendo IDs alquilados             │
│ 8️⃣ Recalcula paginación con productos realmente disponibles   │
│ 9️⃣ Responde: { products, pagination }                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                v
// Frontend (Actualización)
┌─────────────────────────────────────────────────────────────────┐
│ 🔟 ProductsContext actualiza estado                            │
│ 1️⃣1️⃣ Componentes se re-renderizan con productos disponibles   │
│ 1️⃣2️⃣ Paginación muestra conteo real (sin productos alquilados)│
│ 1️⃣3️⃣ ProductCard renderiza cada producto disponible           │
└─────────────────────────────────────────────────────────────────┘

// Código Backend (Filtrado de Alquilados)
router.get('/', optionalAuth, async (req, res) => {
  // Buscar productos básicos
  let products = await Product.find(filters)
    .populate('owner', 'name email avatar location')
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  // 🔥 FUNCIONALIDAD CLAVE: Filtrar productos alquilados
  const Rental = require('../models/Rental');
  const rentedProductIds = await Rental.distinct('product', {
    status: { $in: ['confirmed', 'active'] }
  });

  // Excluir productos que están siendo alquilados
  const availableProducts = products.filter(product => 
    !rentedProductIds.some(rentedId => rentedId.toString() === product._id.toString())
  );

  // Recalcular paginación con productos realmente disponibles
  const allMatchingProducts = await Product.find(filters).select('_id');
  const actuallyAvailableCount = allMatchingProducts.filter(product => 
    !rentedProductIds.some(rentedId => rentedId.toString() === product._id.toString())
  ).length;

  const totalPages = Math.ceil(actuallyAvailableCount / limit);

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
});
```

### **3. 🏠 Flujo de Alquiler Completo**
```typescript
// Paso 1: Crear Solicitud de Alquiler
┌─────────────────────────────────────────────────────────────────┐
│ Frontend:                                                       │
│ 1️⃣ Usuario hace clic en "Alquilar" en ProductCard              │
│ 2️⃣ RentalForm se abre con fechas y notas                      │
│ 3️⃣ POST /api/rentals { productId, startDate, endDate, notes } │
└─────────────────────────────────────────────────────────────────┘
                                │
                                v
┌─────────────────────────────────────────────────────────────────┐
│ Backend:                                                        │
│ 4️⃣ routes/rentals.js valida fechas y disponibilidad           │
│ 5️⃣ Crea rental con status: 'pending'                          │
│ 6️⃣ NotificationService.createRentalRequestNotification()      │
│ 7️⃣ Responde: { message, rental }                              │
└─────────────────────────────────────────────────────────────────┘

// Paso 2: Propietario Confirma Alquiler
┌─────────────────────────────────────────────────────────────────┐
│ Frontend:                                                       │
│ 8️⃣ Propietario ve notificación en /notifications              │
│ 9️⃣ Va a /profile tab "Solicitudes Recibidas"                  │
│ 🔟 Hace clic en "Confirmar"                                    │
│ 1️⃣1️⃣ PUT /api/rentals/:id/status { status: 'confirmed' }     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                v
┌─────────────────────────────────────────────────────────────────┐
│ Backend:                                                        │
│ 1️⃣2️⃣ Valida que usuario sea propietario                       │
│ 1️⃣3️⃣ Actualiza rental.status = 'confirmed'                   │
│ 1️⃣4️⃣ NotificationService.createRentalConfirmedNotification() │
│ 1️⃣5️⃣ Responde: { message, rental }                           │
└─────────────────────────────────────────────────────────────────┘

// Paso 3: Producto se Oculta Automáticamente
┌─────────────────────────────────────────────────────────────────┐
│ Sistema Automático:                                             │
│ 1️⃣6️⃣ Próxima consulta GET /api/products                       │
│ 1️⃣7️⃣ Filtro detecta rental con status 'confirmed'            │
│ 1️⃣8️⃣ Producto se excluye de lista disponible                 │
│ 1️⃣9️⃣ Frontend actualiza ProductsContext                      │
│ 2️⃣0️⃣ UI no muestra el producto alquilado                     │
└─────────────────────────────────────────────────────────────────┘

// Código Backend (Cambio de Estado)
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  const rental = await Rental.findById(req.params.id)
    .populate('product', 'title')
    .populate('renter', 'name email');

  // Verificar que el usuario sea el propietario
  if (rental.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Solo el propietario puede cambiar el estado' });
  }

  // Validar transiciones de estado
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['active', 'cancelled'],
    'active': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  };

  if (!validTransitions[rental.status].includes(status)) {
    return res.status(400).json({ message: 'Transición de estado inválida' });
  }

  rental.status = status;
  await rental.save();

  // Crear notificación basada en el nuevo estado
  if (status === 'confirmed') {
    await NotificationService.createRentalConfirmedNotification(rental);
  } else if (status === 'cancelled') {
    await NotificationService.createRentalCancelledNotification(rental);
  }

  res.json({ message: 'Estado actualizado exitosamente', rental });
});
```

### **4. 🖼️ Flujo de Manejo de Imágenes**
```typescript
// Frontend (Subida)
┌─────────────────────────────────────────────────────────────────┐
│ 1️⃣ Usuario selecciona imágenes en AddProductForm               │
│ 2️⃣ FileList se convierte a FormData                           │
│ 3️⃣ POST /api/products con Content-Type: multipart/form-data   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                v
// Backend (Procesamiento)
┌─────────────────────────────────────────────────────────────────┐
│ 4️⃣ Multer middleware procesa archivos                          │
│ 5️⃣ Valida tipo y tamaño: .jpg, .png, .webp < 5MB             │
│ 6️⃣ Genera nombre único: product-{timestamp}-{random}.jpg      │
│ 7️⃣ Guarda en /backend/uploads/products/                       │
│ 8️⃣ Crea producto con URLs: /uploads/products/filename.jpg     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                v
// Frontend (Visualización)
┌─────────────────────────────────────────────────────────────────┐
│ 9️⃣ ProductCard recibe URLs de imágenes                        │
│ 🔟 SimpleSmartImage valida URL antes de cargar                 │
│ 1️⃣1️⃣ GET http://localhost:3001/uploads/products/image.jpg     │
│ 1️⃣2️⃣ Backend sirve archivo estático con headers CORS         │
│ 1️⃣3️⃣ Imagen se muestra o fallback en caso de error           │
└─────────────────────────────────────────────────────────────────┘

// Código Backend (Multer Configuration)
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

// Servir archivos estáticos
app.use('/uploads', (req, res, next) => {
  // Headers CORS para imágenes
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));
```

---

## 🔌 **Configuraciones de Conexión**

### **1. 🍃 Conexión MongoDB**
```javascript
// Backend: server.js
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
    console.log(`🌍 Base de datos: rent-all-platform`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Acceso en red: http://192.168.1.172:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB Atlas:', err.message);
    process.exit(1);
  });

// Configuraciones de Connection
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,        // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false,  // Disable mongoose buffering
  bufferMaxEntries: 0     // Disable mongoose buffering
};
```

### **2. 🌐 Configuración CORS**
```javascript
// Backend: server.js
const corsOptions = {
  origin: [
    'http://localhost:3000',    // Frontend desarrollo
    'http://localhost:3002',    // Frontend alternativo
    'http://192.168.0.105:3000', // Red local
    'http://192.168.1.172:3000', // Red universitaria
    'http://0.0.0.0:3000'       // Cualquier IP
  ],
  credentials: true,            // Permitir cookies
  optionsSuccessStatus: 200,    // Para legacy browsers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware adicional para debugging
app.use((req, res, next) => {
  console.log(`🔧 ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});
```

### **3. 🔐 Configuración JWT**
```javascript
// Backend: middleware/auth.js
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Error de autenticación:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Optional Auth (para rutas que pueden funcionar con o sin auth)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      req.user = user;
    }
    
    next(); // Continuar sin importar si hay token o no
  } catch (error) {
    next(); // Continuar sin autenticación en caso de error
  }
};
```

### **4. 📡 Cliente API Frontend**
```typescript
// lib/api.ts
class ApiService {
  private baseURL: string;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Interceptor para agregar token automáticamente
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar respuestas
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos HTTP
  async get<T>(endpoint: string, params?: any): Promise<T> {
    const response = await this.axiosInstance.get(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.post(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.axiosInstance.put(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete(endpoint);
    return response.data;
  }
}

export const apiService = new ApiService();
```

---

## 🔄 **Estados y Transiciones**

### **Estados de Alquiler**
```typescript
enum RentalStatus {
  PENDING = 'pending',     // 🟡 Solicitud pendiente
  CONFIRMED = 'confirmed', // ✅ Confirmado por propietario  
  ACTIVE = 'active',       // 🔵 En curso
  COMPLETED = 'completed', // ✅ Completado
  CANCELLED = 'cancelled'  // ❌ Cancelado
}

// Transiciones Válidas
const statusTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['active', 'cancelled'],
  active: ['completed', 'cancelled'],
  completed: [], // Terminal
  cancelled: []  // Terminal
};

// Estados que Ocultan Productos de la Lista
const statusesThatHideProducts = ['confirmed', 'active'];

// Flujo Completo:
// 1️⃣ Usuario solicita alquiler → 'pending'
// 2️⃣ Propietario confirma → 'confirmed' (PRODUCTO SE OCULTA)
// 3️⃣ Alquiler comienza → 'active' (PRODUCTO SIGUE OCULTO)
// 4️⃣ Alquiler termina → 'completed' (PRODUCTO VUELVE A APARECER)
//
// Alternativa:
// 2️⃣ Propietario rechaza → 'cancelled' (PRODUCTO VISIBLE)
// 3️⃣ Usuario cancela → 'cancelled' (PRODUCTO VISIBLE)
```

### **Estados de Autenticación**
```typescript
interface AuthState {
  user: User | null;           // Datos del usuario
  token: string | null;        // JWT token
  isAuthenticated: boolean;    // Si está autenticado
  loading: boolean;            // Si está cargando
  error: string | null;        // Error de autenticación
}

// Transiciones de Auth
const authFlow = {
  // Inicial
  INITIAL: { user: null, token: null, isAuthenticated: false, loading: true },
  
  // Login exitoso
  AUTHENTICATED: { user: userData, token: jwtToken, isAuthenticated: true, loading: false },
  
  // Login fallido
  ERROR: { user: null, token: null, isAuthenticated: false, loading: false, error: message },
  
  // Logout
  LOGGED_OUT: { user: null, token: null, isAuthenticated: false, loading: false }
};
```

### **Estados de Productos**
```typescript
interface ProductsState {
  products: Product[];          // Lista de productos disponibles
  loading: boolean;             // Cargando productos
  error: string | null;         // Error en carga
  pagination: PaginationInfo;   // Info de paginación
  filters: ProductFilters;      // Filtros activos
  cache: Map<string, Product[]>; // Cache por filtros
}

// Flujo de Carga de Productos
const productsFlow = {
  // 1️⃣ Inicio de carga
  LOADING: { loading: true, error: null },
  
  // 2️⃣ Carga exitosa (CON FILTRADO DE ALQUILADOS)
  LOADED: { 
    products: availableProducts,  // ✅ Solo productos NO alquilados
    loading: false, 
    pagination: { totalProducts: realCount } // ✅ Conteo real
  },
  
  // 3️⃣ Error en carga
  ERROR: { loading: false, error: errorMessage },
  
  // 4️⃣ Actualización de filtros
  FILTERS_UPDATED: { filters: newFilters, loading: true }
};
```

---

## 📊 **Monitoreo y Debugging**

### **Logs Estructurados por Componente**
```javascript
// Sistema de Logging Categorizado
const logger = {
  // 🔐 Autenticación
  auth: {
    info: (msg, data) => console.log(`🔐 [AUTH] ${msg}`, data),
    error: (msg, error) => console.error(`❌ [AUTH] ${msg}`, error)
  },
  
  // 📦 Productos
  products: {
    info: (msg, data) => console.log(`📦 [PRODUCTS] ${msg}`, data),
    filter: (msg, data) => console.log(`🔍 [PRODUCTS-FILTER] ${msg}`, data)
  },
  
  // 🏠 Alquileres
  rentals: {
    info: (msg, data) => console.log(`🏠 [RENTALS] ${msg}`, data),
    status: (msg, data) => console.log(`🔄 [RENTALS-STATUS] ${msg}`, data)
  },
  
  // 🖼️ Imágenes
  images: {
    info: (msg, data) => console.log(`🖼️ [IMAGES] ${msg}`, data),
    error: (msg, error) => console.error(`❌ [IMAGES] ${msg}`, error)
  },
  
  // 🌐 API
  api: {
    request: (method, url, data) => console.log(`📡 [API-REQ] ${method} ${url}`, data),
    response: (status, data) => console.log(`📡 [API-RES] ${status}`, data),
    error: (error) => console.error(`❌ [API-ERROR]`, error)
  }
};

// Ejemplo de uso en el código
// Backend
logger.products.filter('Productos filtrados por alquileres activos', {
  totalProducts: products.length,
  rentedProducts: rentedProductIds.length,
  availableProducts: availableProducts.length
});

// Frontend
logger.auth.info('Login exitoso', { userId: user.id, email: user.email });
logger.images.error('Error cargando imagen', { src: imageSrc, debugId: 'ProductCard-123' });
```

### **Métricas en Tiempo Real**
```javascript
// Backend Metrics
const metrics = {
  requests: {
    total: 0,
    byEndpoint: new Map(),
    byStatus: new Map(),
    responseTime: []
  },
  
  rentals: {
    pending: 0,
    confirmed: 0,
    active: 0,
    completed: 0,
    cancelled: 0
  },
  
  products: {
    total: 0,
    available: 0,
    rented: 0,
    byCategory: new Map()
  }
};

// Middleware para recopilar métricas
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    metrics.requests.total++;
    metrics.requests.byEndpoint.set(req.path, 
      (metrics.requests.byEndpoint.get(req.path) || 0) + 1
    );
    metrics.requests.byStatus.set(res.statusCode,
      (metrics.requests.byStatus.get(res.statusCode) || 0) + 1
    );
    metrics.requests.responseTime.push(duration);
  });
  
  next();
});

// Endpoint para métricas
app.get('/api/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    requests: metrics.requests,
    averageResponseTime: metrics.requests.responseTime.reduce((a, b) => a + b, 0) / metrics.requests.responseTime.length
  });
});
```

### **Health Checks**
```javascript
// Backend Health Check Completo
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Verificar espacio en disco para uploads
    const uploadPath = path.join(__dirname, 'uploads');
    const stats = await fs.stat(uploadPath).catch(() => null);
    
    // Contar documentos principales
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const rentalsCount = await Rental.countDocuments();
    
    // Verificar productos alquilados
    const rentedCount = await Rental.countDocuments({ 
      status: { $in: ['confirmed', 'active'] } 
    });
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus,
        users: usersCount,
        products: productsCount,
        rentals: rentalsCount,
        rented: rentedCount,
        available: productsCount - rentedCount
      },
      server: {
        environment: process.env.NODE_ENV,
        port: process.env.PORT,
        memory: process.memoryUsage(),
        version: process.version
      },
      uploads: {
        directory: uploadPath,
        exists: !!stats,
        writable: stats ? true : false
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Frontend Health Check
const checkSystemHealth = async () => {
  try {
    const health = await apiService.get('/health');
    console.log('✅ Sistema saludable:', health);
    
    // Verificar conectividad de imágenes
    const testImage = new Image();
    testImage.onload = () => console.log('✅ Servidor de imágenes funcionando');
    testImage.onerror = () => console.error('❌ Servidor de imágenes no responde');
    testImage.src = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/uploads/test.png`;
    
  } catch (error) {
    console.error('❌ Sistema no saludable:', error);
  }
};
```

---

## 🔧 **Configuración de Desarrollo**

### **Hot Reload y Watch Mode**
```json
// package.json - Scripts de desarrollo
{
  "scripts": {
    // Frontend con hot reload
    "dev": "next dev",
    
    // Backend con nodemon
    "backend:dev": "cd backend && nodemon server.js",
    
    // Ambos simultáneamente
    "full-dev": "concurrently \"npm run backend:dev\" \"npm run dev\"",
    
    // Con logs detallados
    "dev:debug": "DEBUG=* npm run full-dev",
    
    // Solo para testing de API
    "api-only": "cd backend && nodemon --watch . --ext js server.js"
  }
}

// nodemon.json - Configuración backend
{
  "watch": ["backend/**/*"],
  "ext": "js,json",
  "ignore": ["backend/uploads/**/*", "backend/node_modules/**/*"],
  "exec": "node backend/server.js",
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "app:*"
  }
}
```

### **Variables de Entorno por Ambiente**
```bash
# .env.local (Desarrollo Local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
MONGODB_URI=mongodb://localhost:27017/rentall
JWT_SECRET=desarrollo_secreto_local
NODE_ENV=development

# .env.production (Producción)
NEXT_PUBLIC_API_URL=https://api.rentall.com/api
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rentall
JWT_SECRET=produccion_secreto_ultra_seguro
NODE_ENV=production

# .env.test (Testing)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
MONGODB_URI=mongodb://localhost:27017/rentall_test
JWT_SECRET=testing_secreto
NODE_ENV=test
```

---

<div align="center">

## 🔗 **Resumen de Conexiones**

| Componente | Puerto | Protocolo | Propósito |
|------------|--------|-----------|-----------|
| **Frontend** | 3000 | HTTP | Interfaz de usuario |
| **Backend** | 3001 | HTTP | API REST |
| **MongoDB** | 27017 | TCP | Base de datos |
| **Static Files** | 3001/uploads | HTTP | Imágenes y archivos |

### 🔄 **Flujos Principales**
1. **Autenticación**: Login → JWT → LocalStorage → Headers
2. **Productos**: Fetch → Filter Rented → Display Available  
3. **Alquileres**: Request → Confirm → Hide Product
4. **Imágenes**: Upload → Store → Serve → Display

### 📊 **Estados Críticos**
- **Rental Status**: `confirmed` | `active` → Producto Oculto
- **Auth State**: `isAuthenticated` → Acceso a Rutas
- **Product State**: `available` + `!rented` → Visible en Lista

</div>
