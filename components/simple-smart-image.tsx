import { useState } from "react"
import { getImageUrl } from "@/lib/utils-api"

interface SimpleSmartImageProps {
  imagePath?: string
  alt: string
  className?: string
  fallbackSrc?: string
  showLoadingIndicator?: boolean
}

export function SimpleSmartImage({ 
  imagePath, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackSrc = "/placeholder-product.svg",
  showLoadingIndicator = false
}: SimpleSmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    if (!imagePath) {
      console.log('📷 [SimpleSmartImage] Sin ruta de imagen, usando fallback');
      return fallbackSrc;
    }
    
    const imageUrl = getImageUrl(imagePath);
    console.log('🖼️ [SimpleSmartImage] URL inicial:', {
      imagePath,
      imageUrl,
      fallbackSrc
    });
    
    return imageUrl;
  });
  
  const [hasErrored, setHasErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          if (!hasErrored && currentSrc !== fallbackSrc) {
            console.error('❌ [SimpleSmartImage] Error cargando imagen, usando fallback:', {
              failedSrc: currentSrc,
              fallbackSrc,
              imagePath
            });
            setCurrentSrc(fallbackSrc);
            setHasErrored(true);
          } else {
            console.error('❌ [SimpleSmartImage] Error incluso con fallback:', fallbackSrc);
          }
        }}
        onLoad={(e) => {
          setIsLoading(false);
          console.log('✅ [SimpleSmartImage] Imagen cargada exitosamente:', {
            src: currentSrc,
            width: (e.target as HTMLImageElement).naturalWidth,
            height: (e.target as HTMLImageElement).naturalHeight,
            imagePath
          });
        }}
      />
    </div>
  );
}
