const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const rentalRoutes = require('./routes/rentals');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:3000", "http://localhost:3001"],
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'], // Next.js ports
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Backend funcionando correctamente!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
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

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
    console.log(`🌍 Base de datos: rent-all-platform`);
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB Atlas:', err.message);
    console.log('🔧 Revisa tu MONGODB_URI en el archivo .env');
    process.exit(1);
  });

module.exports = app;
