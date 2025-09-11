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
const notificationTypesRoutes = require('./routes/notification-types');
const chatRoutes = require('./routes/chat');
const paymentRoutes = require('./routes/payments');
// const webhookRoutes = require('./routes/webhooks'); // DESHABILITADO: duplica webhooks de payments

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      // Permitir requests sin origin (apps móviles, Postman, etc.)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",  // ✅ Revertido puerto correcto del backend
        process.env.CORS_ORIGIN,
        process.env.NEXT_PUBLIC_API_URL?.replace('/api', ''),
        "http://34.23.76.150:8080",
        "http://34.23.76.150:3000",
        "http://34.23.76.150:3001"  // ✅ Revertido para producción
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

const PORT = process.env.PORT || 3001;  // ✅ Revertido: puerto 3001

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

// Rutas - Webhooks ANTES de JSON middleware (Stripe necesita raw body)
// app.use('/api/webhooks', webhookRoutes); // DESHABILITADO: duplica webhooks de payments

// JSON middleware para otras rutas
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

// Rutas - Webhooks ya registrados arriba
// Middleware JSON (DESPUÉS de webhooks)
// app.use(express.json({ limit: '50mb' })); - Ya configurado arriba
// app.use(express.urlencoded({ extended: true, limit: '50mb' })); - Ya configurado arriba

// Otras rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notification-types', notificationTypesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);

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
const connectedUsers = new Map(); // Mapear userId a socketId

// Middleware de autenticación para Socket.io
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    
    if (!token) {
      console.log('❌ Socket sin token de autenticación');
      return next(new Error('Authentication error: No token provided'));
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    socket.userId = decoded.id;
    socket.userName = decoded.name;
    
    console.log(`✅ Socket autenticado para usuario: ${decoded.name} (ID: ${decoded.id})`);
    next();
  } catch (err) {
    console.log('❌ Error autenticando socket:', err.message);
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  const userName = socket.userName;
  
  console.log(`🔌 Usuario conectado: ${userName} (${userId}) - Socket: ${socket.id}`);
  
  // Unir automáticamente a su sala personal
  if (userId) {
    socket.join(`user_${userId}`);
    connectedUsers.set(userId, socket.id);
    console.log(`👤 Usuario ${userName} (${userId}) unido automáticamente a su sala personal`);
    
    // Emitir confirmación de conexión
    socket.emit('user_connected', { 
      userId, 
      userName,
      message: 'Conectado exitosamente al chat' 
    });
  }

  // Unir usuario a su sala personal para notificaciones (método manual - mantenido por compatibilidad)
  socket.on('join_user', (requestedUserId) => {
    // Solo permitir unirse a su propia sala
    if (requestedUserId === userId) {
      socket.join(`user_${requestedUserId}`);
      connectedUsers.set(requestedUserId, socket.id);
      console.log(`👤 Usuario ${userName} (${userId}) unido manualmente a su sala personal`);
      socket.emit('joined_user_room', { userId: requestedUserId });
    } else {
      console.log(`❌ Usuario ${userId} intentó unirse a sala de usuario ${requestedUserId}`);
      socket.emit('error', { message: 'No puedes unirte a la sala de otro usuario' });
    }
  });

  // Unirse a una sala de alquiler específica
  socket.on('join_rental', (rentalId) => {
    if (rentalId) {
      socket.join(`rental_${rentalId}`);
      console.log(`👤 Usuario ${userName} (${userId}) se unió a rental_${rentalId}`);
      socket.emit('joined_rental_room', { rentalId });
    }
  });

  // Salir de una sala de alquiler
  socket.on('leave_rental', (rentalId) => {
    if (rentalId) {
      socket.leave(`rental_${rentalId}`);
      console.log(`👋 Usuario ${userName} (${userId}) salió de rental_${rentalId}`);
      socket.emit('left_rental_room', { rentalId });
    }
  });

  // Manejo de desconexión
  socket.on('disconnect', (reason) => {
    // Remover usuario de la lista de conectados
    if (userId) {
      connectedUsers.delete(userId);
      console.log(`👤 Usuario ${userName} (${userId}) desconectado. Razón: ${reason}`);
    }
    console.log(`🔌 Socket ${socket.id} desconectado`);
  });

  // Manejo de errores del socket
  socket.on('error', (error) => {
    console.log(`❌ Error en socket ${socket.id}:`, error);
  });
});

// Hacer io accesible globalmente para los servicios
global.io = io;

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
