const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Rental = require('../models/Rental');
const { authMiddleware } = require('../middleware/auth');
const NotificationService = require('../services/NotificationService');  // ✅ AGREGAR: Importar NotificationService

// Obtener mensajes de un alquiler específico
router.get('/rental/:rentalId', authMiddleware, async (req, res) => {
  try {
    const { rentalId } = req.params;
    const userId = req.user.id;

    // Verificar que el usuario sea parte del alquiler
    const rental = await Rental.findById(rentalId)
      .populate('renter owner product', '_id name title');
    
    if (!rental) {
      return res.status(404).json({
        message: 'Alquiler no encontrado'
      });
    }

    console.log(`🔍 Chat check - Rental ID: ${rentalId}`);
    console.log(`🔍 Chat check - User ID: ${userId}`);
    console.log(`🔍 Chat check - Rental Status: ${rental.status}`);
    console.log(`🔍 Chat check - Renter ID: ${rental.renter._id}`);
    console.log(`🔍 Chat check - Owner ID: ${rental.owner._id}`);

    // Verificar que el usuario pueda chatear en este alquiler
    if (!rental.canUserChat(userId)) {
      console.log(`❌ Chat denied for user ${userId} in rental ${rentalId} with status ${rental.status}`);
      return res.status(403).json({
        message: 'El chat no está disponible para este alquiler en su estado actual'
      });
    }

    console.log(`✅ Chat allowed for user ${userId} in rental ${rentalId}`);

    // Obtener mensajes del alquiler
    const messages = await Message.getMessagesByRental(rentalId);

    // Marcar mensajes como leídos
    await Message.markAsRead(rentalId, userId);

    res.json({
      messages: messages.reverse(), // Ordenar cronológicamente
      rental: {
        _id: rental._id,
        product: rental.product,
        renter: rental.renter,
        owner: rental.owner
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Enviar un nuevo mensaje
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { rentalId, message, type = 'text' } = req.body;
    const senderId = req.user.id;

    // Validaciones
    if (!rentalId || !message) {
      return res.status(400).json({
        message: 'Rental ID y mensaje son requeridos'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        message: 'El mensaje no puede exceder 1000 caracteres'
      });
    }

    // Verificar que el alquiler existe y obtener participantes
    const rental = await Rental.findById(rentalId)
      .populate('renter owner product', '_id name title');
    
    if (!rental) {
      return res.status(404).json({
        message: 'Alquiler no encontrado'
      });
    }

    // Verificar que el usuario pueda chatear en este alquiler
    if (!rental.canUserChat(senderId)) {
      return res.status(403).json({
        message: 'El chat no está disponible para este alquiler en su estado actual'
      });
    }

    // Determinar receptor
    let receiverId;
    
    if (rental.renter._id.toString() === senderId) {
      receiverId = rental.owner._id.toString();
    } else if (rental.owner._id.toString() === senderId) {
      receiverId = rental.renter._id.toString();
    } else {
      return res.status(403).json({
        message: 'No tienes permisos para enviar mensajes en este alquiler'
      });
    }

    // Crear el mensaje
    const newMessage = new Message({
      rental: rentalId,
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),
      type
    });

    await newMessage.save();
    await newMessage.populate([
      { path: 'sender', select: 'name avatar' },
      { path: 'receiver', select: 'name avatar' }
    ]);

    // ✅ AGREGAR: Crear notificación de mensaje
    try {
      const messagePreview = message.length > 50 ? message.substring(0, 50) + '...' : message;
      await NotificationService.createPrivateMessageNotification(
        receiverId,                           // ID del receptor
        newMessage.sender.name,              // Nombre del remitente
        messagePreview,                      // Vista previa del mensaje
        rentalId,                           // ID del chat (usando rentalId como chatId)
        senderId                            // ID del remitente
      );
      console.log(`📱 Notificación de mensaje enviada a usuario ${receiverId}`);
    } catch (notifError) {
      console.error('❌ Error creando notificación de mensaje:', notifError);
      // No fallar el envío del mensaje si la notificación falla
    }

    // Emitir mensaje via Socket.io si está disponible
    if (req.app.io) {
      req.app.io.to(`rental_${rentalId}`).emit('new_message', {
        message: newMessage,
        rentalId
      });
    }

    res.status(201).json({
      message: 'Mensaje enviado exitosamente',
      data: newMessage
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Obtener cantidad de mensajes no leídos
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const unreadCount = await Message.getUnreadCount(userId);

    res.json({
      unreadCount
    });

  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Marcar mensajes como leídos
router.put('/mark-read/:rentalId', authMiddleware, async (req, res) => {
  try {
    const { rentalId } = req.params;
    const userId = req.user.id;

    // Verificar permisos
    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({
        message: 'Alquiler no encontrado'
      });
    }

    const isAuthorized = rental.renter.toString() === userId || 
                        rental.owner.toString() === userId;
    
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'No tienes permisos para marcar estos mensajes'
      });
    }

    await Message.markAsRead(rentalId, userId);

    res.json({
      message: 'Mensajes marcados como leídos'
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

module.exports = router;
