// Utilidades para mapear categorías y datos de la API
export const categoryTranslations = {
  'electronics': 'Electrónicos',
  'vehicles': 'Vehículos',
  'tools': 'Herramientas',
  'furniture': 'Muebles',
  'sports': 'Deportes',
  'others': 'Otros'
} as const;

export const reverseTranslations = {
  'Electrónicos': 'electronics',
  'Vehículos': 'vehicles',
  'Herramientas': 'tools',
  'Muebles': 'furniture',
  'Deportes': 'sports',
  'Otros': 'others'
} as const;

export function translateCategory(category: string): string {
  return categoryTranslations[category as keyof typeof categoryTranslations] || category;
}

export function reverseTranslateCategory(category: string): string {
  return reverseTranslations[category as keyof typeof reverseTranslations] || category;
}

// Función para detectar la IP local automáticamente (compartida)
function getLocalIP(): string {
  // En el navegador, usar la IP actual del host
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  // Fallback para server-side
  return 'localhost';
}

export function getImageUrl(imagePath: string): string {
  // Validaciones más estrictas
  if (!imagePath || 
      imagePath === 'undefined' || 
      imagePath === 'null' || 
      imagePath === '' ||
      typeof imagePath !== 'string') {
    console.warn('⚠️ Ruta de imagen inválida, usando placeholder:', { imagePath, type: typeof imagePath });
    return '/placeholder-product.svg';
  }
  
  if (imagePath.startsWith('http')) {
    console.log('🌐 URL absoluta detectada:', imagePath);
    return imagePath;
  }
  
  // Configuración adaptativa de backend URL (sin /api para imágenes estáticas)
  const getBackendUrl = (): string => {
    const hostname = getLocalIP();
    
    // Si estamos en localhost, usar localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    
    // Para cualquier otra IP (red universitaria, hotspot, etc.)
    return `http://${hostname}:3001`;
  };

  const backendUrl = getBackendUrl();
  console.log('🖼️ Backend URL detectada automáticamente:', {
    hostname: getLocalIP(),
    backendUrl
  });
  
  // Asegurar que la ruta empiece con /
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const fullUrl = `${backendUrl}${cleanPath}`;
  
  // Validar que la ruta parece ser una imagen
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.PNG', '.JPG', '.JPEG'];
  const hasImageExtension = imageExtensions.some(ext => 
    cleanPath.toLowerCase().includes(ext.toLowerCase())
  );
  
  if (!hasImageExtension) {
    console.warn('⚠️ La ruta no parece ser una imagen válida, usando placeholder:', {
      imagePath,
      cleanPath,
      fullUrl
    });
    return '/placeholder-product.svg';
  }
  
  console.log('🖼️ Construyendo URL de imagen:', { 
    imagePath, 
    cleanPath,
    backendUrl,
    fullUrl,
    hasImageExtension,
    hostname: getLocalIP(),
    timestamp: new Date().toISOString()
  });
  
  return fullUrl;
}

// Función para verificar si una imagen existe
export async function verifyImageExists(imageUrl: string): Promise<boolean> {
  try {
    console.log('🔍 Verificando existencia de imagen:', imageUrl);
    
    const response = await fetch(imageUrl, { 
      method: 'HEAD',
      mode: 'cors'
    });
    
    const exists = response.ok;
    console.log(exists ? '✅ Imagen existe' : '❌ Imagen no existe', imageUrl, response.status);
    
    return exists;
  } catch (error) {
    console.error('❌ Error verificando imagen:', error);
    return false;
  }
}
