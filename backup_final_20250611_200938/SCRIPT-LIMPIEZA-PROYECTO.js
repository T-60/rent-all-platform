#!/usr/bin/env node

/**
 * 🧹 SCRIPT DE LIMPIEZA COMPLETA DEL PROYECTO RENT+ALL
 * 
 * Este script elimina archivos obsoletos, duplicados y temporales
 * manteniendo solo los archivos esenciales para el funcionamiento
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 INICIANDO LIMPIEZA DEL PROYECTO RENT+ALL');
console.log('==========================================');

// Archivos y directorios a MANTENER (esenciales)
const ARCHIVOS_ESENCIALES = [
  // Configuración principal
  'package.json',
  'next.config.mjs', 
  'tailwind.config.ts',
  'tsconfig.json',
  '.env.example',
  '.env.local',
  '.gitignore',
  'README.md',

  // Aplicación Next.js
  'app/',
  'components/',
  'contexts/',
  'lib/',
  'public/',

  // Backend
  'backend/package.json',
  'backend/server.js',
  'backend/models/',
  'backend/routes/',
  'backend/middleware/',
  'backend/uploads/',
  'backend/.env',

  // Archivos de desarrollo esenciales
  'pnpm-lock.yaml',
  'node_modules/',
  '.next/',
  '.git/',

  // Este script de limpieza
  'SCRIPT-LIMPIEZA-PROYECTO.js'
];

// Archivos y patrones a ELIMINAR (obsoletos/temporales)
const ARCHIVOS_A_ELIMINAR = [
  // Scripts de debugging y testing temporales
  'debug-*.js',
  'test-*.js', 
  'final-*.js',
  'simulate-*.js',
  'clear-*.js',
  'clean-*.js',
  'verify-*.sh',
  'simple-test.js',

  // Scripts de limpieza de BD (ya usados)
  'clean-database-*.js',
  'clean-all-*.js',

  // Documentación redundante/temporal
  'LIMPIEZA-EXITOSA-FINAL.md',
  'RESUMEN-FINAL-EXITOSO.txt',
  'TESTING_STATUS.md',
  'GUÍA-MEJORAS-IMÁGENES.md',
  'TEAM-SUMMARY.md',
  'PULL_REQUEST_DESCRIPTION.md',
  'FINAL_PR_STATUS.md',
  'READY_FOR_TESTING.md',
  'DOCUMENTACION_COMPLETA.md',
  'NETWORK_TESTING_GUIDE.md',
  'TESTING_INSTRUCTIONS_FINAL.md',
  'PR_DESCRIPTION.md',
  'COMMIT_MESSAGE.md',
  'IMAGES_NETWORK_FIXED.md',
  'PR_COMMIT_MESSAGE.md',
  'FUNCIONALIDAD_PRODUCTOS_ALQUILADOS.md',
  'INSTALLATION-GUIDE.md',
  'RESUMEN_EJECUTIVO_FINAL.md',
  'CONFIGURACION_AUTOMATICA_COMPLETA.md',
  'QUICK-START.md',
  'GUIA_DEMO_UNIVERSIDAD.md',
  'SETUP.md',

  // Archivos de contexto duplicados
  'contexts/auth-context-old.tsx',
  'contexts/auth-context-new.tsx',
  
  // Archivos de página duplicados
  'app/**/page-new.tsx',
  
  // Modelos duplicados en backend
  'backend/models/**/User 2.js'
];

// Función para verificar si un archivo debe mantenerse
function debeMantenerse(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Verificar archivos esenciales
  for (const esencial of ARCHIVOS_ESENCIALES) {
    if (relativePath === esencial || relativePath.startsWith(esencial)) {
      return true;
    }
  }
  
  return false;
}

// Función para verificar si un archivo debe eliminarse
function debeEliminarse(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Verificar patrones de eliminación
  for (const patron of ARCHIVOS_A_ELIMINAR) {
    if (patron.includes('*')) {
      // Pattern matching
      const regex = new RegExp(patron.replace(/\*/g, '.*'));
      if (regex.test(fileName) || regex.test(relativePath)) {
        return true;
      }
    } else {
      // Coincidencia exacta
      if (fileName === patron || relativePath === patron) {
        return true;
      }
    }
  }
  
  return false;
}

// Función para escanear directorio
function escanearDirectorio(dir, archivosEncontrados = []) {
  if (!fs.existsSync(dir)) {
    return archivosEncontrados;
  }

  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Saltar directorios del sistema
      if (['.git', 'node_modules', '.next'].includes(item)) {
        continue;
      }
      escanearDirectorio(fullPath, archivosEncontrados);
    } else {
      archivosEncontrados.push(fullPath);
    }
  }
  
  return archivosEncontrados;
}

// Función principal de limpieza
async function limpiarProyecto() {
  try {
    console.log('\n📂 Escaneando proyecto...');
    const todosLosArchivos = escanearDirectorio(process.cwd());
    console.log(`✅ ${todosLosArchivos.length} archivos encontrados`);

    // Clasificar archivos
    const archivosAEliminar = [];
    const archivosAMantener = [];
    
    for (const archivo of todosLosArchivos) {
      if (debeEliminarse(archivo)) {
        archivosAEliminar.push(archivo);
      } else if (debeMantenerse(archivo)) {
        archivosAMantener.push(archivo);
      }
    }

    console.log('\n📊 ANÁLISIS DE ARCHIVOS:');
    console.log(`🗑️  Para eliminar: ${archivosAEliminar.length}`);
    console.log(`💾 Para mantener: ${archivosAMantener.length}`);
    console.log(`❓ Sin clasificar: ${todosLosArchivos.length - archivosAEliminar.length - archivosAMantener.length}`);

    // Mostrar archivos a eliminar
    if (archivosAEliminar.length > 0) {
      console.log('\n🗑️ ARCHIVOS MARCADOS PARA ELIMINACIÓN:');
      archivosAEliminar.forEach(archivo => {
        const relativePath = path.relative(process.cwd(), archivo);
        console.log(`   - ${relativePath}`);
      });
    }

    // Confirmación de usuario
    console.log('\n⚠️  ¿PROCEDER CON LA ELIMINACIÓN? (y/N)');
    console.log('💡 Se recomienda hacer backup antes de continuar');
    
    // En modo automático para este ejemplo, proceder
    console.log('🤖 Modo automático: procediendo con limpieza...');
    
    // Crear backup de archivos importantes
    console.log('\n💾 Creando backup de archivos a eliminar...');
    const backupDir = `backup_limpieza_${new Date().toISOString().replace(/:/g, '-').split('.')[0]}`;
    fs.mkdirSync(backupDir, { recursive: true });
    
    for (const archivo of archivosAEliminar) {
      try {
        const relativePath = path.relative(process.cwd(), archivo);
        const backupPath = path.join(backupDir, relativePath);
        
        // Crear directorio si no existe
        fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        
        // Copiar archivo
        fs.copyFileSync(archivo, backupPath);
      } catch (error) {
        console.log(`⚠️ Error haciendo backup de ${archivo}: ${error.message}`);
      }
    }
    
    console.log(`✅ Backup creado en: ${backupDir}`);

    // Eliminar archivos
    console.log('\n🗑️ Eliminando archivos...');
    let eliminados = 0;
    let errores = 0;
    
    for (const archivo of archivosAEliminar) {
      try {
        fs.unlinkSync(archivo);
        eliminados++;
        
        const relativePath = path.relative(process.cwd(), archivo);
        console.log(`✅ Eliminado: ${relativePath}`);
      } catch (error) {
        errores++;
        console.log(`❌ Error eliminando ${archivo}: ${error.message}`);
      }
    }

    // Limpiar directorios vacíos
    console.log('\n📁 Limpiando directorios vacíos...');
    const directoriosLimpiados = limpiarDirectoriosVacios(process.cwd());
    
    console.log('\n🎉 LIMPIEZA COMPLETADA!');
    console.log('========================');
    console.log(`✅ Archivos eliminados: ${eliminados}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`📁 Directorios limpiados: ${directoriosLimpiados}`);
    console.log(`💾 Backup guardado en: ${backupDir}`);
    
    console.log('\n📝 SIGUIENTE PASO:');
    console.log('Verifica que la aplicación siga funcionando correctamente:');
    console.log('1. cd backend && npm start');
    console.log('2. pnpm dev');
    console.log('3. Abrir http://localhost:3000');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error.message);
    process.exit(1);
  }
}

// Función para limpiar directorios vacíos
function limpiarDirectoriosVacios(dir, limpiados = 0) {
  if (!fs.existsSync(dir)) {
    return limpiados;
  }

  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !['node_modules', '.git', '.next'].includes(item)) {
      limpiados = limpiarDirectoriosVacios(fullPath, limpiados);
      
      // Verificar si el directorio está vacío después de la limpieza
      try {
        const itemsRestantes = fs.readdirSync(fullPath);
        if (itemsRestantes.length === 0) {
          fs.rmdirSync(fullPath);
          limpiados++;
          console.log(`📁 Directorio vacío eliminado: ${path.relative(process.cwd(), fullPath)}`);
        }
      } catch (error) {
        // Ignorar errores al eliminar directorios
      }
    }
  }
  
  return limpiados;
}

// Ejecutar limpieza
if (require.main === module) {
  limpiarProyecto();
}

module.exports = { limpiarProyecto };
