const mongoose = require('mongoose');
const Rental = require('./models/Rental');

async function clearPaymentIntents() {
  try {
    await mongoose.connect('mongodb://localhost:27017/rent-all-platform');
    console.log('✅ Conectado a MongoDB');
    
    // Limpiar todos los Payment Intent IDs para poder probar de nuevo
    const result = await Rental.updateMany(
      { paymentIntentId: { $exists: true } },
      { $unset: { paymentIntentId: 1 } }
    );
    
    console.log('🧹 Payment Intents limpiados:', result.modifiedCount, 'alquileres');
    
    // También resetear el estado de pago si es necesario
    const paymentResult = await Rental.updateMany(
      { paymentStatus: 'paid' },
      { $set: { paymentStatus: 'pending' }, $unset: { paidAt: 1 } }
    );
    
    console.log('💰 Estados de pago reseteados:', paymentResult.modifiedCount, 'alquileres');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

clearPaymentIntents();
