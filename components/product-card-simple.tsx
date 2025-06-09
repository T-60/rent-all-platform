import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/api"
import { translateCategory, getImageUrl } from "@/lib/utils-api"

interface ProductCardProps {
  product: Product
}

export function ProductCardSimple({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("/placeholder-product.svg");
  
  useEffect(() => {
    if (product.images && product.images.length > 0) {
      const imageUrl = getImageUrl(product.images[0]);
      console.log('🖼️ Intentando cargar imagen:', imageUrl);
      
      // Probar la imagen antes de usarla
      const testImg = new window.Image();
      testImg.crossOrigin = "anonymous";
      
      testImg.onload = () => {
        console.log('✅ Imagen verificada exitosamente:', imageUrl);
        setImageSrc(imageUrl);
        setImageError(false);
        setImageLoaded(true);
      };
      
      testImg.onerror = (error) => {
        console.error('❌ Error verificando imagen:', imageUrl, error);
        setImageSrc("/placeholder-product.svg");
        setImageError(true);
        setImageLoaded(true);
      };
      
      testImg.src = imageUrl;
    } else {
      console.log('📷 Producto sin imágenes');
      setImageLoaded(true);
    }
  }, [product.images]);
  
  console.log(`🖼️ [ProductCardSimple] ${product.title}:`, {
    hasImages: product.images?.length > 0,
    originalPath: product.images?.[0],
    imageSrc,
    imageError,
    imageLoaded
  });
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative bg-gray-100">
        {imageLoaded ? (
          <img 
            src={imageSrc} 
            alt={product.title} 
            className="w-full h-full object-cover"
            onError={() => {
              console.error('❌ Error en img element, cambiando a placeholder');
              setImageSrc("/placeholder-product.svg");
              setImageError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse text-gray-400">Verificando imagen...</div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
          <Badge variant="secondary">{translateCategory(product.category)}</Badge>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">S/ {product.pricePerDay}</span>
            <span className="text-gray-500 ml-1">/día</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Por: {product.owner.name}</p>
            <p className="text-xs text-gray-400">{product.pickupAddress}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${product._id}`}>Ver más</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
