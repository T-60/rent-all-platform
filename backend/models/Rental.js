const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'La fecha de inicio es requerida']
  },
  endDate: {
    type: Date,
    required: [true, 'La fecha de fin es requerida']
  },
  totalDays: {
    type: Number,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: [
        'pending',           // Solicitud pendiente de aprobación
        'confirmed',         // Propietario confirmó la solicitud
        'delivery_arranged', // Cita para entrega coordinada
        'active',           // Producto entregado y en uso activo
        'return_arranged',   // Cita para devolución coordinada
        'completed',        // Alquiler completado exitosamente
        'cancelled'         // Cancelado en cualquier momento
      ],
      message: 'Estado inválido'
    },
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'refunded', 'failed'],
      message: 'Estado de pago inválido'
    },
    default: 'pending'
  },
  // Campos de Stripe
  paymentIntentId: {
    type: String,
    default: null
  },
  stripeSessionId: {
    type: String,
    default: null
  },
  transactionId: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup'
  },
  deliveryAddress: {
    type: String
  },
  
  // Nuevos campos para mejorar el flujo del alquiler
  deliveryScheduledDate: {
    type: Date,
    default: null
  },
  actualDeliveryDate: {
    type: Date,
    default: null
  },
  returnScheduledDate: {
    type: Date,
    default: null
  },
  actualReturnDate: {
    type: Date,
    default: null
  },
  deliveryNotes: {
    type: String,
    maxlength: [300, 'Las notas de entrega no pueden exceder 300 caracteres']
  },
  returnNotes: {
    type: String,
    maxlength: [300, 'Las notas de devolución no pueden exceder 300 caracteres']
  },
  
  // Historial de cambios de estado
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivery_arranged', 'active', 'return_arranged', 'completed', 'cancelled']
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Validación personalizada para fechas
rentalSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('La fecha de fin debe ser posterior a la fecha de inicio'));
  }
  
  if (this.startDate < new Date()) {
    return next(new Error('La fecha de inicio no puede ser en el pasado'));
  }
  
  // Calcular días totales
  const timeDiff = this.endDate.getTime() - this.startDate.getTime();
  this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Calcular precio total
  this.totalPrice = this.totalDays * this.pricePerDay;
  
  next();
});

// Métodos de instancia
rentalSchema.methods.canTransitionTo = function(newStatus) {
  const transitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['delivery_arranged', 'active', 'cancelled'],
    'delivery_arranged': ['active', 'cancelled'],
    'active': ['return_arranged', 'completed', 'cancelled'],
    'return_arranged': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  };
  
  return transitions[this.status]?.includes(newStatus) || false;
};

rentalSchema.methods.updateStatus = function(newStatus, changedBy, notes = null) {
  if (!this.canTransitionTo(newStatus)) {
    throw new Error(`No se puede cambiar de ${this.status} a ${newStatus}`);
  }
  
  // Agregar al historial
  this.statusHistory.push({
    status: this.status, // estado anterior
    changedBy,
    changedAt: new Date(),
    notes
  });
  
  this.status = newStatus;
  return this;
};

rentalSchema.methods.canUserChat = function(userId) {
  // Chat disponible desde pending hasta antes de completed
  const chatEnabledStatuses = ['pending', 'confirmed', 'delivery_arranged', 'active', 'return_arranged'];
  
  // Obtener IDs de los participantes
  const renterId = this.renter._id ? this.renter._id.toString() : this.renter.toString();
  const ownerId = this.owner._id ? this.owner._id.toString() : this.owner.toString();
  const userIdStr = userId.toString();
  
  const isParticipant = renterId === userIdStr || ownerId === userIdStr;
  
  console.log(`🔍 canUserChat - Status: ${this.status}, User: ${userIdStr}, Renter: ${renterId}, Owner: ${ownerId}, IsParticipant: ${isParticipant}`);
  
  return chatEnabledStatuses.includes(this.status) && isParticipant;
};

// Métodos estáticos
rentalSchema.statics.getValidTransitions = function() {
  return {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['delivery_arranged', 'active', 'cancelled'],
    'delivery_arranged': ['active', 'cancelled'],
    'active': ['return_arranged', 'completed', 'cancelled'],
    'return_arranged': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  };
};

// Índices para consultas eficientes
rentalSchema.index({ renter: 1, createdAt: -1 });
rentalSchema.index({ owner: 1, createdAt: -1 });
rentalSchema.index({ product: 1, startDate: 1, endDate: 1 });
rentalSchema.index({ status: 1 });

module.exports = mongoose.model('Rental', rentalSchema);
