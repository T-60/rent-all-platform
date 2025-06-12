import { useState, useEffect, useCallback } from "react"
import { getImageUrl } from "@/lib/utils-api"

interface UltraSmartImageProps {
  imagePath?: string | null | undefined
  alt: string
  className?: string
  fallbackSrc?: string
  showLoadingIndicator?: boolean
  debugId?: string
  retryCount?: number
}

export function UltraSmartImage({ 
  imagePath, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackSrc = "/placeholder-product.svg",
  showLoadingIndicator = false,
  debugId = "unknown",
  retryCount = 2
}: UltraSmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    const safePath = getSafeImagePath(imagePath, fallbackSrc, debugId);
    return safePath === fallbackSrc ? fallbackSrc : getImageUrl(safePath);
  });
  
  const [hasErrored, setHasErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(currentSrc !== fallbackSrc);
  const [attempts, setAttempts] = useState(0);

  // Función para validar y limpiar rutas de imágenes
  const getSafeImagePath = useCallback((path: any, fallback: string, debug: string): string => {
    // Validaciones exhaustivas
    if (path === null || 
        path === undefined || 
        path === 'undefined' || 
        path === 'null' || 
        path === '' ||
        typeof path !== 'string') {
      console.log(`📷 [UltraSmartImage-${debug}] Ruta inválida, usando fallback:`, { 
        path, 
        type: typeof path,
        fallback 
      });
      return fallback;
    }

    // Limpiar espacios y caracteres extraños
    const cleanPath = path.trim();
    
    if (cleanPath.length === 0) {
      console.log(`📷 [UltraSmartImage-${debug}] Ruta vacía después de limpieza, usando fallback`);
      return fallback;
    }

    return cleanPath;
  }, []);

  // Effect para rastrear cambios en imagePath
  useEffect(() => {
    const safePath = getSafeImagePath(imagePath, fallbackSrc, debugId);
    
    if (safePath === fallbackSrc) {
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setIsLoading(false);
        setHasErrored(false);
        setAttempts(0);
      }
    } else {
      const newUrl = getImageUrl(safePath);
      if (newUrl !== currentSrc && !hasErrored) {
        console.log(`🔄 [UltraSmartImage-${debugId}] Cambiando imagen:`, {
          from: currentSrc,
          to: newUrl,
          imagePath: safePath
        });
        setCurrentSrc(newUrl);
        setIsLoading(true);
        setHasErrored(false);
        setAttempts(0);
      }
    }
  }, [imagePath, debugId, currentSrc, fallbackSrc, hasErrored, getSafeImagePath]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    
    if (!hasErrored && currentSrc !== fallbackSrc && attempts < retryCount) {
      // Intento de reintento
      console.warn(`🔄 [UltraSmartImage-${debugId}] Reintentando carga (intento ${attempts + 1}/${retryCount}):`, {
        failedSrc: currentSrc,
        attempt: attempts + 1
      });
      
      setAttempts(prev => prev + 1);
      // Pequeño delay antes del reintento
      setTimeout(() => {
        const img = new Image();
        img.onload = () => {
          console.log(`✅ [UltraSmartImage-${debugId}] Reintento exitoso`);
          setIsLoading(false);
        };
        img.onerror = () => {
          console.error(`❌ [UltraSmartImage-${debugId}] Reintento fallido, usando fallback`);
          setCurrentSrc(fallbackSrc);
          setHasErrored(true);
        };
        img.src = currentSrc;
      }, 100 * (attempts + 1)); // Delay incremental
      
    } else {
      // Usar fallback
      const errorDetails = {
        failedSrc: currentSrc,
        fallbackSrc,
        imagePath,
        alt,
        attempts,
        maxRetries: retryCount,
        timestamp: new Date().toISOString(),
        debugId,
        errorType: hasErrored ? 'fallback-error' : 'initial-error'
      };
      
      if (!hasErrored && currentSrc !== fallbackSrc) {
        console.error(`❌ [UltraSmartImage-${debugId}] Error cargando imagen, usando fallback:`, errorDetails);
        setCurrentSrc(fallbackSrc);
        setHasErrored(true);
      } else {
        console.error(`❌ [UltraSmartImage-${debugId}] Error incluso con fallback:`, errorDetails);
      }
    }
  }, [currentSrc, fallbackSrc, hasErrored, attempts, retryCount, imagePath, alt, debugId]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    const img = e.target as HTMLImageElement;
    console.log(`✅ [UltraSmartImage-${debugId}] Imagen cargada exitosamente:`, {
      src: currentSrc,
      width: img.naturalWidth,
      height: img.naturalHeight,
      imagePath,
      alt,
      debugId,
      attempts,
      timestamp: new Date().toISOString()
    });
  }, [currentSrc, imagePath, alt, debugId, attempts]);

  return (
    <div className="relative w-full h-full">
      {isLoading && showLoadingIndicator && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            {attempts > 0 && (
              <span className="text-xs text-gray-500">Reintentando... ({attempts}/{retryCount})</span>
            )}
          </div>
        </div>
      )}
      <img 
        src={currentSrc} 
        alt={alt} 
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        draggable={false}
      />
      {/* Debug indicator en desarrollo */}
      {process.env.NODE_ENV === 'development' && hasErrored && (
        <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded opacity-75">
          Error
        </div>
      )}
    </div>
  );
}
