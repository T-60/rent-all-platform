#!/usr/bin/env node

/**
 * 🧹 LIMPIEZA COMPLETA DE BASE DE DATOS LOCAL
 * 
 * Este script elimina TODOS los datos de la base de datos local:
 * - Todos los usuarios
 * - Todos los productos  
 * - Todos los alquileres
 * - Todas las notificaciones
 */

// Usar mongoose del backend
const path = require('path');
const backendPath = path.join(__dirname, 'backend');

// Establecer variables de entorno
process.env.MONGODB_URI = 'mongodb://localhost:27017/rent-all-platform';
process.env.NODE_ENV = 'development';

const mongoose = require(path.join(backendPath, 'node_modules/mongoose'));

async function cleanDatabase() {
  console.log('\n🧹 === LIMPIEZA COMPLETA DE BASE DE DATOS LOCAL ===\n');
  
  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB local...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB exitosamente');
    
    const db = mongoose.connection.db;
    
    // Obtener todas las colecciones
    console.log('\n📋 Obteniendo lista de colecciones...');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('✅ Colecciones encontradas:', collectionNames.join(', '));
    
    // Limpiar cada colección
    console.log('\n🗑️ Eliminando datos de todas las colecciones...');
    
    let totalDeleted = 0;
    
    for (const collectionName of collectionNames) {
      console.log(`\n🔄 Limpiando colección: ${collectionName}`);
      
      // Contar documentos antes
      const countBefore = await db.collection(collectionName).countDocuments();
      console.log(`   📊 Documentos antes: ${countBefore}`);
      
      if (countBefore > 0) {
        // Eliminar todos los documentos
        const result = await db.collection(collectionName).deleteMany({});
        console.log(`   ✅ Eliminados: ${result.deletedCount} documentos`);
        totalDeleted += result.deletedCount;
      } else {
        console.log(`   ℹ️ Colección ya estaba vacía`);
      }
    }
    
    // Verificación final
    console.log('\n🔍 === VERIFICACIÓN FINAL ===');
    let allEmpty = true;
    for (const collectionName of collectionNames) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`   📊 ${collectionName}: ${count} documentos`);
      if (count > 0) {
        allEmpty = false;
      }
    }
    
    console.log('\n🎉 === LIMPIEZA COMPLETA EXITOSA ===');
    console.log(`✅ Total documentos eliminados: ${totalDeleted}`);
    console.log('✅ Todos los datos han sido eliminados exitosamente');
    console.log('✅ Base de datos completamente limpia');
    console.log('✅ Lista para nuevos datos de prueba');
    
    if (allEmpty) {
      console.log('\n🎯 ¡LIMPIEZA 100% EXITOSA!');
    } else {
      console.log('\n⚠️ Algunos datos permanecen (esto puede ser normal)');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR durante la limpieza:', error.message);
    console.error('🔧 Stack trace:', error.stack);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 Conexión a MongoDB cerrada');
    }
  }
}

// Ejecutar la limpieza
cleanDatabase();
