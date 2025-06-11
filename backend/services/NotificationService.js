const Notification = require('../models/Notification');

class NotificationService {
  
  // Crear notificación de bienvenida para nuevos usuarios
  static async createWelcomeNotification(userId) {
    return await Notification.createNotification({
      recipient: userId,
      title: '¡Bienvenido a RentAll!',
      message: 'Gracias por unirte a nuestra comunidad de estudiantes. Explora productos disponibles y comienza a alquilar.',
      type: 'welcome'
    });
  }

  // Notificación cuando se crea un nuevo producto
  static async createProductCreatedNotification(userId, productTitle, productId) {
    return await Notification.createNotification({
      recipient: userId,
      title: '¡Producto publicado exitosamente!',
      message: `Tu producto "${productTitle}" ha sido publicado y ya está disponible para que otros estudiantes lo alquilen.`,
      type: 'product_created',
      relatedProduct: productId
    });
  }

  // Notificación cuando alguien crea una solicitud de alquiler (para el propietario)
  static async createRentalRequestNotification(ownerId, renterName, productTitle, rentalId, productId, renterId) {
    return await Notification.createNotification({
      recipient: ownerId,
      title: 'Nueva solicitud de alquiler',
      message: `${renterName} quiere alquilar tu producto "${productTitle}". Revisa los detalles en tu perfil.`,
      type: 'rental_request',
      relatedProduct: productId,
      relatedRental: rentalId,
      relatedUser: renterId
    });
  }

  // Notificación cuando se confirma un alquiler (para el arrendatario)
  static async createRentalConfirmedNotification(renterId, productTitle, totalPrice, rentalId, productId, ownerId) {
    return await Notification.createNotification({
      recipient: renterId,
      title: '¡Alquiler confirmado!',
      message: `Tu solicitud para alquilar "${productTitle}" ha sido confirmada. Total: S/ ${totalPrice}. Contacta al propietario para coordinar la entrega.`,
      type: 'rental_confirmed',
      relatedProduct: productId,
      relatedRental: rentalId,
      relatedUser: ownerId
    });
  }

  // Notificación cuando se crea una solicitud de alquiler (para el arrendatario)
  static async createRentalCreatedNotification(renterId, productTitle, totalPrice, rentalId, productId) {
    return await Notification.createNotification({
      recipient: renterId,
      title: 'Solicitud de alquiler enviada',
      message: `Tu solicitud para alquilar "${productTitle}" ha sido enviada al propietario. Total: S/ ${totalPrice}. Te notificaremos cuando sea confirmada.`,
      type: 'rental_created',
      relatedProduct: productId,
      relatedRental: rentalId
    });
  }

  // Notificación cuando se cancela un alquiler
  static async createRentalCancelledNotification(userId, productTitle, reason, rentalId, productId) {
    return await Notification.createNotification({
      recipient: userId,
      title: 'Alquiler cancelado',
      message: `El alquiler de "${productTitle}" ha sido cancelado. ${reason || 'No se especificó razón.'}`,
      type: 'rental_cancelled',
      relatedProduct: productId,
      relatedRental: rentalId
    });
  }

  // Notificación cuando tu producto es alquilado por alguien
  static async createProductRentedNotification(ownerId, renterName, productTitle, totalPrice, rentalId, productId, renterId) {
    return await Notification.createNotification({
      recipient: ownerId,
      title: '¡Tu producto ha sido alquilado!',
      message: `${renterName} ha alquilado tu producto "${productTitle}" por S/ ${totalPrice}. Contacta al arrendatario para coordinar la entrega.`,
      type: 'product_rented',
      relatedProduct: productId,
      relatedRental: rentalId,
      relatedUser: renterId
    });
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
      notifications.push(notification);
    }
    
    return notifications;
  }

  // Crear notificación personalizada
  static async createCustomNotification(data) {
    return await Notification.createNotification(data);
  }

}

module.exports = NotificationService;
