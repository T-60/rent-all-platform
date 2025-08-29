'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';

interface HeartButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function HeartButton({ productId, size = 'md', className }: HeartButtonProps) {
  const { isFavorite, toggleFavorite, isLoading } = useWishlist();
  const isInWishlist = isFavorite(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar navegación si está dentro de un Link
    e.stopPropagation(); // Evitar propagación del evento
    await toggleFavorite(productId);
  };

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        sizeClasses[size],
        'transition-all duration-200 hover:scale-110 rounded-full',
        isInWishlist 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50',
        className
      )}
      title={isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isInWishlist ? 'fill-current' : ''
        )}
      />
    </Button>
  );
}
