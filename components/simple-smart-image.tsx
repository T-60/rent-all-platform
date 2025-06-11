import { useState, useEffect } from "react"
import { getImageUrl } from "@/lib/utils-api"

interface SimpleSmartImageProps {
  imagePath?: string
  alt: string
  className?: string
  fallbackSrc?: string
  showLoadingIndicator?: boolean
  debugId?: string
}

export function SimpleSmartImage({ 
  imagePath, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackSrc = "/placeholder-product.svg",
  showLoadingIndicator = false,
  debugId = "unknown"
}: SimpleSmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    if (!imagePath || imagePath === 'undefined' || imagePath === 'null') {
      console.log(`📷 [SimpleSmartImage-${debugId}] Sin ruta de imagen válida, usando fallback:`, { imagePath });
      return fallbackSrc;
    }
    
    const imageUrl = getImageUrl(imagePath);
    console.log(`🖼️ [SimpleSmartImage-${debugId}] URL inicial:`, {
      imagePath,
      imageUrl,
      fallbackSrc,
      debugId
    });
    
    return imageUrl;
  });
  
  const [hasErrored, setHasErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Effect para rastrear cambios en imagePath
  useEffect(() => {
    if (imagePath && imagePath !== 'undefined' && imagePath !== 'null') {
      const newUrl = getImageUrl(imagePath);
      if (newUrl !== currentSrc && !hasErrored) {
        console.log(`🔄 [SimpleSmartImage-${debugId}] Cambiando imagen:`, {
          from: currentSrc,
          to: newUrl,
          imagePath
        });
        setCurrentSrc(newUrl);
        setIsLoading(true);
        setHasErrored(false);
      }
    } else if (currentSrc !== fallbackSrc) {
      console.log(`🔄 [SimpleSmartImage-${debugId}] Imagen inválida, usando fallback:`, { imagePath });
      setCurrentSrc(fallbackSrc);
      setIsLoading(false);
      setHasErrored(false);
    }
  }, [imagePath, debugId, currentSrc, fallbackSrc, hasErrored]);

  return (
    <div className="relative w-full h-full">
      {isLoading && showLoadingIndicator && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img 
        src={currentSrc} 
        alt={alt} 
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={(e) => {
          setIsLoading(false);
          const errorDetails = {
            failedSrc: currentSrc,
            fallbackSrc,
            imagePath,
            alt,
            retryCount,
            timestamp: new Date().toISOString(),
            debugId,
            naturalWidth: (e.target as HTMLImageElement)?.naturalWidth || 'unknown',
            naturalHeight: (e.target as HTMLImageElement)?.naturalHeight || 'unknown',
            errorType: 'image-load-error',
            hasErrored,
            isCurrentSrcFallback: currentSrc === fallbackSrc
          };
          
          if (!hasErrored && currentSrc !== fallbackSrc) {
            console.error(`❌ [SimpleSmartImage-${debugId}] Error cargando imagen, usando fallback:`, errorDetails);
            setCurrentSrc(fallbackSrc);
            setHasErrored(true);
            setRetryCount(prev => prev + 1);
          } else {
            console.error(`❌ [SimpleSmartImage-${debugId}] Error incluso con fallback:`, {
              ...errorDetails,
              errorType: 'fallback-error',
              message: 'Even fallback image failed to load'
            });
          }
        }}
        onLoad={(e) => {
          setIsLoading(false);
          console.log(`✅ [SimpleSmartImage-${debugId}] Imagen cargada exitosamente:`, {
            src: currentSrc,
            width: (e.target as HTMLImageElement).naturalWidth,
            height: (e.target as HTMLImageElement).naturalHeight,
            imagePath,
            alt,
            debugId,
            timestamp: new Date().toISOString()
          });
        }}
      />
    </div>
  );
}
