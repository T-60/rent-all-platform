#!/usr/bin/env node

/**
 * 🔄 SCRIPT PARA LIMPIAR CACHÉ DEL FRONTEND
 * 
 * Este script hace una petición al backend para verificar que los productos
 * realmente estén eliminados y muestra el estado actual
 */

const API_URL = 'http://localhost:3001/api';

async function checkBackendState() {
  try {
    console.log('🔍 Verificando estado del backend...');
    
    // Verificar productos
    const productsResponse = await fetch(`${API_URL}/products`);
    const productsData = await productsResponse.json();
    
    console.log('📦 Estado de productos:');
    console.log(`   Total productos: ${productsData.products?.length || 0}`);
    if (productsData.products?.length > 0) {
      console.log('   ⚠️ Productos encontrados:', productsData.products.map(p => p.title));
    } else {
      console.log('   ✅ No hay productos en el backend');
    }
    
    // Verificar usuarios
    try {
      const usersResponse = await fetch(`${API_URL}/admin/users`);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log(`👥 Total usuarios: ${usersData.users?.length || 0}`);
      }
    } catch (err) {
      console.log('👥 No se pudo verificar usuarios (endpoint no disponible)');
    }
    
    console.log('\n🎯 INSTRUCCIONES PARA LIMPIAR CACHÉ DEL NAVEGADOR:');
    console.log('1. Abre http://localhost:3000 en el navegador');
    console.log('2. Presiona Ctrl+Shift+R (o Cmd+Shift+R en Mac) para refrescar forzosamente');
    console.log('3. O abre las herramientas de desarrollador (F12) y:');
    console.log('   - Ve a la pestaña "Application" o "Aplicación"');
    console.log('   - Selecciona "Storage" > "Clear storage"');
    console.log('   - Haz clic en "Clear site data"');
    console.log('4. Alternativamente, presiona F5 varias veces para refrescar');
    
  } catch (error) {
    console.error('❌ Error verificando backend:', error.message);
    console.log('\n🔧 Asegúrate de que el backend esté ejecutándose en puerto 3001');
  }
}

checkBackendState();
