"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { ProductCard } from "@/components/product-card"
import { AddProductForm } from "@/components/add-product-form"
import { getAvailableProducts } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, Plus } from "lucide-react"

export default function DashboardPage() {
  const { user, userProducts } = useAuth()
  const [showAddProduct, setShowAddProduct] = useState(false)

  // Obtener productos disponibles (no alquilados por el usuario)
  const availableProducts = getAvailableProducts(user?.rentedProducts || [])

  // Combinar productos mock con productos de usuarios
  const allAvailableProducts = [
    ...availableProducts,
    ...userProducts.filter((p) => !user?.rentedProducts.includes(p.id)),
  ]
  const featuredProducts = allAvailableProducts.slice(0, 8)

  // Contar productos alquilados por el usuario
  const rentedProductsCount = user?.rentedProducts.length || 0

  if (showAddProduct) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <AddProductForm onClose={() => setShowAddProduct(false)} />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">¡Hola, {user?.name}! 👋</h1>
              <p className="text-gray-600 mt-2">
                Bienvenido a tu dashboard. Aquí puedes explorar productos disponibles para alquilar en tu universidad.
              </p>
            </div>

            {/* Add Product Section */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Plus className="h-5 w-5 mr-2" />
                  ¿Tienes algo para alquilar?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 mb-4">
                  Publica tus productos y genera ingresos extra alquilándolos a otros estudiantes de tu universidad.
                </p>
                <Button onClick={() => setShowAddProduct(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir Producto
                </Button>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productos Disponibles</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{allAvailableProducts.length}</div>
                  <p className="text-xs text-muted-foreground">Productos que puedes alquilar</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productos Alquilados</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rentedProductsCount}</div>
                  <p className="text-xs text-muted-foreground">Productos que has alquilado</p>
                </CardContent>
              </Card>
            </div>

            {/* Featured Products */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Destacados</h2>
              {featuredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
                  <p className="text-gray-600">Has alquilado todos los productos disponibles</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
