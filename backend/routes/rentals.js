const express = require('express');
const { body, validationResult } = require('express-validator');
const Rental = require('../models/Rental');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Crear nueva solicitud de alquiler
router.post('/', authMiddleware, [
  body('product')
    .isMongoId()
    .withMessage('🛍️ El producto seleccionado no es válido. Intenta seleccionar otro producto.'),
  
  body('startDate')
    .isISO8601()
    .withMessage('📅 La fecha de inicio no es válida. Usa el calendario para seleccionar una fecha.')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        throw new Error('📅 La fecha de inicio no puede ser anterior a hoy.');
      }
      return true;
    }),
  
  body('endDate')
    .isISO8601()
    .withMessage('📅 La fecha de fin no es válida. Usa el calendario para seleccionar una fecha.')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      
      if (endDate <= startDate) {
        throw new Error('📅 La fecha de fin debe ser posterior a la fecha de inicio.');
      }
      
      // Máximo 30 días de alquiler
      const maxDays = 30;
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > maxDays) {
        throw new Error(`📅 El alquiler no puede ser mayor a ${maxDays} días.`);
      }
      
      return true;
    }),
  
  body('deliveryMethod')
    .optional()
    .isIn(['pickup', 'delivery'])
    .withMessage('🚚 Método de entrega inválido. Selecciona "Recogida" o "Entrega"'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('📝 Las notas no pueden exceder 500 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }));
      
      return res.status(400).json({ 
        message: '❌ Error en la información del alquiler',
        errors: formattedErrors,
        details: formattedErrors.map(err => err.message).join(' | '),
        suggestions: [
          "Verifica que las fechas sean correctas",
          "Asegúrate de que la fecha de fin sea posterior a la de inicio",
          "El alquiler máximo es de 30 días"
        ]
      });
    }

    const { product: productId, startDate, endDate, notes, deliveryMethod, deliveryAddress, totalPrice } = req.body;

    // Verificar que el producto existe y está disponible
    const product = await Product.findById(productId).populate('owner');
    if (!product) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    if (!product.available) {
      return res.status(400).json({ 
        message: 'El producto no está disponible para alquiler' 
      });
    }

    // Verificar que el usuario no sea el propietario
    if (product.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        message: 'No puedes alquilar tu propio producto' 
      });
    }

    // Verificar que las fechas no se solapen con alquileres existentes
    const conflictingRentals = await Rental.find({
      product: productId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (conflictingRentals.length > 0) {
      return res.status(400).json({ 
        message: 'El producto no está disponible en las fechas seleccionadas. Por favor, elige otras fechas.' 
      });
    }

    // Calcular días totales y precio total
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const timeDiff = endDateObj.getTime() - startDateObj.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const calculatedTotalPrice = totalDays * product.pricePerDay;

    // Crear el alquiler
    const rental = new Rental({
      product: productId,
      renter: req.user._id,
      owner: product.owner._id,
      startDate: startDateObj,
      endDate: endDateObj,
      totalDays,
      pricePerDay: product.pricePerDay,
      totalPrice: totalPrice || calculatedTotalPrice,
      notes,
      deliveryMethod: deliveryMethod || 'pickup',
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined
    });

    await rental.save();
    await rental.populate([
      { path: 'product', select: 'title images pricePerDay pickupAddress returnAddress' },
      { path: 'renter', select: 'name email phone avatar' },
      { path: 'owner', select: 'name email phone avatar' }
    ]);

    res.status(201).json({
      message: 'Solicitud de alquiler creada exitosamente',
      rental
    });
  } catch (error) {
    console.error('Error creando alquiler:', error);
    res.status(500).json({
      message: 'Error interno del servidor al crear el alquiler',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Obtener alquileres del usuario (como arrendatario)
router.get('/my-rentals', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filters = { renter: req.user._id };
    if (status) {
      filters.status = status;
    }

    const skip = (page - 1) * limit;
    const rentals = await Rental.find(filters)
      .populate({
        path: 'product',
        select: 'title images pricePerDay pickupAddress returnAddress category',
        populate: {
          path: 'owner',
          select: 'name email phone avatar'
        }
      })
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalRentals = await Rental.countDocuments(filters);
    const totalPages = Math.ceil(totalRentals / limit);

    res.json({
      rentals,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalRentals,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo alquileres del usuario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Obtener alquileres como propietario
router.get('/my-listings', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filters = { owner: req.user._id };
    if (status) {
      filters.status = status;
    }

    const skip = (page - 1) * limit;
    const rentals = await Rental.find(filters)
      .populate('product', 'title images pricePerDay location category')
      .populate('renter', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalRentals = await Rental.countDocuments(filters);
    const totalPages = Math.ceil(totalRentals / limit);

    res.json({
      rentals,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalRentals,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo listings del propietario:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Obtener un alquiler específico
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('product', 'title images pricePerDay location category description')
      .populate('renter', 'name email phone avatar location')
      .populate('owner', 'name email phone avatar location');

    if (!rental) {
      return res.status(404).json({ 
        message: 'Alquiler no encontrado' 
      });
    }

    // Verificar que el usuario tenga acceso (propietario o arrendatario)
    if (rental.renter._id.toString() !== req.user._id.toString() && 
        rental.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'No tienes permisos para ver este alquiler' 
      });
    }

    res.json({ rental });
  } catch (error) {
    console.error('Error obteniendo alquiler:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Actualizar estado del alquiler (solo propietario)
router.put('/:id/status', authMiddleware, [
  body('status').isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled']).withMessage('Estado inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos',
        errors: errors.array() 
      });
    }

    const { status } = req.body;
    const rental = await Rental.findById(req.params.id)
      .populate('product', 'title')
      .populate('renter', 'name email');

    if (!rental) {
      return res.status(404).json({ 
        message: 'Alquiler no encontrado' 
      });
    }

    // Verificar que el usuario sea el propietario
    if (rental.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Solo el propietario puede cambiar el estado' 
      });
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
      return res.status(400).json({ 
        message: `No se puede cambiar de ${rental.status} a ${status}` 
      });
    }

    rental.status = status;
    await rental.save();

    res.json({
      message: `Estado del alquiler actualizado a ${status}`,
      rental
    });
  } catch (error) {
    console.error('Error actualizando estado del alquiler:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Cancelar alquiler (arrendatario o propietario)
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ 
        message: 'Alquiler no encontrado' 
      });
    }

    // Verificar que el usuario tenga permisos
    if (rental.renter.toString() !== req.user._id.toString() && 
        rental.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'No tienes permisos para cancelar este alquiler' 
      });
    }

    // Solo se puede cancelar si está pending o confirmed
    if (!['pending', 'confirmed'].includes(rental.status)) {
      return res.status(400).json({ 
        message: 'Solo se pueden cancelar alquileres pendientes o confirmados' 
      });
    }

    rental.status = 'cancelled';
    await rental.save();

    res.json({
      message: 'Alquiler cancelado exitosamente',
      rental
    });
  } catch (error) {
    console.error('Error cancelando alquiler:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Verificar disponibilidad de producto
router.get('/availability/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Se requieren fechas de inicio y fin' 
      });
    }

    // Buscar alquileres conflictivos
    const conflictingRentals = await Rental.find({
      product: productId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    const isAvailable = conflictingRentals.length === 0;

    res.json({
      available: isAvailable,
      conflictingDates: conflictingRentals.map(rental => ({
        startDate: rental.startDate,
        endDate: rental.endDate
      }))
    });
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

module.exports = router;
