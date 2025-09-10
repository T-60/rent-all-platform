const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const Rental = require('../models/Rental');
const { authMiddleware } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Crear Payment Intent para un alquiler
router.post('/create-intent', authMiddleware, async (req, res) => {
  try {
    console.log('🔄 Creando Payment Intent...');
    console.log('📦 Datos recibidos:', req.body);
    console.log('👤 Usuario:', req.user.id);

    const { rentalId } = req.body;
    const userId = req.user.id;

    // Validar que se proporcione el ID del alquiler
    if (!rentalId) {
      return res.status(400).json({
        message: 'ID del alquiler requerido'
      });
    }

    // Buscar el alquiler con toda la información necesaria
    const rental = await Rental.findById(rentalId)
      .populate('product', 'title pricePerDay')
      .populate('renter', 'name email')
      .populate('owner', 'name email');

    console.log('🔍 Alquiler encontrado:', rental ? 'SÍ' : 'NO');
    
    if (!rental) {
      return res.status(404).json({
        message: 'Alquiler no encontrado'
      });
    }

    console.log('📋 Detalles del alquiler:');
    console.log('- ID:', rental._id);
    console.log('- Producto:', rental.product.title);
    console.log('- Arrendatario:', rental.renter.email);
    console.log('- Total Price:', rental.totalPrice);
    console.log('- Estado:', rental.status);
    console.log('- Estado de pago:', rental.paymentStatus);

    // Verificar que el usuario sea el arrendatario
    if (rental.renter._id.toString() !== userId) {
      return res.status(403).json({
        message: 'No tienes permisos para pagar este alquiler'
      });
    }

    // Verificar que el alquiler esté confirmado
    if (rental.status !== 'confirmed') {
      return res.status(400).json({
        message: 'El alquiler debe estar confirmado por el propietario antes del pago'
      });
    }

    // Verificar que el pago no esté ya procesado
    if (rental.paymentStatus === 'paid') {
      return res.status(400).json({
        message: 'Este alquiler ya ha sido pagado'
      });
    }

    // Verificar si ya tiene un payment intent
    if (rental.paymentIntentId) {
      try {
        // Verificar el estado del Payment Intent en Stripe
        const existingPaymentIntent = await stripe.paymentIntents.retrieve(rental.paymentIntentId);
        
        console.log('🔍 Payment Intent existente encontrado:', existingPaymentIntent.id, 'Estado:', existingPaymentIntent.status);
        
        // Si el Payment Intent está en proceso válido, no permitir duplicados
        if (existingPaymentIntent.status === 'requires_payment_method' || 
            existingPaymentIntent.status === 'requires_confirmation' ||
            existingPaymentIntent.status === 'processing') {
          
          console.log('✅ Reutilizando Payment Intent existente:', existingPaymentIntent.id);
          
          // Devolver el Payment Intent existente
          return res.json({
            clientSecret: existingPaymentIntent.client_secret,
            paymentIntentId: existingPaymentIntent.id
          });
        }
        
        // Si el Payment Intent fue cancelado, expirado o falló, limpiarlo
        if (existingPaymentIntent.status === 'canceled' || 
            existingPaymentIntent.status === 'succeeded' ||
            existingPaymentIntent.status === 'payment_failed') {
          
          console.log('🧹 Limpiando Payment Intent:', existingPaymentIntent.status);
          rental.paymentIntentId = undefined;
          await rental.save();
        }
        
      } catch (stripeError) {
        console.log('⚠️ Payment Intent no encontrado en Stripe, limpiando referencia');
        rental.paymentIntentId = undefined;
        await rental.save();
      }
    }

    // Verificar que tengamos un precio válido
    if (!rental.totalPrice || isNaN(rental.totalPrice) || rental.totalPrice <= 0) {
      return res.status(400).json({
        message: 'El alquiler no tiene un precio válido'
      });
    }

    // Calcular el monto en centavos (Stripe usa centavos)
    const amount = Math.round(rental.totalPrice * 100);

    console.log('💰 Monto calculado:', amount, 'centavos para', rental.totalPrice, 'soles');

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'pen', // Soles peruanos
      metadata: {
        rentalId: rental._id.toString(),
        productTitle: rental.product.title,
        renterEmail: rental.renter.email
      }
    });

    console.log('✅ Payment Intent creado:', paymentIntent.id);

    // Actualizar el alquiler con el Payment Intent ID
    rental.paymentIntentId = paymentIntent.id;
    await rental.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('❌ Error creando Payment Intent:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Confirmar pago exitoso (llamado desde el frontend)
router.post('/confirm-payment', authMiddleware, [
  body('paymentIntentId').notEmpty().withMessage('Payment Intent ID requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { paymentIntentId } = req.body;
    const userId = req.user.id;

    // Buscar el alquiler por Payment Intent ID
    const rental = await Rental.findOne({ paymentIntentId })
      .populate('product', 'title')
      .populate('renter', 'name email')
      .populate('owner', 'name email');

    if (!rental) {
      return res.status(404).json({ 
        message: 'Alquiler no encontrado' 
      });
    }

    // Verificar que el usuario sea el arrendatario
    if (rental.renter._id.toString() !== userId) {
      return res.status(403).json({ 
        message: 'No tienes permisos para confirmar este pago' 
      });
    }

    // Verificar el estado del Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Actualizar el estado del alquiler
      rental.paymentStatus = 'paid';
      rental.paidAt = new Date();
      await rental.save();

      console.log(`✅ Pago confirmado para alquiler ${rental._id}`);

      res.json({
        message: 'Pago confirmado exitosamente',
        rental: {
          id: rental._id,
          status: rental.status,
          paymentStatus: rental.paymentStatus,
          paidAt: rental.paidAt
        }
      });
    } else {
      res.status(400).json({
        message: 'El pago no se ha completado',
        paymentStatus: paymentIntent.status
      });
    }

  } catch (error) {
    console.error('Error confirmando pago:', error);
    res.status(500).json({
      message: 'Error al confirmar el pago',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Webhook endpoint para Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el evento
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('💳 Payment Intent succeeded:', paymentIntent.id);
      
      // Actualizar el alquiler automáticamente
      try {
        const rental = await Rental.findOne({ paymentIntentId: paymentIntent.id });
        if (rental && rental.paymentStatus !== 'paid') {
          rental.paymentStatus = 'paid';
          rental.paidAt = new Date();
          await rental.save();
          console.log(`✅ Alquiler ${rental._id} marcado como pagado automáticamente`);
        }
      } catch (error) {
        console.error('Error actualizando alquiler desde webhook:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('❌ Payment Intent failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
