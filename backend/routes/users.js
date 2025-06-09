const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

// Configuración de multer para avatars
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/avatars');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB límite
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

// Obtener perfil del usuario autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Actualizar perfil del usuario autenticado
router.put('/profile', authMiddleware, upload.single('avatar'), [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('phone').optional().isMobilePhone().withMessage('Número de teléfono inválido'),
  body('location').optional().trim().isLength({ min: 2 }).withMessage('La ubicación debe tener al menos 2 caracteres'),
  body('bio').optional().isLength({ max: 500 }).withMessage('La biografía no puede exceder 500 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos',
        errors: errors.array() 
      });
    }

    const updates = req.body;
    
    // Procesar avatar si se subió uno nuevo
    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Perfil actualizado exitosamente',
      user
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Cambiar contraseña
router.put('/change-password', authMiddleware, [
  body('currentPassword').exists().withMessage('La contraseña actual es requerida'),
  body('newPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos',
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        message: 'La contraseña actual es incorrecta' 
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Obtener estadísticas del usuario (admin only)
router.get('/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalProducts
      },
      recentUsers
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Obtener todos los usuarios (admin only)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filters = {};
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(filters)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(filters);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Obtener perfil público de usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    // Obtener productos del usuario
    const products = await Product.find({ owner: user._id, available: true })
      .select('title images pricePerDay rating category location createdAt')
      .limit(6)
      .sort({ createdAt: -1 });

    res.json({
      user: {
        ...user.toJSON(),
        productsCount: products.length
      },
      recentProducts: products
    });
  } catch (error) {
    console.error('Error obteniendo perfil público:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

module.exports = router;
