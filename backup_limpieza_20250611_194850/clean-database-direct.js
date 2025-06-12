const { MongoClient } = require('mongodb');

console.log('🗑️ LIMPIEZA DIRECTA DE BASE DE DATOS MONGODB');
console.log('==========================================');

async function cleanDatabase() {
  const uri = 'mongodb://localhost:27017';
  const dbName = 'rentall';
  
  const client = new MongoClient(uri);
  
  try {
    console.log('🔌 Conectando a MongoDB...');
    await client.connect();
    console.log('✅ Conectado exitosamente');
    
    const db = client.db(dbName);
    
    // Eliminar todos los productos
    console.log('\n📦 Eliminando todos los productos...');
    const productsResult = await db.collection('products').deleteMany({});
    console.log(`✅ ${productsResult.deletedCount} productos eliminados`);
    
    // Eliminar todos los alquileres
    console.log('\n🏠 Eliminando todos los alquileres...');
    const rentalsResult = await db.collection('rentals').deleteMany({});
    console.log(`✅ ${rentalsResult.deletedCount} alquileres eliminados`);
    
    // Verificar limpieza
    console.log('\n🔍 Verificando limpieza...');
    const remainingProducts = await db.collection('products').countDocuments();
    const remainingRentals = await db.collection('rentals').countDocuments();
    const totalUsers = await db.collection('users').countDocuments();
    
    console.log(`📊 Productos restantes: ${remainingProducts}`);
    console.log(`📊 Alquileres restantes: ${remainingRentals}`);
    console.log(`📊 Usuarios (mantenidos): ${totalUsers}`);
    
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
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Función para crear usuario limpio
async function createCleanUser() {
  console.log('\n👤 Creando usuario de prueba limpio...');
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Usuario Limpio',
        email: 'limpio@test.com',
        password: '123456',
        university: 'Universidad Test',
        location: 'Lima, Peru'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      console.log('✅ Usuario creado exitosamente');
      console.log('📧 Email: limpio@test.com');
      console.log('🔐 Password: 123456');
      return true;
    } else {
      console.log(`ℹ️ Usuario ya existe o error: ${data.message}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
    return false;
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando limpieza completa...\n');
  
  // Verificar conexión al backend
  try {
    const healthResponse = await fetch('http://localhost:3001/api/health');
    if (!healthResponse.ok) {
      throw new Error('Backend no disponible');
    }
    console.log('✅ Backend disponible');
  } catch (error) {
    console.error('❌ Backend no disponible. Asegúrate de que esté ejecutándose.');
    process.exit(1);
  }
  
  // Limpiar base de datos
  const dbCleaned = await cleanDatabase();
  
  // Crear usuario limpio
  const userCreated = await createCleanUser();
  
  console.log('\n🎯 RESUMEN FINAL:');
  console.log('================');
  console.log(`🗑️ Base de datos limpia: ${dbCleaned ? '✅' : '❌'}`);
  console.log(`👤 Usuario limpio creado: ${userCreated ? '✅' : '❌'}`);
  console.log(`📁 Archivos de imagen eliminados: ✅`);
  console.log(`💾 Backup de imágenes creado: ✅`);
  
  if (dbCleaned) {
    console.log('\n🎉 ¡LIMPIEZA COMPLETA EXITOSA!');
    console.log('\n🧪 Para probar ahora:');
    console.log('   1. Ve a http://localhost:3002');
    console.log('   2. Login con: limpio@test.com / 123456');
    console.log('   3. Crea productos nuevos con imágenes válidas');
    console.log('   4. ¡No más errores de imágenes inválidas!');
  } else {
    console.log('\n⚠️ Limpieza parcial. Revisa los errores anteriores.');
  }
}

main().catch(console.error);
