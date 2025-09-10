const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const Rental = require('../models/Rental');
const NotificationService = require('../services/NotificationService');

// Webhook de Stripe para manejar eventos de pago
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log(`📥 Webhook recibido: ${event.type}`);
  } catch (err) {
    console.error('❌ Error verificando webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar diferentes tipos de eventos
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;
      
      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

// Manejar pago exitoso
async function handlePaymentSuccess(paymentIntent) {
  try {
    const rentalId = paymentIntent.metadata.rentalId;
    console.log(`✅ Procesando pago exitoso para alquiler ${rentalId}`);
    
    const rental = await Rental.findById(rentalId)
      .populate('product', 'title')
      .populate('renter', 'name email')
      .populate('owner', 'name email');

    if (!rental) {
      console.error(`❌ Alquiler ${rentalId} no encontrado`);
      return;
    }

    // Actualizar estado del alquiler
    rental.paymentStatus = 'paid';
    rental.transactionId = paymentIntent.id;
    // Añadir entrada al historial de estados
    rental.statusHistory.push({
      status: rental.status,
      changedBy: rental.renter._id,
      changedAt: new Date(),
      notes: `Pago procesado exitosamente. ID: ${paymentIntent.id}`
    });
    
    await rental.save();

    // Enviar notificaciones
    try {
      // Notificar al propietario que recibió el pago
      await NotificationService.createCustomNotification(
        rental.owner._id,
        '💰 Pago recibido',
        `Has recibido el pago de S/ ${rental.totalPrice} por el alquiler de "${rental.product.title}". Ahora puedes programar la entrega.`,
        'payment_received',
        rental.product._id,
        rental._id,
        rental.renter._id
      );

      // Notificar al arrendatario que su pago fue exitoso
      await NotificationService.createCustomNotification(
        rental.renter._id,
        '✅ Pago confirmado',
        `Tu pago de S/ ${rental.totalPrice} por "${rental.product.title}" ha sido procesado exitosamente. El propietario coordinará la entrega contigo.`,
        'payment_confirmed',
        rental.product._id,
        rental._id,
        rental.owner._id
      );

      console.log(`📧 Notificaciones de pago enviadas para alquiler ${rentalId}`);
    } catch (notifError) {
      console.error('❌ Error enviando notificaciones:', notifError);
    }

    console.log(`✅ Pago procesado exitosamente para alquiler ${rentalId}`);

  } catch (error) {
    console.error('❌ Error manejando pago exitoso:', error);
  }
}

// Manejar pago fallido
async function handlePaymentFailed(paymentIntent) {
  try {
    const rentalId = paymentIntent.metadata.rentalId;
    console.log(`❌ Procesando pago fallido para alquiler ${rentalId}`);
    
    const rental = await Rental.findById(rentalId)
      .populate('product', 'title')
      .populate('renter', 'name email');

    if (rental) {
      rental.paymentStatus = 'failed';
      rental.statusHistory.push({
        status: rental.status,
        changedBy: rental.renter._id,
        changedAt: new Date(),
        notes: `Pago falló. Error: ${paymentIntent.last_payment_error?.message || 'Error desconocido'}`
      });
      
      await rental.save();

      // Notificar al arrendatario del fallo
      try {
        await NotificationService.createCustomNotification(
          rental.renter._id,
          '❌ Pago falló',
          `Tu pago para "${rental.product.title}" no pudo ser procesado. Por favor, intenta nuevamente o usa otro método de pago.`,
          'payment_failed',
          rental.product._id,
          rental._id
        );
      } catch (notifError) {
        console.error('❌ Error enviando notificación de fallo:', notifError);
      }

      console.log(`❌ Pago falló para alquiler ${rentalId}`);
    }
  } catch (error) {
    console.error('❌ Error manejando pago fallido:', error);
  }
}

// Manejar pago cancelado
async function handlePaymentCanceled(paymentIntent) {
  try {
    const rentalId = paymentIntent.metadata.rentalId;
    console.log(`🚫 Procesando pago cancelado para alquiler ${rentalId}`);
    
    const rental = await Rental.findById(rentalId);

    if (rental) {
      rental.paymentStatus = 'pending'; // Volver a pendiente para permitir reintento
      rental.statusHistory.push({
        status: rental.status,
        changedBy: rental.renter._id,
        changedAt: new Date(),
        notes: 'Pago cancelado por el usuario'
      });
      
      await rental.save();
      console.log(`🚫 Pago cancelado para alquiler ${rentalId}`);
    }
  } catch (error) {
    console.error('❌ Error manejando pago cancelado:', error);
  }
}

module.exports = router;
