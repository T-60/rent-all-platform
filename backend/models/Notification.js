const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  message: {
    type: String,
    required: [true, 'El mensaje es requerido'],
    maxlength: [500, 'El mensaje no puede exceder 500 caracteres']
  },
  type: {
    type: String,
    enum: {
      values: ['welcome', 'rental_created', 'rental_request', 'rental_confirmed', 'rental_cancelled', 'product_created', 'product_rented', 'system'],
      message: 'Tipo de notificación inválido'
    },
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  relatedRental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    required: false
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Índices para consultas eficientes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });

// Método estático para crear notificación
notificationSchema.statics.createNotification = async function(data) {
  try {
    const notification = new this(data);
    await notification.save();
    console.log(`✅ Notificación creada: ${notification.type} para usuario ${notification.recipient}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creando notificación:', error);
    throw error;
  }
};

// Método estático para marcar notificaciones como leídas
notificationSchema.statics.markAsRead = async function(userId, notificationIds = null) {
  try {
    const filter = { recipient: userId };
    if (notificationIds) {
      filter._id = { $in: notificationIds };
    }
    
    const result = await this.updateMany(filter, { read: true });
    console.log(`✅ Marcadas ${result.modifiedCount} notificaciones como leídas para usuario ${userId}`);
    return result;
  } catch (error) {
    console.error('❌ Error marcando notificaciones como leídas:', error);
    throw error;
  }
};

// Método estático para obtener notificaciones no leídas
notificationSchema.statics.getUnreadCount = async function(userId) {
  try {
    const count = await this.countDocuments({ recipient: userId, read: false });
    return count;
  } catch (error) {
    console.error('❌ Error obteniendo conteo de notificaciones no leídas:', error);
    throw error;
  }
};

module.exports = mongoose.model('Notification', notificationSchema);
