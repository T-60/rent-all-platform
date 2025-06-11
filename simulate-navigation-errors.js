// Script para replicar errores de SimpleSmartImage en navegación
console.log('🧪 REPLICANDO ERRORES DE NAVEGACIÓN - SimpleSmartImage');
console.log('=======================================================');

// Simular el comportamiento del componente SimpleSmartImage
function simulateImageLoad(imagePath, componentName = 'SimpleSmartImage') {
  console.log(`\n🖼️ [${componentName}] Simulando carga de imagen:`, imagePath);
  
  if (!imagePath) {
    console.log(`📷 [${componentName}] Sin ruta de imagen, usando fallback`);
    return '/placeholder-product.svg';
  }
  
  // Simular getImageUrl
  const apiUrl = 'http://localhost:3001/api';
  const backendUrl = apiUrl.replace('/api', '');
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const fullUrl = `${backendUrl}${cleanPath}`;
  
  console.log(`🖼️ [${componentName}] URL construida:`, {
    imagePath,
    cleanPath,
    backendUrl,
    fullUrl
  });
  
  // Simular verificación de imagen
  const http = require('http');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: cleanPath,
      method: 'HEAD',
      timeout: 3000
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ [${componentName}] Imagen cargada exitosamente:`, fullUrl);
        resolve({ success: true, url: fullUrl });
      } else {
        console.error(`❌ [${componentName}] Error cargando imagen, usando fallback:`, {
          failedSrc: fullUrl,
          statusCode: res.statusCode,
          fallbackSrc: '/placeholder-product.svg'
        });
        resolve({ success: false, url: '/placeholder-product.svg', error: `HTTP ${res.statusCode}` });
      }
    });
    
    req.on('error', (err) => {
      console.error(`❌ [${componentName}] Error cargando imagen, usando fallback:`, {
        failedSrc: fullUrl,
        error: err.message,
        fallbackSrc: '/placeholder-product.svg'
      });
      resolve({ success: false, url: '/placeholder-product.svg', error: err.message });
    });
    
    req.on('timeout', () => {
      console.error(`❌ [${componentName}] Error cargando imagen, usando fallback:`, {
        failedSrc: fullUrl,
        error: 'Timeout',
        fallbackSrc: '/placeholder-product.svg'
      });
      req.destroy();
      resolve({ success: false, url: '/placeholder-product.svg', error: 'Timeout' });
    });
    
    req.end();
  });
}

// Función para obtener productos
async function getProducts() {
  return new Promise((resolve, reject) => {
    const http = require('http');
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/products',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response.products || []);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Simular navegación entre páginas
async function simulateNavigation() {
  console.log('\n1️⃣ Simulando carga inicial de productos...');
  
  try {
    const products = await getProducts();
    console.log(`📦 Productos obtenidos: ${products.length}`);
    
    // Simular ProductCard para cada producto
    const imagePromises = [];
    
    for (let i = 0; i < Math.min(products.length, 5); i++) {
      const product = products[i];
      const firstImagePath = product.images && product.images.length > 0 
        ? product.images[0] 
        : undefined;
      
      console.log(`\n📱 [ProductCard] ${product.title}:`, {
        hasImages: product.images?.length > 0,
        firstImagePath,
        totalImages: product.images?.length || 0
      });
      
      // Simular SimpleSmartImage de cada ProductCard
      imagePromises.push(
        simulateImageLoad(firstImagePath, `ProductCard-${i + 1}`)
      );
    }
    
    console.log('\n2️⃣ Esperando carga de todas las imágenes...');
    const results = await Promise.all(imagePromises);
    
    console.log('\n📊 RESUMEN DE CARGA DE IMÁGENES:');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Exitosas: ${successful}`);
    console.log(`❌ Fallidas: ${failed}`);
    
    if (failed > 0) {
      console.log('\n🚨 IMÁGENES CON PROBLEMAS:');
      results.forEach((result, idx) => {
        if (!result.success) {
          console.log(`   ${idx + 1}. Error: ${result.error} → ${result.url}`);
        }
      });
    }
    
    // Simular problemas específicos que pueden causar el error
    console.log('\n3️⃣ Simulando casos problemáticos...');
    
    // Caso 1: Imagen inexistente
    await simulateImageLoad('/uploads/products/imagen-inexistente.png', 'Caso-Inexistente');
    
    // Caso 2: Ruta malformada
    await simulateImageLoad('uploads/products/sin-slash-inicial.png', 'Caso-SinSlash');
    
    // Caso 3: Ruta vacía
    await simulateImageLoad('', 'Caso-Vacio');
    
    // Caso 4: Ruta null/undefined
    await simulateImageLoad(null, 'Caso-Null');
    await simulateImageLoad(undefined, 'Caso-Undefined');
    
  } catch (error) {
    console.error('❌ Error en simulación:', error.message);
  }
}

// Ejecutar simulación
simulateNavigation();
