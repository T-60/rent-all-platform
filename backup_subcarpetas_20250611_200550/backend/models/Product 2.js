const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: {
      values: ['electronics', 'vehicles', 'tools', 'furniture', 'sports', 'others'],
      message: 'Categoría inválida'
    }
  },
  pricePerDay: {
    type: Number,
    required: [true, 'El precio por día es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  images: [{
    type: String,
    required: true
  }],
  pickupAddress: {
    type: String,
    required: [true, 'La dirección de recogida es requerida']
  },
  returnAddress: {
    type: String,
    required: [true, 'La dirección de devolución es requerida']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'El comentario no puede exceder 500 caracteres']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  specifications: {
    brand: String,
    model: String,
    year: Number,
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair'],
      default: 'good'
    }
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ pickupAddress: 1 });
productSchema.index({ pricePerDay: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

// Método para calcular rating promedio
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.totalReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
