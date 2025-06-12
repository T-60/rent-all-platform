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
      values: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      message: 'Estado inválido'
    },
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'refunded'],
      message: 'Estado de pago inválido'
    },
    default: 'pending'
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
  }
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

// Índices para consultas eficientes
rentalSchema.index({ renter: 1, createdAt: -1 });
rentalSchema.index({ owner: 1, createdAt: -1 });
rentalSchema.index({ product: 1, startDate: 1, endDate: 1 });
rentalSchema.index({ status: 1 });

module.exports = mongoose.model('Rental', rentalSchema);
