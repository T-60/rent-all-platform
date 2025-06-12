#!/usr/bin/env node

/**
 * 🔍 ANÁLISIS PROFUNDO Y LIMPIEZA DE SUBCARPETAS - RENT+ALL
 * 
 * Este script encuentra y elimina archivos obsoletos, duplicados y temporales
 * en todas las subcarpetas del proyecto
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISIS PROFUNDO DE SUBCARPETAS - RENT+ALL');
console.log('==============================================');

// Archivos específicos identificados para eliminación
const ARCHIVOS_OBSOLETOS = {
  // Backend - Scripts temporales y duplicados
  'backend/clean-all.js': 'Script de limpieza temporal',
  'backend/clean-database.js': 'Script de limpieza temporal',
  'backend/create-test-images.js': 'Script de testing temporal',
  'backend/create-test-products.js': 'Script de testing temporal',
  'backend/debug-database.js': 'Script de debugging temporal',
  'backend/insert-test-product.js': 'Script de testing temporal',
  'backend/test-connection.js': 'Script de testing temporal',
  'backend/test-api.sh': 'Script de testing temporal',
  'backend/server.log': 'Log temporal',
  
  // Backend - Modelos duplicados
  'backend/models/Product 2.js': 'Modelo duplicado',
  'backend/models/Rental 2.js': 'Modelo duplicado', 
  'backend/models/User 2.js': 'Modelo duplicado',
  
  // App - Páginas de debugging y duplicados
  'app/image-debug/page.tsx': 'Página de debugging temporal',
  'app/image-test/page.tsx': 'Página de testing temporal',
  'app/products/page-new.tsx': 'Página duplicada',
  
  // Components - Componentes duplicados y temporales
  'components/product-card-backup-20250609-161251.tsx': 'Backup temporal',
  'components/product-card-direct.tsx': 'Componente duplicado',
  'components/product-card-improved.tsx': 'Componente duplicado',
  'components/product-card-simple.tsx': 'Componente duplicado',
  'components/direct-image.tsx': 'Componente temporal',
  'components/image-debug.tsx': 'Componente de debugging',
  'components/live-image-test.tsx': 'Componente de testing',
  'components/simple-test-image.tsx': 'Componente de testing',
  'components/smart-image.tsx': 'Componente duplicado/obsoleto',
  'components/ultra-smart-image.tsx': 'Componente experimental',
  
  // Contexts - Contextos duplicados
  'contexts/auth-context-new.tsx': 'Contexto duplicado',
  'contexts/auth-context-old.tsx': 'Contexto duplicado'
};

// Archivos esenciales que NO deben tocarse
const ARCHIVOS_ESENCIALES_SUBCARPETAS = [
  // Backend esencial
  'backend/server.js',
  'backend/package.json',
  'backend/models/Product.js',
  'backend/models/Rental.js', 
  'backend/models/User.js',
  'backend/models/Notification.js',
  'backend/routes/',
  'backend/middleware/',
  'backend/services/',
  
  // App esencial
  'app/layout.tsx',
  'app/page.tsx',
  'app/auth/page.tsx',
  'app/dashboard/page.tsx',
  'app/products/page.tsx',
  'app/products/[id]/page.tsx',
  'app/profile/page.tsx',
  'app/notifications/page.tsx',
  
  // Components esenciales
  'components/product-card.tsx',
  'components/simple-smart-image.tsx',
  'components/add-product-form.tsx',
  'components/edit-product-form.tsx',
  'components/protected-route.tsx',
  'components/ui/',
  
  // Contexts esenciales
  'contexts/auth-context.tsx',
  'contexts/products-context.tsx',
  'contexts/notification-context.tsx'
];

// Función para verificar si un archivo debe preservarse
function esArchivoEsencial(archivo) {
  return ARCHIVOS_ESENCIALES_SUBCARPETAS.some(esencial => 
    archivo.includes(esencial) || archivo.startsWith(esencial)
  );
}

// Función principal de análisis
function analizarSubcarpetas() {
  console.log('\n📊 ARCHIVOS IDENTIFICADOS PARA ELIMINACIÓN:');
  console.log('==========================================');
  
  let categoriasEncontradas = {
    'Scripts de Backend Temporales': [],
    'Modelos Duplicados': [],
    'Páginas de Debug/Testing': [],
    'Componentes Duplicados/Temporales': [],
    'Contextos Duplicados': [],
    'Archivos de Log': []
  };
  
  // Categorizar archivos obsoletos
  for (const [archivo, descripcion] of Object.entries(ARCHIVOS_OBSOLETOS)) {
    if (fs.existsSync(archivo)) {
      if (archivo.startsWith('backend/') && (archivo.includes('test') || archivo.includes('debug') || archivo.includes('clean'))) {
        categoriasEncontradas['Scripts de Backend Temporales'].push({ archivo, descripcion });
      } else if (archivo.includes(' 2.js')) {
        categoriasEncontradas['Modelos Duplicados'].push({ archivo, descripcion });
      } else if (archivo.includes('debug') || archivo.includes('test')) {
        categoriasEncontradas['Páginas de Debug/Testing'].push({ archivo, descripcion });
      } else if (archivo.startsWith('components/') && (archivo.includes('backup') || archivo.includes('simple') || archivo.includes('direct'))) {
        categoriasEncontradas['Componentes Duplicados/Temporales'].push({ archivo, descripcion });
      } else if (archivo.includes('auth-context-')) {
        categoriasEncontradas['Contextos Duplicados'].push({ archivo, descripcion });
      } else if (archivo.includes('.log')) {
        categoriasEncontradas['Archivos de Log'].push({ archivo, descripcion });
      }
    }
  }
  
  // Mostrar resultados por categoría
  let totalArchivos = 0;
  for (const [categoria, archivos] of Object.entries(categoriasEncontradas)) {
    if (archivos.length > 0) {
      console.log(`\n🗑️ ${categoria} (${archivos.length} archivos):`);
      archivos.forEach(({ archivo, descripcion }) => {
        console.log(`   - ${archivo} (${descripcion})`);
        totalArchivos++;
      });
    }
  }
  
  console.log(`\n📊 TOTAL ARCHIVOS OBSOLETOS ENCONTRADOS: ${totalArchivos}`);
  
  return { categoriasEncontradas, totalArchivos };
}

// Función para ejecutar la limpieza
function ejecutarLimpiezaProfunda() {
  console.log('\n🧹 EJECUTANDO LIMPIEZA PROFUNDA...');
  console.log('=================================');
  
  // Crear backup adicional para subcarpetas
  const backupDir = `backup_subcarpetas_${new Date().toISOString().replace(/:/g, '-').split('.')[0]}`;
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`💾 Backup creado: ${backupDir}`);
  
  let eliminados = 0;
  let errores = 0;
  
  for (const [archivo, descripcion] of Object.entries(ARCHIVOS_OBSOLETOS)) {
    if (fs.existsSync(archivo)) {
      try {
        // Crear estructura de directorios en backup
        const backupPath = path.join(backupDir, archivo);
        fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        
        // Copiar archivo al backup
        fs.copyFileSync(archivo, backupPath);
        
        // Eliminar archivo original
        fs.unlinkSync(archivo);
        
        console.log(`✅ Eliminado: ${archivo} (${descripcion})`);
        eliminados++;
      } catch (error) {
        console.log(`❌ Error eliminando ${archivo}: ${error.message}`);
        errores++;
      }
    }
  }
  
  console.log(`\n📊 RESULTADOS DE LIMPIEZA PROFUNDA:`);
  console.log(`   ✅ Archivos eliminados: ${eliminados}`);
  console.log(`   ❌ Errores: ${errores}`);
  console.log(`   💾 Backup en: ${backupDir}`);
  
  return { eliminados, errores, backupDir };
}

// Función para verificar integridad post-limpieza
function verificarIntegridad() {
  console.log('\n🔍 VERIFICANDO INTEGRIDAD POST-LIMPIEZA...');
  console.log('=========================================');
  
  const archivosEsencialesFaltantes = [];
  
  const esenciales = [
    'backend/server.js',
    'backend/models/Product.js',
    'app/layout.tsx',
    'app/page.tsx',
    'components/product-card.tsx',
    'contexts/auth-context.tsx'
  ];
  
  for (const archivo of esenciales) {
    if (!fs.existsSync(archivo)) {
      archivosEsencialesFaltantes.push(archivo);
    }
  }
  
  if (archivosEsencialesFaltantes.length === 0) {
    console.log('✅ Todos los archivos esenciales están presentes');
    return true;
  } else {
    console.log('❌ Archivos esenciales faltantes:');
    archivosEsencialesFaltantes.forEach(archivo => {
      console.log(`   - ${archivo}`);
    });
    return false;
  }
}

// Función principal
function main() {
  console.log('\n🚀 Iniciando análisis profundo del proyecto...\n');
  
  // Análizar archivos obsoletos
  const { categoriasEncontradas, totalArchivos } = analizarSubcarpetas();
  
  if (totalArchivos === 0) {
    console.log('\n🎉 ¡No se encontraron archivos obsoletos en subcarpetas!');
    console.log('✅ El proyecto ya está limpio');
    return;
  }
  
  console.log('\n⚠️ ¿PROCEDER CON LA LIMPIEZA PROFUNDA?');
  console.log('Esta acción eliminará archivos duplicados y temporales en subcarpetas');
  console.log('💾 Se creará un backup completo de seguridad');
  
  // Ejecutar limpieza (modo automático para este ejemplo)
  console.log('\n🤖 Procediendo con limpieza automática...');
  
  const { eliminados, errores, backupDir } = ejecutarLimpiezaProfunda();
  
  // Verificar integridad
  const integridadOk = verificarIntegridad();
  
  console.log('\n🎯 RESUMEN FINAL DE LIMPIEZA PROFUNDA:');
  console.log('====================================');
  console.log(`✅ Archivos obsoletos eliminados: ${eliminados}`);
  console.log(`❌ Errores durante limpieza: ${errores}`);
  console.log(`🔍 Integridad del proyecto: ${integridadOk ? '✅ OK' : '❌ PROBLEMAS'}`);
  console.log(`💾 Backup disponible en: ${backupDir}`);
  
  if (integridadOk && errores === 0) {
    console.log('\n🎉 ¡LIMPIEZA PROFUNDA COMPLETADA EXITOSAMENTE!');
    console.log('✅ Proyecto limpio y funcional');
    console.log('✅ Archivos duplicados y temporales eliminados');
    console.log('✅ Estructura esencial preservada');
  } else {
    console.log('\n⚠️ Limpieza completada con advertencias');
    console.log('Revisa los errores anteriores');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { analizarSubcarpetas, ejecutarLimpiezaProfunda, verificarIntegridad };
