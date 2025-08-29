'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, Product } from '@/lib/api';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

interface WishlistContextType {
  favoriteProducts: string[];
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  refreshWishlist: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Marcar como montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar favoritos cuando el usuario se autentica
  useEffect(() => {
    console.log('🔄 WishlistContext - Estado actual:', { 
      isAuthenticated, 
      user: !!user, 
      mounted,
      favoriteProductsCount: favoriteProducts.length 
    });
    
    if (mounted && isAuthenticated && user) {
      console.log('✅ Condiciones cumplidas, cargando favoritos...');
      refreshWishlist();
    } else if (mounted && !isAuthenticated) {
      // Limpiar favoritos si no está autenticado
      console.log('🧹 Usuario no autenticado, limpiando favoritos...');
      setFavoriteProducts([]);
    }
  }, [isAuthenticated, user, mounted]);

  // Función para refrescar la lista de favoritos
  const refreshWishlist = async () => {
    if (!isAuthenticated || !mounted) return;

    try {
      setIsLoading(true);
      console.log('🔄 Refrescando wishlist...');
      const response = await apiService.getFavorites(1, 100); // Traer todos los favoritos
      console.log('📦 Favoritos recibidos:', response);
      
      // ✅ CORRECCIÓN: Extraer solo los IDs de los productos para consistencia
      const productIds = response.data.products?.map((product: Product) => product._id) || [];
      console.log('🆔 IDs extraídos:', productIds);
      setFavoriteProducts(productIds);
    } catch (error) {
      console.error('❌ Error al cargar favoritos:', error);
      // No mostrar toast de error para esta operación silenciosa
      setFavoriteProducts([]); // Resetear en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar a favoritos
  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar favoritos');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔥 Intentando agregar a favoritos:', productId);
      const response = await apiService.addToFavorites(productId);
      console.log('🔥 Respuesta del servidor:', response);
      
      // ✅ CORRECCIÓN: response.favoriteProducts ya es un array de IDs
      setFavoriteProducts(response.favoriteProducts);
      toast.success('Agregado a favoritos ❤️');
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al agregar a favoritos';
      
      // Verificación del error de productos propios
      const isOwnProductError = errorMessage.includes('No puedes agregar tus propios productos') || 
                               errorMessage.includes('propios productos a favoritos') ||
                               errorMessage.includes('productos que deseas alquilar de otros usuarios');
      
      if (isOwnProductError) {
        // Mostrar mensaje informativo amigable
        toast.dismiss(); 
        
        setTimeout(() => {
          toast('Los favoritos son para productos de otros usuarios', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '12px',
              padding: '16px 20px',
              fontSize: '15px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              border: 'none',
              textAlign: 'center',
              minWidth: '300px',
            },
            icon: 'ℹ️',
          });
        }, 100);
        
        return;
      } else {
        console.error('❌ Error al agregar a favoritos:', error);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Quitar de favoritos
  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      console.log('🗑️ Intentando quitar de favoritos:', productId);
      const response = await apiService.removeFromFavorites(productId);
      console.log('🗑️ Respuesta del servidor:', response);
      
      // ✅ CORRECCIÓN: response.favoriteProducts ya es un array de IDs
      setFavoriteProducts(response.favoriteProducts);
      toast.success('Quitado de favoritos');
    } catch (error) {
      console.error('❌ Error al quitar de favoritos:', error);
      toast.error('Error al quitar de favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si un producto es favorito
  const isFavorite = (productId: string): boolean => {
    return favoriteProducts ? favoriteProducts.includes(productId) : false;
  };

  // Toggle favorito (agregar o quitar)
  const toggleFavorite = async (productId: string) => {
    if (isFavorite(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const value: WishlistContextType = {
    favoriteProducts,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isFavorite,
    refreshWishlist,
    toggleFavorite,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist debe usarse dentro de un WishlistProvider');
  }
  return context;
}
