import { useState, useEffect } from "react"
import { getImageUrl, verifyImageExists } from "@/lib/utils-api"

interface SmartImageProps {
  imagePath?: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export function SmartImage({ 
  imagePath, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackSrc = "/placeholder-product.svg"
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadImage() {
      if (!imagePath) {
        console.log('📷 [SmartImage] Sin ruta de imagen, usando fallback');
        setCurrentSrc(fallbackSrc);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const imageUrl = getImageUrl(imagePath);
        console.log('🔄 [SmartImage] Intentando cargar imagen:', {
          imagePath,
          imageUrl,
          fallbackSrc
        });

        // Verificar si la imagen existe
        const exists = await verifyImageExists(imageUrl);
        
        if (exists) {
          console.log('✅ [SmartImage] Imagen verificada exitosamente, estableciendo src:', imageUrl);
          setCurrentSrc(imageUrl);
        } else {
          console.log('❌ [SmartImage] Imagen no existe, usando fallback:', fallbackSrc);
          setCurrentSrc(fallbackSrc);
          setError('Imagen no encontrada');
        }
      } catch (err) {
        console.error('❌ [SmartImage] Error cargando imagen:', err);
        setCurrentSrc(fallbackSrc);
        setError('Error de conectividad');
      } finally {
        setIsLoading(false);
      }
    }

    loadImage();
  }, [imagePath, fallbackSrc]);

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">Cargando imagen...</div>
      </div>
    );
  }

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className}
      onError={(e) => {
        console.error('❌ [SmartImage] Error en elemento img, cambiando a fallback:', {
          currentSrc,
          fallbackSrc,
          error: e
        });
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          setError('Error de carga');
        }
      }}
      onLoad={(e) => {
        console.log('✅ [SmartImage] Imagen cargada exitosamente en elemento img:', {
          currentSrc,
          imagePath,
          width: (e.target as HTMLImageElement).naturalWidth,
          height: (e.target as HTMLImageElement).naturalHeight
        });
      }}
    />
  );
}
