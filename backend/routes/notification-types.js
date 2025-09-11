const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const NotificationService = require('../services/NotificationService');

// ===== RUTAS PARA NOTIFICACIONES DE CHAT =====

// Crear notificación de mensaje privado
router.post('/chat/message', authMiddleware, async (req, res) => {
  try {
    const { recipientId, senderName, messagePreview, chatId, senderId } = req.body;

    if (!recipientId || !senderName || !messagePreview || !chatId || !senderId) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos: recipientId, senderName, messagePreview, chatId, senderId' 
      });
    }

    const notification = await NotificationService.createPrivateMessageNotification(
      recipientId, 
      senderName, 
      messagePreview, 
      chatId, 
      senderId
    );

    res.status(201).json(notification);
  } catch (error) {
    console.error('❌ Error creando notificación de mensaje:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Crear notificación de solicitud de chat
router.post('/chat/request', authMiddleware, async (req, res) => {
  try {
    const { recipientId, requesterName, productTitle, productId, requesterId } = req.body;

    if (!recipientId || !requesterName || !productTitle || !productId || !requesterId) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos: recipientId, requesterName, productTitle, productId, requesterId' 
      });
    }

    const notification = await NotificationService.createChatRequestNotification(
      recipientId, 
      requesterName, 
      productTitle, 
      productId, 
      requesterId
    );

    res.status(201).json(notification);
  } catch (error) {
    console.error('❌ Error creando notificación de solicitud de chat:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Marcar notificaciones de chat como leídas
router.post('/chat/:chatId/mark-read', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const result = await NotificationService.markChatNotificationsAsRead(userId, chatId);

    res.json(result);
  } catch (error) {
    console.error('❌ Error marcando notificaciones de chat como leídas:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// ===== RUTAS PARA NOTIFICACIONES DE PAGOS =====

// Crear notificación de pago procesado
router.post('/payment/processed', authMiddleware, async (req, res) => {
  try {
    const { userId, amount, paymentMethod, rentalId, productTitle } = req.body;

    if (!userId || !amount || !paymentMethod || !rentalId || !productTitle) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos: userId, amount, paymentMethod, rentalId, productTitle' 
      });
    }

    const notification = await NotificationService.createPaymentProcessedNotification(
      userId, 
      amount, 
      paymentMethod, 
      rentalId, 
      productTitle
    );

    res.status(201).json(notification);
  } catch (error) {
    console.error('❌ Error creando notificación de pago procesado:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Crear notificación de pago fallido
router.post('/payment/failed', authMiddleware, async (req, res) => {
  try {
    const { userId, amount, reason, rentalId, productTitle } = req.body;

    if (!userId || !amount || !reason || !rentalId || !productTitle) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos: userId, amount, reason, rentalId, productTitle' 
      });
    }

    const notification = await NotificationService.createPaymentFailedNotification(
      userId, 
      amount, 
      reason, 
      rentalId, 
      productTitle
    );

    res.status(201).json(notification);
  } catch (error) {
    console.error('❌ Error creando notificación de pago fallido:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Crear notificación de pago requerido
router.post('/payment/required', authMiddleware, async (req, res) => {
  try {
    const { userId, amount, dueDate, rentalId, productTitle } = req.body;

    if (!userId || !amount || !dueDate || !rentalId || !productTitle) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos: userId, amount, dueDate, rentalId, productTitle' 
      });
    }

    const notification = await NotificationService.createPaymentRequiredNotification(
      userId, 
      amount, 
      dueDate, 
      rentalId, 
      productTitle
    );

    res.status(201).json(notification);
  } catch (error) {
    console.error('❌ Error creando notificación de pago requerido:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Crear notificación de recordatorio de pago
router.post('/payment/reminder', authMiddleware, async (req, res) => {
  try {
    const { userId, amount, hoursLeft, rentalId, productTitle } = req.body;

    if (!userId || !amount || !hoursLeft || !rentalId || !productTitle) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos: userId, amount, hoursLeft, rentalId, productTitle' 
      });
    }

    const notification = await NotificationService.createPaymentReminderNotification(
      userId, 
      amount, 
      hoursLeft, 
      rentalId, 
      productTitle
    );

    res.status(201).json(notification);
  } catch (error) {
    console.error('❌ Error creando notificación de recordatorio de pago:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;
