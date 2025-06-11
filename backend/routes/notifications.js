const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Notification = require('../models/Notification');

const router = express.Router();

// Obtener notificaciones del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const filters = { recipient: req.user._id };
    if (unreadOnly === 'true') {
      filters.read = false;
    }

    const skip = (page - 1) * limit;
    const notifications = await Notification.find(filters)
      .populate('relatedProduct', 'title images')
      .populate('relatedRental', 'startDate endDate totalPrice')
      .populate('relatedUser', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalNotifications = await Notification.countDocuments(filters);
    const unreadCount = await Notification.getUnreadCount(req.user._id);
    const totalPages = Math.ceil(totalNotifications / limit);

    res.json({
      notifications,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalNotifications,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Marcar notificación específica como leída
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ 
        message: 'Notificación no encontrada' 
      });
    }

    notification.read = true;
    await notification.save();

    res.json({
      message: 'Notificación marcada como leída',
      notification
    });
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Marcar todas las notificaciones como leídas
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    const result = await Notification.markAsRead(req.user._id);

    res.json({
      message: 'Todas las notificaciones marcadas como leídas',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marcando todas las notificaciones como leídas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Marcar notificaciones específicas como leídas
router.put('/mark-read', authMiddleware, async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds)) {
      return res.status(400).json({ 
        message: 'Se requiere un array de IDs de notificaciones' 
      });
    }

    const result = await Notification.markAsRead(req.user._id, notificationIds);

    res.json({
      message: 'Notificaciones marcadas como leídas',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marcando notificaciones específicas como leídas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Obtener conteo de notificaciones no leídas
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const unreadCount = await Notification.getUnreadCount(req.user._id);

    res.json({
      unreadCount
    });
  } catch (error) {
    console.error('Error obteniendo conteo de notificaciones no leídas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Eliminar notificación específica
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ 
        message: 'Notificación no encontrada' 
      });
    }

    res.json({
      message: 'Notificación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Eliminar todas las notificaciones leídas
router.delete('/clear-read', authMiddleware, async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      recipient: req.user._id,
      read: true
    });

    res.json({
      message: 'Notificaciones leídas eliminadas exitosamente',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error eliminando notificaciones leídas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

module.exports = router;
