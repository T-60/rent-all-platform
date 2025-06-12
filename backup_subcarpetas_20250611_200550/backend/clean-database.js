// Script para limpiar la base de datos usando mongoose
const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelos
const Product = require('./models/Product');
const Rental = require('./models/Rental');
const User = require('./models/User');

console.log('🗑️ LIMPIEZA DE BASE DE DATOS CON MONGOOSE');
console.log('========================================');

async function cleanDatabase() {
  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentall';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado exitosamente');

    // Contar documentos antes de limpiar
    const productsCount = await Product.countDocuments();
    const rentalsCount = await Rental.countDocuments();
    const usersCount = await User.countDocuments();
    
    console.log(`\n📊 Estado antes de limpiar:`);
    console.log(`   Productos: ${productsCount}`);
    console.log(`   Alquileres: ${rentalsCount}`);
    console.log(`   Usuarios: ${usersCount}`);

    // Eliminar todos los productos
    console.log('\n📦 Eliminando todos los productos...');
    const productsResult = await Product.deleteMany({});
    console.log(`✅ ${productsResult.deletedCount} productos eliminados`);

    // Eliminar todos los alquileres
    console.log('\n🏠 Eliminando todos los alquileres...');
    const rentalsResult = await Rental.deleteMany({});
    console.log(`✅ ${rentalsResult.deletedCount} alquileres eliminados`);

    // Verificar limpieza
    console.log('\n🔍 Verificando limpieza...');
    const remainingProducts = await Product.countDocuments();
    const remainingRentals = await Rental.countDocuments();
    const totalUsers = await User.countDocuments();

    console.log(`📊 Estado después de limpiar:`);
    console.log(`   Productos restantes: ${remainingProducts}`);
    console.log(`   Alquileres restantes: ${remainingRentals}`);
    console.log(`   Usuarios (mantenidos): ${totalUsers}`);

    if (remainingProducts === 0 && remainingRentals === 0) {
      console.log('\n🎉 ¡BASE DE DATOS LIMPIA EXITOSAMENTE!');
      return true;
    } else {
      console.log('\n⚠️ Algunos datos permanecen en la base de datos');
      return false;
    }

  } catch (error) {
    console.error('❌ Error limpiando base de datos:', error.message);
    return false;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

// Función para verificar archivos de imagen
function verifyImageCleanup() {
  console.log('\n📁 Verificando archivos de imagen...');
  const fs = require('fs');
  const path = require('path');
  
  const uploadsDir = path.join(__dirname, 'uploads', 'products');
  
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => 
      file.match(/\.(png|jpg|jpeg|PNG|JPG)$/i) && file !== '.gitkeep'
    );
    
    console.log(`📊 Archivos de imagen restantes: ${imageFiles.length}`);
    
    if (imageFiles.length === 0) {
      console.log('✅ Directorio de imágenes limpio');
      return true;
    } else {
      console.log('⚠️ Algunos archivos de imagen permanecen:');
      imageFiles.slice(0, 5).forEach(file => console.log(`   - ${file}`));
      if (imageFiles.length > 5) {
        console.log(`   ... y ${imageFiles.length - 5} más`);
      }
      return false;
    }
  } else {
    console.log('❌ Directorio de uploads no encontrado');
    return false;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando limpieza completa...\n');
  
  // Limpiar base de datos
  const dbCleaned = await cleanDatabase();
  
  // Verificar archivos de imagen
  const imagesClean = verifyImageCleanup();
  
  console.log('\n🎯 RESUMEN FINAL:');
  console.log('================');
  console.log(`🗑️ Base de datos limpia: ${dbCleaned ? '✅' : '❌'}`);
  console.log(`📁 Archivos de imagen limpios: ${imagesClean ? '✅' : '❌'}`);
  
  if (dbCleaned && imagesClean) {
    console.log('\n🎉 ¡LIMPIEZA COMPLETA EXITOSA!');
    console.log('\n🧪 Ahora puedes:');
    console.log('   1. Ir a http://localhost:3002');
    console.log('   2. Crear productos nuevos con imágenes válidas');
    console.log('   3. ¡No más errores de imágenes inválidas!');
    console.log('\n💡 Usuarios existentes se mantuvieron para poder hacer login');
  } else {
    console.log('\n⚠️ Limpieza parcial. Revisa los errores anteriores.');
  }
}

main().catch(console.error);
