const mongoose = require('mongoose');
require('dotenv').config();

// Importar todos los modelos para asegurar que están registrados
const User = require('./models/User');
const Product = require('./models/Product');
const Rental = require('./models/Rental');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

async function clearDatabase() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/rent-all-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
    
    // Lista de colecciones a limpiar
    const collections = [
      'users',
      'products', 
      'rentals',
      'messages',
      'notifications',
      'sessions'
    ];
    
    console.log('🧹 Iniciando limpieza de base de datos...');
    
    for (const collectionName of collections) {
      try {
        const collection = mongoose.connection.db.collection(collectionName);
        const result = await collection.deleteMany({});
        console.log(`🗑️ Colección '${collectionName}': ${result.deletedCount} documentos eliminados`);
      } catch (error) {
        console.log(`⚠️ Colección '${collectionName}' no existe o ya está vacía`);
      }
    }
    
    console.log('✨ ¡Base de datos completamente limpia!');
    console.log('🔄 Cerrando conexión...');
    
    await mongoose.connection.close();
    console.log('👋 Desconectado de MongoDB');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error.message);
    process.exit(1);
  }
}

clearDatabase();
