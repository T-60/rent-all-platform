const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const rentalRoutes = require('./routes/rentals');
const notificationRoutes = require('./routes/notifications');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      // Permitir requests sin origin (apps móviles, Postman, etc.)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001", 
        process.env.CORS_ORIGIN,
        process.env.NEXT_PUBLIC_API_URL?.replace('/api', ''),
        "http://34.23.76.150:8080",
        "http://34.23.76.150:3000"
      ].filter(Boolean);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('🚫 CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: [
        "'self'", 
        "data:", 
        "http://localhost:3000", "http://localhost:3001", "http://192.168.0.105:3000", "http://192.168.0.105:3001", 
        "http://localhost:3000", "http://localhost:3001", "http://192.168.0.105:3000", "http://192.168.0.105:3001",
        "http://192.168.0.105:3000", "http://192.168.0.105:3001",
        "http://192.168.0.105:3000", "http://192.168.0.105:3001",
        "http://0.0.0.0:3000"
      ],
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002', 
    'http://localhost:3003',
    'http://192.168.0.105:3000',  // IP actual
    'http://192.168.0.105:3001',  // IP actual
    'http://192.168.1.172:3000',  // IP anterior
    'http://192.168.1.172:3001',  // IP anterior
    'http://0.0.0.0:3000'
  ], // Next.js ports + network IPs
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Middleware de logging para debug
app.use((req, res, next) => {
  console.log(`🔧 ${req.method} ${req.path} - Origin: ${req.get('Origin')} - Referer: ${req.get('Referer')}`);
  console.log('🔧 Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('🔧 Body:', req.body);
  }
  next();
});

// Servir archivos estáticos con headers apropiados y logs detallados
const path = require('path');
app.use('/uploads', (req, res, next) => {
  console.log('📁 Solicitud de archivo estático:', req.url);
  console.log('📁 Referer:', req.get('Referer'));
  console.log('📁 User-Agent:', req.get('User-Agent'));
  
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  // Log de respuesta exitosa
  const originalSend = res.send;
  res.send = function(data) {
    console.log('✅ Archivo servido exitosamente:', req.url);
    return originalSend.call(this, data);
  };
  
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    console.log('📁 Configurando headers para:', path);
    res.set('Cache-Control', 'public, max-age=31536000');
  },
  fallthrough: false
}));

// Middleware para capturar errores 404 en archivos estáticos
app.use('/uploads', (req, res, next) => {
  console.error('❌ Archivo no encontrado:', req.url);
  res.status(404).json({ 
    error: 'Archivo no encontrado',
    path: req.url,
    message: 'La imagen solicitada no existe en el servidor'
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

// Hacer io disponible en las rutas
app.io = io;

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Socket.io configuration
io.on('connection', (socket) => {
  console.log('🔌 Usuario conectado:', socket.id);

  // Unirse a una sala de alquiler específica
  socket.on('join_rental', (rentalId) => {
    socket.join(`rental_${rentalId}`);
    console.log(`👤 Usuario ${socket.id} se unió a rental_${rentalId}`);
  });

  // Salir de una sala de alquiler
  socket.on('leave_rental', (rentalId) => {
    socket.leave(`rental_${rentalId}`);
    console.log(`👋 Usuario ${socket.id} salió de rental_${rentalId}`);
  });

  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log('🔌 Usuario desconectado:', socket.id);
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Algo salió mal!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    const isLocal = process.env.MONGODB_URI.includes('localhost');
    const dbType = isLocal ? 'MongoDB Local' : 'MongoDB Atlas';
    const dbLocation = isLocal ? 'localhost:27017' : 'Atlas Cloud';
    
    console.log(`✅ Conectado a ${dbType} exitosamente`);
    console.log(`🌍 Base de datos: rent-all-platform (${dbLocation})`);
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
      console.log(`💬 Socket.io habilitado para chat en tiempo real`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌐 Acceso en red: http://192.168.1.172:${PORT}/api/health`);
      console.log(`🏠 Para probar en otra PC: http://192.168.1.172:${PORT}`);
    });
  })
  .catch(err => {
    const isLocal = process.env.MONGODB_URI && process.env.MONGODB_URI.includes('localhost');
    const dbType = isLocal ? 'MongoDB Local' : 'MongoDB Atlas';
    
    console.error(`❌ Error conectando a ${dbType}:`, err.message);
    console.log('🔧 Revisa tu MONGODB_URI en el archivo .env');
    if (isLocal) {
      console.log('💡 Asegúrate de que MongoDB esté corriendo localmente en puerto 27017');
    }
    process.exit(1);
  });

module.exports = app;

module.exports = app;
