const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para optimizar consultas
messageSchema.index({ rental: 1, timestamp: -1 });
messageSchema.index({ receiver: 1, read: 1 });

// Middleware para popular automáticamente sender y receiver
messageSchema.pre(['find', 'findOne'], function() {
  this.populate([
    { path: 'sender', select: 'name avatar' },
    { path: 'receiver', select: 'name avatar' }
  ]);
});

// Método estático para obtener mensajes de un alquiler
messageSchema.statics.getMessagesByRental = function(rentalId, limit = 50) {
  return this.find({ rental: rentalId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .exec();
};

// Método estático para marcar mensajes como leídos
messageSchema.statics.markAsRead = function(rentalId, userId) {
  return this.updateMany(
    { rental: rentalId, receiver: userId, read: false },
    { read: true }
  );
};

// Método estático para contar mensajes no leídos
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ receiver: userId, read: false });
};

module.exports = mongoose.model('Message', messageSchema);
