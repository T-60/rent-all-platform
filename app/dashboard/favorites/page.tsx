"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { ProductCard } from "@/components/product-card"
import { useWishlist } from "@/contexts/WishlistContext"
import { useAuth } from "@/contexts/auth-context"
import { apiService, type Product } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"

export default function FavoritesPage() {
  const { favoriteProducts, isLoading: wishlistLoading } = useWishlist()
  const { isAuthenticated } = useAuth()
  const [favoriteProductsData, setFavoriteProductsData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Marcar como montado para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (!mounted || !isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log('🔄 Cargando favoritos desde la página...')
        const response = await apiService.getFavorites(1, 50)
        console.log('🔥 Response from getFavorites:', response)
        setFavoriteProductsData(response.data.products || [])
      } catch (error) {
        console.error('❌ Error al cargar favoritos:', error)
        setFavoriteProductsData([])
      } finally {
        setLoading(false)
      }
    }

    if (mounted && isAuthenticated) {
      fetchFavoriteProducts()
    } else if (mounted) {
      setLoading(false)
    }
  }, [mounted, isAuthenticated, favoriteProducts])

  // Evitar problemas de hidratación
  if (!mounted) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Cargando...</p>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!isAuthenticated) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <div className="text-center py-12">
                <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                  Inicia sesión para ver tus favoritos
                </h2>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                Mis Favoritos
                {favoriteProductsData.length > 0 && (
                  <span className="text-lg text-gray-500">({favoriteProductsData.length})</span>
                )}
              </h1>
              <p className="text-gray-600 mt-2">
                Aquí tienes todos los productos que has marcado como favoritos
              </p>
            </div>

            {loading || wishlistLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Cargando favoritos...</span>
              </div>
            ) : favoriteProductsData.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent className="pt-6">
                  <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                  <CardTitle className="text-xl text-gray-600 mb-2">
                    No tienes productos favoritos aún
                  </CardTitle>
                  <p className="text-gray-500 mb-6">
                    Explora los productos disponibles y marca algunos como favoritos usando el corazón ❤️
                  </p>
                  <Button asChild>
                    <a href="/dashboard">Explorar Productos</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoriteProductsData.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
