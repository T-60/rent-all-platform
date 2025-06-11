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
  
  // URL del backend (sin /api para imágenes estáticas)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const backendUrl = apiUrl.replace('/api', ''); // Remover /api para imágenes estáticas
  
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
    apiUrl,
    backendUrl,
    fullUrl,
    hasImageExtension,
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
