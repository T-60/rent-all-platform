const Notification = require('../models/Notification');

class NotificationService {
  
  // Método auxiliar para emitir notificación en tiempo real
  static async emitNotificationToUser(userId, notification) {
    try {
      if (global.io) {
        // Emitir a la sala personal del usuario
        global.io.to(`user_${userId}`).emit('new_notification', {
          notification,
          unreadCount: await Notification.getUnreadCount(userId)
        });
        
        console.log(`🔔 Notificación emitida en tiempo real a usuario ${userId}`);
      }
    } catch (error) {
      console.error('❌ Error emitiendo notificación en tiempo real:', error);
    }
  }
  
  // Crear notificación de bienvenida para nuevos usuarios
  static async createWelcomeNotification(userId) {
    const notification = await Notification.createNotification({
      recipient: userId,
      title: '¡Bienvenido a RentAll!',
      message: 'Gracias por unirte a nuestra comunidad de estudiantes. Explora productos disponibles y comienza a alquilar.',
      type: 'welcome'
    });
    
    // Emitir en tiempo real
    await this.emitNotificationToUser(userId, notification);
    
    return notification;
  }

  // Notificación cuando se crea un nuevo producto
  static async createProductCreatedNotification(userId, productTitle, productId) {
    const notification = await Notification.createNotification({
      recipient: userId,
      title: '¡Producto publicado exitosamente!',
      message: `Tu producto "${productTitle}" ha sido publicado y ya está disponible para que otros estudiantes lo alquilen.`,
      type: 'product_created',
      relatedProduct: productId
    });
    
    // Emitir en tiempo real
    await this.emitNotificationToUser(userId, notification);
    
    return notification;
  }

  // Notificación cuando alguien crea una solicitud de alquiler (para el propietario)
  static async createRentalRequestNotification(ownerId, renterName, productTitle, rentalId, productId, renterId) {
    const notification = await Notification.createNotification({
      recipient: ownerId,
      title: 'Nueva solicitud de alquiler',
      message: `${renterName} quiere alquilar tu producto "${productTitle}". Revisa los detalles en tu perfil.`,
      type: 'rental_request',
      relatedProduct: productId,
      relatedRental: rentalId,
      relatedUser: renterId
    });
    
    // Emitir en tiempo real
    await this.emitNotificationToUser(ownerId, notification);
    
    return notification;
  }

  // Notificación cuando se confirma un alquiler (para el arrendatario)
  static async createRentalConfirmedNotification(renterId, productTitle, totalPrice, rentalId, productId, ownerId) {
    const notification = await Notification.createNotification({
      recipient: renterId,
      title: '¡Alquiler confirmado!',
      message: `Tu solicitud para alquilar "${productTitle}" ha sido confirmada. Total: S/ ${totalPrice}. Contacta al propietario para coordinar la entrega.`,
      type: 'rental_confirmed',
      relatedProduct: productId,
      relatedRental: rentalId,
      relatedUser: ownerId
    });
    
    // Emitir en tiempo real
    await this.emitNotificationToUser(renterId, notification);
    
    return notification;
  }

  // Notificación cuando se crea una solicitud de alquiler (para el arrendatario)
  static async createRentalCreatedNotification(renterId, productTitle, totalPrice, rentalId, productId) {
    const notification = await Notification.createNotification({
      recipient: renterId,
      title: 'Solicitud de alquiler enviada',
      message: `Tu solicitud para alquilar "${productTitle}" ha sido enviada al propietario. Total: S/ ${totalPrice}. Te notificaremos cuando sea confirmada.`,
      type: 'rental_created',
      relatedProduct: productId,
      relatedRental: rentalId
    });
    
    // Emitir en tiempo real
    await this.emitNotificationToUser(renterId, notification);
    
    return notification;
  }

  // Notificación cuando se cancela un alquiler
  static async createRentalCancelledNotification(userId, productTitle, reason, rentalId, productId) {
    const notification = await Notification.createNotification({
      recipient: userId,
      title: 'Alquiler cancelado',
      message: `El alquiler de "${productTitle}" ha sido cancelado. ${reason || 'No se especificó razón.'}`,
      type: 'rental_cancelled',
      relatedProduct: productId,
      relatedRental: rentalId
    });
    
    // Emitir en tiempo real
    await this.emitNotificationToUser(userId, notification);
    
    return notification;
  }

  // Notificación cuando tu producto es alquilado por alguien
  static async createProductRentedNotification(ownerId, renterName, productTitle, totalPrice, rentalId, productId, renterId) {
    const notification = await Notification.createNotification({
      recipient: ownerId,
      title: '¡Tu producto ha sido alquilado!',
      message: `${renterName} ha alquilado tu producto "${productTitle}" por S/ ${totalPrice}. Contacta al arrendatario para coordinar la entrega.`,
      type: 'product_rented',
      relatedProduct: productId,
      relatedRental: rentalId,
      relatedUser: renterId
    });
    
    // Emitir en tiempo real
    await this.emitNotificationToUser(ownerId, notification);
    
    return notification;
  }

  // Notificación del sistema (para comunicados generales)
  static async createSystemNotification(userIds, title, message, metadata = {}) {
    const notifications = [];
    
    for (const userId of userIds) {
      const notification = await Notification.createNotification({
        recipient: userId,
        title,
        message,
        type: 'system',
        metadata
      });
      
      // Emitir en tiempo real para cada usuario
      await this.emitNotificationToUser(userId, notification);
      
      notifications.push(notification);
    }
    
    return notifications;
  }

  // Crear notificación personalizada
  static async createCustomNotification(data) {
    return await Notification.createNotification(data);
  }

  // ===== NOTIFICACIONES DE CHAT =====

  // Notificación de mensaje privado (solo si el chat no está abierto)
  static async createPrivateMessageNotification(recipientId, senderName, messagePreview, chatId, senderId) {
    // Verificar si ya existe una notificación de mensaje no leída para esta conversación
    const existingNotification = await Notification.findOne({
      recipient: recipientId,
      type: 'private_message',
      'metadata.chatId': chatId,
      read: false
    });

    // Si ya existe, solo actualizamos el mensaje
    if (existingNotification) {
      existingNotification.message = `${senderName}: ${messagePreview}`;
      existingNotification.createdAt = new Date();
      await existingNotification.save();
      
      // Emitir actualización en tiempo real
      await this.emitNotificationToUser(recipientId, existingNotification);
      
      console.log(`📱 Notificación de mensaje actualizada para usuario ${recipientId}`);
      return existingNotification;
    }

    // Si no existe, crear nueva notificación
    const notification = await Notification.createNotification({
      recipient: recipientId,
      title: `Nuevo mensaje de ${senderName}`,
      message: `${senderName}: ${messagePreview}`,
      type: 'private_message',
      relatedUser: senderId,
      metadata: {
        chatId: chatId,
        messagePreview: messagePreview
      }
    });

    // Emitir en tiempo real
    await this.emitNotificationToUser(recipientId, notification);
    
    console.log(`📱 Nueva notificación de mensaje creada para usuario ${recipientId}`);
    return notification;
  }

  // Notificación de solicitud de chat
  static async createChatRequestNotification(recipientId, requesterName, productTitle, productId, requesterId) {
    const notification = await Notification.createNotification({
      recipient: recipientId,
      title: 'Nueva solicitud de chat',
      message: `${requesterName} quiere chatear contigo sobre "${productTitle}". ¿Aceptas la conversación?`,
      type: 'chat_request',
      relatedProduct: productId,
      relatedUser: requesterId,
      metadata: {
        productTitle: productTitle
      }
    });

    // Emitir en tiempo real
    await this.emitNotificationToUser(recipientId, notification);
    
    return notification;
  }

  // ===== NOTIFICACIONES DE PAGOS =====

  // Notificación de pago procesado exitosamente
  static async createPaymentProcessedNotification(userId, amount, paymentMethod, rentalId, productTitle) {
    const notification = await Notification.createNotification({
      recipient: userId,
      title: '💳 Pago procesado exitosamente',
      message: `Tu pago de S/ ${amount} por "${productTitle}" ha sido procesado exitosamente via ${paymentMethod}. ¡Tu alquiler está confirmado!`,
      type: 'payment_processed',
      relatedRental: rentalId,
      metadata: {
        amount: amount,
        paymentMethod: paymentMethod,
        productTitle: productTitle
      }
    });

    // Emitir en tiempo real
    await this.emitNotificationToUser(userId, notification);
    
    return notification;
  }

  // Notificación de pago fallido
  static async createPaymentFailedNotification(userId, amount, reason, rentalId, productTitle) {
    const notification = await Notification.createNotification({
      recipient: userId,
      title: '❌ Error en el pago',
      message: `No se pudo procesar tu pago de S/ ${amount} por "${productTitle}". ${reason}. Por favor, intenta nuevamente.`,
      type: 'payment_failed',
      relatedRental: rentalId,
      metadata: {
        amount: amount,
        reason: reason,
        productTitle: productTitle
      }
    });

    // Emitir en tiempo real
    await this.emitNotificationToUser(userId, notification);
    
    return notification;
  }

  // Notificación de pago requerido
  static async createPaymentRequiredNotification(userId, amount, dueDate, rentalId, productTitle) {
    const notification = await Notification.createNotification({
      recipient: userId,
      title: '💰 Pago requerido',
      message: `Se requiere un pago de S/ ${amount} para confirmar tu alquiler de "${productTitle}". Fecha límite: ${dueDate}.`,
      type: 'payment_required',
      relatedRental: rentalId,
      metadata: {
        amount: amount,
        dueDate: dueDate,
        productTitle: productTitle
      }
    });

    // Emitir en tiempo real
    await this.emitNotificationToUser(userId, notification);
    
    return notification;
  }

  // Notificación de recordatorio de pago
  static async createPaymentReminderNotification(userId, amount, hoursLeft, rentalId, productTitle) {
    const notification = await Notification.createNotification({
      recipient: userId,
      title: '⏰ Recordatorio de pago',
      message: `Te quedan ${hoursLeft} horas para completar el pago de S/ ${amount} por "${productTitle}". No pierdas tu reserva.`,
      type: 'payment_reminder',
      relatedRental: rentalId,
      metadata: {
        amount: amount,
        hoursLeft: hoursLeft,
        productTitle: productTitle
      }
    });

    // Emitir en tiempo real
    await this.emitNotificationToUser(userId, notification);
    
    return notification;
  }

  // ===== MÉTODOS AUXILIARES =====

  // Marcar notificaciones de chat como leídas cuando se abre la conversación
  static async markChatNotificationsAsRead(userId, chatId) {
    try {
      const result = await Notification.updateMany(
        {
          recipient: userId,
          type: 'private_message',
          'metadata.chatId': chatId,
          read: false
        },
        { read: true }
      );

      console.log(`✅ ${result.modifiedCount} notificaciones de chat marcadas como leídas para conversación ${chatId}`);
      return result;
    } catch (error) {
      console.error('❌ Error marcando notificaciones de chat como leídas:', error);
      throw error;
    }
  }

}

module.exports = NotificationService;
