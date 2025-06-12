const mongoose = require('mongoose');
require('dotenv').config();

async function cleanAll() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado exitosamente');
    
    // Eliminar usuarios
    const usersDeleted = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`✅ Usuarios eliminados: ${usersDeleted.deletedCount}`);
    
    // Eliminar productos
    const productsDeleted = await mongoose.connection.db.collection('products').deleteMany({});
    console.log(`✅ Productos eliminados: ${productsDeleted.deletedCount}`);
    
    // Eliminar alquileres
    const rentalsDeleted = await mongoose.connection.db.collection('rentals').deleteMany({});
    console.log(`✅ Alquileres eliminados: ${rentalsDeleted.deletedCount}`);
    
    // Eliminar notificaciones
    const notificationsDeleted = await mongoose.connection.db.collection('notifications').deleteMany({});
    console.log(`✅ Notificaciones eliminadas: ${notificationsDeleted.deletedCount}`);
    
    console.log('\n🎉 ¡BASE DE DATOS COMPLETAMENTE LIMPIA!');
    console.log('✅ Todos los datos eliminados exitosamente');
    console.log('✅ Sistema listo para empezar de cero');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔧 Stack:', error.stack);
    process.exit(1);
  }
}

cleanAll();
