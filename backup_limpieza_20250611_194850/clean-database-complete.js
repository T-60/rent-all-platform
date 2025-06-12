#!/usr/bin/env node

/**
 * 🧹 LIMPIEZA COMPLETA DE BASE DE DATOS
 * 
 * Este script elimina TODOS los datos de la base de datos:
 * - Todos los usuarios
 * - Todos los productos  
 * - Todos los alquileres
 * - Todas las notificaciones
 * - Cualquier otro dato existente
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://hemorroides10:Manchitas10@cluster0.wxckm.mongodb.net/rent-all-platform?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'rent-all-platform';

async function cleanDatabase() {
  console.log('\n🧹 === LIMPIEZA COMPLETA DE BASE DE DATOS ===\n');
  
  let client;
  
  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Conectado a MongoDB exitosamente');
    
    const db = client.db(DB_NAME);
    
    // Obtener todas las colecciones
    console.log('\n📋 Obteniendo lista de colecciones...');
    const collections = await db.listCollections().toArray();
    console.log('✅ Colecciones encontradas:', collections.map(c => c.name).join(', '));
    
    // Limpiar cada colección
    console.log('\n🗑️ Eliminando datos de todas las colecciones...');
    
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\n🔄 Limpiando colección: ${collectionName}`);
      
      // Contar documentos antes
      const countBefore = await db.collection(collectionName).countDocuments();
      console.log(`   📊 Documentos antes: ${countBefore}`);
      
      if (countBefore > 0) {
        // Eliminar todos los documentos
        const result = await db.collection(collectionName).deleteMany({});
        console.log(`   ✅ Eliminados: ${result.deletedCount} documentos`);
      } else {
        console.log(`   ℹ️ Colección ya estaba vacía`);
      }
    }
    
    // Verificación final
    console.log('\n🔍 === VERIFICACIÓN FINAL ===');
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      console.log(`   📊 ${collectionName}: ${count} documentos`);
    }
    
    console.log('\n🎉 === LIMPIEZA COMPLETA EXITOSA ===');
    console.log('✅ Todos los datos han sido eliminados exitosamente');
    console.log('✅ Base de datos completamente limpia');
    console.log('✅ Lista para nuevos datos de prueba');
    
  } catch (error) {
    console.error('\n❌ ERROR durante la limpieza:', error.message);
    console.error('🔧 Detalles del error:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Conexión a MongoDB cerrada');
    }
  }
}

// Ejecutar la limpieza
cleanDatabase();
