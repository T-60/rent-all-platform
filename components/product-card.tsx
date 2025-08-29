import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SimpleSmartImage } from "./simple-smart-image"
import { HeartButton } from "./heart-button"
import type { Product } from "@/lib/api"
import { translateCategory } from "@/lib/utils-api"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImagePath = product.images && product.images.length > 0 
    ? product.images[0] 
    : undefined;
  
  console.log(`🖼️ [ProductCard-Improved] ${product.title}:`, {
    hasImages: product.images?.length > 0,
    firstImagePath,
    totalImages: product.images?.length || 0
  });
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative bg-gray-100">
        <SimpleSmartImage
          imagePath={firstImagePath}
          alt={product.title}
          className="w-full h-full object-cover"
          debugId={`ProductCard-${product._id}`}
        />
        {/* Heart button en esquina superior derecha */}
        <div className="absolute top-2 right-2 z-10">
          <HeartButton productId={product._id} size="sm" />
        </div>
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
