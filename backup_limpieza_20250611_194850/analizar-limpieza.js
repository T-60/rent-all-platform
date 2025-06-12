#!/usr/bin/env node

/**
 * 🔍 ANÁLISIS PREVIO A LIMPIEZA - RENT+ALL
 * 
 * Este script analiza todos los archivos del proyecto y los categoriza
 * antes de proceder con la limpieza
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANÁLISIS DE ARCHIVOS DEL PROYECTO RENT+ALL');
console.log('===========================================');

// Categorías de archivos
const CATEGORIAS = {
  ESENCIALES: {
    nombre: '💎 ESENCIALES',
    descripcion: 'Archivos críticos para el funcionamiento',
    archivos: []
  },
  CONFIGURACION: {
    nombre: '⚙️ CONFIGURACIÓN', 
    descripcion: 'Archivos de configuración del proyecto',
    archivos: []
  },
  DOCUMENTACION_UTIL: {
    nombre: '📚 DOCUMENTACIÓN ÚTIL',
    descripcion: 'Documentación que debería mantenerse',
    archivos: []
  },
  DEBUGGING_TEMPORAL: {
    nombre: '🐛 DEBUGGING TEMPORAL',
    descripcion: 'Scripts de debugging que pueden eliminarse',
    archivos: []
  },
  DOCUMENTACION_REDUNDANTE: {
    nombre: '📄 DOCUMENTACIÓN REDUNDANTE',
    descripcion: 'Documentación duplicada o temporal',
    archivos: []
  },
  LIMPIEZA_BD: {
    nombre: '🗑️ SCRIPTS DE LIMPIEZA BD',
    descripcion: 'Scripts que ya cumplieron su propósito',
    archivos: []
  },
  TESTING_TEMPORAL: {
    nombre: '🧪 TESTING TEMPORAL',
    descripcion: 'Scripts de testing que pueden eliminarse',
    archivos: []
  }
};

// Patrones para categorización
const PATRONES = {
  ESENCIALES: [
    'package.json',
    'package-lock.json',
    'pnpm-lock.yaml',
    'next.config.mjs',
    'tailwind.config.ts',
    'tsconfig.json',
    '.env.example',
    'README.md'
  ],
  CONFIGURACION: [
    '.gitignore',
    '.env.local',
    'components.json'
  ],
  DOCUMENTACION_UTIL: [
    'README.md'
  ],
  DEBUGGING_TEMPORAL: [
    /debug-.*\.js$/,
    /simulate-.*\.js$/,
    /final-debugging.*\.js$/,
    /test-.*\.js$/,
    /verify-.*\.js$/
  ],
  DOCUMENTACION_REDUNDANTE: [
    /LIMPIEZA-.*\.md$/,
    /RESUMEN-.*\.(md|txt)$/,
    /TESTING.*\.md$/,
    /GUÍA-.*\.md$/,
    /TEAM-.*\.md$/,
    /PR_.*\.md$/,
    /PULL_REQUEST.*\.md$/,
    /COMMIT.*\.md$/,
    /FINAL.*\.md$/,
    /NETWORK.*\.md$/,
    /READY.*\.md$/,
    /INSTALLATION.*\.md$/,
    /CONFIGURACION.*\.md$/,
    /QUICK-START\.md$/,
    /SETUP\.md$/
  ],
  LIMPIEZA_BD: [
    /clean-.*\.js$/,
    /clear-.*\.js$/
  ],
  TESTING_TEMPORAL: [
    /test-.*\.sh$/,
    /verify-.*\.sh$/,
    /start-.*\.sh$/,
    /apply-.*\.sh$/,
    /fix-.*\.sh$/,
    /create-test.*\.js$/,
    /simple-test\.js$/
  ]
};

// Función para categorizar archivo
function categorizarArchivo(archivo) {
  const fileName = path.basename(archivo);
  
  // Verificar esenciales primero
  if (PATRONES.ESENCIALES.includes(fileName)) {
    return 'ESENCIALES';
  }
  
  if (PATRONES.CONFIGURACION.includes(fileName)) {
    return 'CONFIGURACION';
  }
  
  // Verificar patrones regex
  for (const [categoria, patrones] of Object.entries(PATRONES)) {
    if (categoria === 'ESENCIALES' || categoria === 'CONFIGURACION') continue;
    
    for (const patron of patrones) {
      if (patron instanceof RegExp) {
        if (patron.test(fileName)) {
          return categoria;
        }
      } else if (typeof patron === 'string') {
        if (fileName === patron) {
          return categoria;
        }
      }
    }
  }
  
  return null; // Sin categorizar
}

// Función principal de análisis
async function analizarProyecto() {
  try {
    console.log('\n📂 Escaneando archivos en directorio raíz...');
    
    const archivos = fs.readdirSync(process.cwd())
      .filter(item => {
        const stat = fs.statSync(item);
        return stat.isFile() && (
          item.endsWith('.js') || 
          item.endsWith('.md') || 
          item.endsWith('.txt') || 
          item.endsWith('.sh') ||
          item.endsWith('.json') ||
          item.endsWith('.ts') ||
          item.endsWith('.mjs')
        );
      });
    
    console.log(`✅ ${archivos.length} archivos encontrados`);
    
    // Categorizar archivos
    const sinCategorizar = [];
    
    for (const archivo of archivos) {
      const categoria = categorizarArchivo(archivo);
      
      if (categoria) {
        CATEGORIAS[categoria].archivos.push(archivo);
      } else {
        sinCategorizar.push(archivo);
      }
    }
    
    // Mostrar resultados
    console.log('\n📊 ANÁLISIS POR CATEGORÍAS:');
    console.log('=========================');
    
    for (const [key, categoria] of Object.entries(CATEGORIAS)) {
      if (categoria.archivos.length > 0) {
        console.log(`\n${categoria.nombre} (${categoria.archivos.length} archivos)`);
        console.log(`   ${categoria.descripcion}`);
        categoria.archivos.forEach(archivo => {
          console.log(`   - ${archivo}`);
        });
      }
    }
    
    if (sinCategorizar.length > 0) {
      console.log(`\n❓ SIN CATEGORIZAR (${sinCategorizar.length} archivos)`);
      console.log('   Archivos que necesitan revisión manual');
      sinCategorizar.forEach(archivo => {
        console.log(`   - ${archivo}`);
      });
    }
    
    // Resumen de recomendaciones
    console.log('\n💡 RECOMENDACIONES DE LIMPIEZA:');
    console.log('==============================');
    
    const paraEliminar = [
      ...CATEGORIAS.DEBUGGING_TEMPORAL.archivos,
      ...CATEGORIAS.DOCUMENTACION_REDUNDANTE.archivos, 
      ...CATEGORIAS.LIMPIEZA_BD.archivos,
      ...CATEGORIAS.TESTING_TEMPORAL.archivos
    ];
    
    const paraMantener = [
      ...CATEGORIAS.ESENCIALES.archivos,
      ...CATEGORIAS.CONFIGURACION.archivos,
      ...CATEGORIAS.DOCUMENTACION_UTIL.archivos
    ];
    
    console.log(`🗑️  ELIMINAR: ${paraEliminar.length} archivos`);
    console.log(`💾 MANTENER: ${paraMantener.length} archivos`);
    console.log(`❓ REVISAR: ${sinCategorizar.length} archivos`);
    
    const ahorro = Math.round((paraEliminar.length / archivos.length) * 100);
    console.log(`\n📈 REDUCCIÓN ESTIMADA: ${ahorro}% de archivos temporales`);
    
    // Crear comando de limpieza
    if (paraEliminar.length > 0) {
      console.log('\n🛠️ COMANDO DE LIMPIEZA SUGERIDO:');
      console.log('# Crear backup primero');
      console.log('mkdir backup_limpieza_$(date +%Y%m%d_%H%M%S)');
      console.log('');
      
      paraEliminar.slice(0, 10).forEach(archivo => {
        console.log(`rm "${archivo}"`);
      });
      
      if (paraEliminar.length > 10) {
        console.log(`# ... y ${paraEliminar.length - 10} archivos más`);
      }
    }
    
    return {
      total: archivos.length,
      paraEliminar: paraEliminar.length,
      paraMantener: paraMantener.length,
      sinCategorizar: sinCategorizar.length,
      archivosParaEliminar: paraEliminar
    };
    
  } catch (error) {
    console.error('❌ Error durante el análisis:', error.message);
    process.exit(1);
  }
}

// Ejecutar análisis
if (require.main === module) {
  analizarProyecto();
}

module.exports = { analizarProyecto };
