const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const NotificationService = require('../services/NotificationService');

const router = express.Router();

// Función para obtener sugerencias específicas por campo
function getSuggestionsByField(field, value) {
  const suggestions = {
    title: [
      "Usa un nombre descriptivo pero conciso (3-100 caracteres)",
      "✅ Ejemplos buenos: 'Laptop Dell Inspiron 15', 'Bicicleta Trek montaña'",
      "❌ Evita: caracteres especiales (@, $, %), solo números, texto muy largo",
      "💡 Incluye marca y modelo si es relevante"
    ],
    description: [
      "Escribe una descripción detallada de tu producto (10-500 caracteres)",
      "✅ Incluye: estado del producto, características principales, qué incluye",
      "✅ Ejemplo: 'Laptop en excelente estado, incluye cargador y mouse. Ideal para estudios y trabajo.'",
      "❌ Evita: descripciones muy cortas, solo emojis, información irrelevante",
      "💡 Piensa en qué te gustaría saber como arrendatario"
    ],
    pricePerDay: [
      "Establece un precio justo entre S/ 0.01 y S/ 1000 por día",
      "💰 Considera precios del mercado para productos similares",
      "✅ Ejemplos: S/ 25.00 (laptop), S/ 15.50 (cámara), S/ 8.00 (libro)",
      "❌ Evita: precios extremadamente altos o bajos",
      "💡 Recuerda que precios competitivos atraen más clientes"
    ],
    pickupAddress: [
      "Especifica una dirección clara y accesible (5-200 caracteres)",
      "✅ Ejemplos: 'UNSA - Facultad de Ingeniería, Piso 2', 'Campus San Agustín, Biblioteca Central'",
      "❌ Evita: direcciones vagas como 'cerca de la universidad'",
      "📍 Incluye referencias específicas para facilitar el encuentro",
      "⏰ Considera la accesibilidad y horarios del lugar"
    ],
    returnAddress: [
      "Puede ser la misma dirección de recogida o diferente (5-200 caracteres)",
      "✅ Asegúrate de que sea un lugar accesible y seguro",
      "📍 Si es diferente a la recogida, explica por qué en la descripción",
      "⏰ Considera que debe ser conveniente para ambas partes",
      "💡 Lugares cerca del campus suelen ser más convenientes"
    ],
    category: [
      "Selecciona la categoría que mejor describa tu producto",
      "🔧 Herramientas: taladros, martillos, herramientas de laboratorio",
      "💻 Electrónicos: laptops, cámaras, proyectores, calculadoras",
      "🚗 Vehículos: bicicletas, scooters, patinetas",
      "🪑 Muebles: sillas, mesas, lámparas de estudio",
      "⚽ Deportes: pelotas, raquetas, equipos de gym",
      "📚 Otros: libros, instrumentos musicales, ropa especial"
    ]
  };
  
  let fieldSuggestions = suggestions[field] || ["Revisa la información ingresada"];
  
  // Agregar sugerencias específicas basadas en el valor ingresado
  if (field === 'title' && value) {
    if (value.length < 3) {
      fieldSuggestions.unshift("🔴 El título es demasiado corto. Necesitas al menos 3 caracteres.");
    } else if (value.length > 100) {
      fieldSuggestions.unshift("🔴 El título es demasiado largo. Máximo 100 caracteres.");
    } else if (!/^[a-zA-ZÀ-ÿñÑ0-9\s\-_.]+$/.test(value)) {
      fieldSuggestions.unshift("🔴 El título contiene caracteres no permitidos. Solo usa letras, números, espacios y guiones.");
    }
  } else if (field === 'description' && value) {
    if (value.length < 10) {
      fieldSuggestions.unshift("🔴 La descripción es muy corta. Escribe al menos 10 caracteres.");
    } else if (value.length > 500) {
      fieldSuggestions.unshift("🔴 La descripción es muy larga. Máximo 500 caracteres.");
    }
  } else if (field === 'pricePerDay' && value) {
    const price = Number(value);
    if (price < 0.01) {
      fieldSuggestions.unshift("🔴 El precio es demasiado bajo. Mínimo S/ 0.01");
    } else if (price > 1000) {
      fieldSuggestions.unshift("🔴 El precio es demasiado alto. Máximo S/ 1000");
    }
  }
  
  return fieldSuggestions;
}

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/products');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
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

// Obtener todos los productos con filtros y paginación
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      location,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters = { available: true };
    
    if (category && category !== 'all') {
      filters.category = category;
    }
    
    if (location) {
      filters.pickupAddress = { $regex: location, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      filters.pricePerDay = {};
      if (minPrice) filters.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filters.pricePerDay.$lte = Number(maxPrice);
    }
    
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Ejecutar consulta con paginación
    const skip = (page - 1) * limit;
    let products = await Product.find(filters)
      .populate('owner', 'name email avatar location')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // 🎯 NUEVA FUNCIONALIDAD: Filtrar productos con alquileres activos
    const Rental = require('../models/Rental');
    
    // Obtener IDs de productos que tienen alquileres confirmados o activos
    const rentedProductIds = await Rental.distinct('product', {
      status: { $in: ['confirmed', 'active'] }
    });

    // Filtrar productos para excluir los que están siendo alquilados
    const availableProducts = products.filter(product => 
      !rentedProductIds.some(rentedId => rentedId.toString() === product._id.toString())
    );

    console.log(`📦 Productos filtrados: ${products.length} total, ${availableProducts.length} disponibles, ${products.length - availableProducts.length} alquilados`);
    
    products = availableProducts;

    // Recalcular total de productos disponibles (sin alquileres activos)
    // Primero obtenemos todos los productos que coinciden con los filtros
    const allMatchingProducts = await Product.find(filters).select('_id');
    
    // Filtramos los que no están alquilados
    const actuallyAvailableCount = allMatchingProducts.filter(product => 
      !rentedProductIds.some(rentedId => rentedId.toString() === product._id.toString())
    ).length;

    const totalPages = Math.ceil(actuallyAvailableCount / limit);

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProducts: actuallyAvailableCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Obtener un producto por ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('owner', 'name email avatar location phone')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    res.json({ product });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Crear nuevo producto
router.post('/', authMiddleware, upload.array('images', 5), [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El título debe tener entre 3 y 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿñÑ0-9\s\-_.]+$/)
    .withMessage('El título solo puede contener letras, números, espacios y guiones'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres')
    .matches(/^[a-zA-ZÀ-ÿñÑ0-9\s\-_.,!?]+$/)
    .withMessage('La descripción contiene caracteres no válidos'),
  
  body('category')
    .isIn(['electronics', 'vehicles', 'tools', 'furniture', 'sports', 'others'])
    .withMessage('Debes seleccionar una categoría válida: Electrónicos, Vehículos, Herramientas, Muebles, Deportes u Otros'),
  
  body('pricePerDay')
    .isFloat({ min: 0.01, max: 1000 })
    .withMessage('El precio debe ser un número entre S/ 0.01 y S/ 1000'),
  
  body('pickupAddress')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('La dirección de recogida debe tener entre 5 y 200 caracteres')
    .matches(/^[a-zA-ZÀ-ÿñÑ0-9\s\-_.,#]+$/)
    .withMessage('La dirección de recogida contiene caracteres no válidos'),
  
  body('returnAddress')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('La dirección de devolución debe tener entre 5 y 200 caracteres')
    .matches(/^[a-zA-ZÀ-ÿñÑ0-9\s\-_.,#]+$/)
    .withMessage('La dirección de devolución contiene caracteres no válidos')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value,
        code: `INVALID_${err.path.toUpperCase()}`
      }));
      
      // Crear mensaje principal basado en el primer error
      let mainMessage = '❌ Información incompleta o incorrecta';
      const firstError = formattedErrors[0];
      
      if (firstError.field === 'title') {
        mainMessage = '📝 Problema con el título del producto';
      } else if (firstError.field === 'description') {
        mainMessage = '📄 Problema con la descripción del producto';
      } else if (firstError.field === 'pricePerDay') {
        mainMessage = '💰 Problema con el precio del producto';
      } else if (firstError.field === 'pickupAddress' || firstError.field === 'returnAddress') {
        mainMessage = '📍 Problema con las direcciones';
      } else if (firstError.field === 'category') {
        mainMessage = '🏷️ Problema con la categoría';
      }
      
      return res.status(400).json({ 
        message: mainMessage,
        errors: formattedErrors,
        details: formattedErrors.map(err => `${err.message}`).join(' | '),
        suggestions: getSuggestionsByField(firstError.field, firstError.value)
      });
    }

    const { title, description, category, pricePerDay, pickupAddress, returnAddress, specifications } = req.body;

    // Procesar imágenes subidas
    const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    
    if (images.length === 0) {
      return res.status(400).json({ 
        message: 'Se requiere al menos una imagen del producto',
        error: 'NO_IMAGES',
        details: 'Por favor, sube al menos una imagen para mostrar tu producto a otros usuarios.'
      });
    }

    const product = new Product({
      title,
      description,
      category,
      pricePerDay: Number(pricePerDay),
      images,
      pickupAddress,
      returnAddress,
      owner: req.user._id,
      specifications: specifications ? JSON.parse(specifications) : {}
    });

    await product.save();
    await product.populate('owner', 'name email avatar location');

    // Crear notificación de producto creado
    try {
      await NotificationService.createProductCreatedNotification(
        req.user._id,
        product.title,
        product._id
      );
      console.log(`✅ Notificación de producto creado para usuario ${req.user.email}`);
    } catch (notificationError) {
      console.error('❌ Error creando notificación de producto:', notificationError);
      // No fallar la creación por error en notificación
    }

    res.status(201).json({
      message: '¡Producto creado exitosamente! Tu producto ya está disponible para alquiler.',
      product,
      success: true
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    
    // Manejar errores específicos
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        message: 'Datos inválidos del producto',
        errors: validationErrors,
        details: 'Por favor, revisa la información ingresada.'
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Ya existe un producto con esa información',
        error: 'DUPLICATE_PRODUCT',
        details: 'Verifica que no hayas creado este producto anteriormente.'
      });
    }
    
    res.status(500).json({ 
      message: 'Error interno del servidor al crear el producto',
      error: 'SERVER_ERROR',
      details: 'Ocurrió un problema interno. Por favor, inténtalo de nuevo.' 
    });
  }
});

// Actualizar producto
router.put('/:id', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    // Verificar que el usuario sea el propietario
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'No tienes permisos para editar este producto' 
      });
    }

    const updates = req.body;
    
    // Procesar nuevas imágenes si las hay
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      updates.images = [...(product.images || []), ...newImages];
    }

    if (updates.specifications) {
      updates.specifications = JSON.parse(updates.specifications);
    }

    Object.assign(product, updates);
    await product.save();
    await product.populate('owner', 'name email avatar location');

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Eliminar producto
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    // Verificar que el usuario sea el propietario
    if (product.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'No tienes permisos para eliminar este producto' 
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Obtener productos del usuario autenticado
router.get('/user/my-products', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ owner: req.user._id })
      .populate('owner', 'name email avatar location')
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    console.error('Error obteniendo productos del usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Agregar reseña a un producto
router.post('/:id/reviews', authMiddleware, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser entre 1 y 5'),
  body('comment').trim().isLength({ min: 1 }).withMessage('El comentario es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos',
        errors: errors.array() 
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    // Verificar que el usuario no sea el propietario
    if (product.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        message: 'No puedes reseñar tu propio producto' 
      });
    }

    // Verificar que el usuario no haya reseñado ya
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ 
        message: 'Ya has reseñado este producto' 
      });
    }

    const { rating, comment } = req.body;

    product.reviews.push({
      user: req.user._id,
      rating: Number(rating),
      comment
    });

    product.calculateAverageRating();
    await product.save();
    await product.populate('reviews.user', 'name avatar');

    res.status(201).json({
      message: 'Reseña agregada exitosamente',
      product
    });
  } catch (error) {
    console.error('Error agregando reseña:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

module.exports = router;
