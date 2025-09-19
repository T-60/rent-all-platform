import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SimpleSmartImage } from "./simple-smart-image"
import { HeartButton } from "./heart-button"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Product } from "@/lib/api"
import { translateCategory } from "@/lib/utils-api"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isMobile = useIsMobile()
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
      <div className={cn(
        "relative bg-gray-100",
        isMobile ? "aspect-square" : "aspect-video"
      )}>
        <SimpleSmartImage
          imagePath={firstImagePath}
          alt={product.title}
          className="w-full h-full object-cover"
          debugId={`ProductCard-${product._id}`}
        />
        {/* Heart button en esquina superior derecha */}
        <div className="absolute top-2 right-2 z-10">
          <HeartButton 
            productId={product._id} 
            size={isMobile ? "md" : "sm"} 
          />
        </div>
      </div>
      <CardContent className={cn("p-4", isMobile && "p-3")}>
        <div className="flex items-start justify-between mb-2">
          <h3 className={cn(
            "font-semibold line-clamp-1",
            isMobile ? "text-base" : "text-lg"
          )}>{product.title}</h3>
          <Badge variant="secondary" className={isMobile ? "text-xs" : ""}>
            {translateCategory(product.category)}
          </Badge>
        </div>
        <p className={cn(
          "text-gray-600 line-clamp-2 mb-3",
          isMobile ? "text-xs" : "text-sm"
        )}>{product.description}</p>
        <div className={cn(
          "flex items-center",
          isMobile ? "flex-col items-start space-y-2" : "justify-between"
        )}>
          <div>
            <span className={cn(
              "font-bold text-blue-600",
              isMobile ? "text-lg" : "text-2xl"
            )}>S/ {product.pricePerDay}</span>
            <span className="text-gray-500 ml-1">/día</span>
          </div>
          {!isMobile && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Por: {product.owner.name}</p>
              <p className="text-xs text-gray-400">{product.pickupAddress}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className={cn("p-4 pt-0", isMobile && "p-3 pt-0")}>
        <Button asChild className={cn(
          "w-full",
          isMobile ? "min-h-[44px]" : ""
        )}>
          <Link href={`/products/${product._id}`}>Ver más</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
