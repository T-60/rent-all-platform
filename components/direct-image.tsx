import { getImageUrl } from "@/lib/utils-api"

interface DirectImageProps {
  imagePath?: string
  alt: string
  className?: string
  fallbackSrc?: string
}

export function DirectImage({ 
  imagePath, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackSrc = "/placeholder-product.svg"
}: DirectImageProps) {
  const imageUrl = imagePath ? getImageUrl(imagePath) : fallbackSrc;
  
  console.log('🖼️ [DirectImage] Rendering:', {
    imagePath,
    imageUrl,
    fallbackSrc,
    timestamp: new Date().toISOString()
  });

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
      onError={(e) => {
        console.error('❌ [DirectImage] Error, usando fallback:', {
          originalSrc: imageUrl,
          fallbackSrc,
          error: e.type
        });
        (e.target as HTMLImageElement).src = fallbackSrc;
      }}
      onLoad={(e) => {
        console.log('✅ [DirectImage] Imagen cargada exitosamente:', {
          finalSrc: imageUrl,
          naturalWidth: (e.target as HTMLImageElement).naturalWidth,
          naturalHeight: (e.target as HTMLImageElement).naturalHeight
        });
      }}
    />
  );
}
