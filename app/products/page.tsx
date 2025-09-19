"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { ProductCard } from "@/components/product-card"
import { useProducts } from "@/contexts/products-context"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, Loader2, RefreshCw } from "lucide-react"
import { reverseTranslateCategory } from "@/lib/utils-api"

const categories = [
  { value: "Todos", label: "Todos" },
  { value: "electronics", label: "Electrónicos" },
  { value: "vehicles", label: "Vehículos" },
  { value: "tools", label: "Herramientas" },
  { value: "furniture", label: "Muebles" },
  { value: "sports", label: "Deportes" },
  { value: "others", label: "Otros" }
]

export default function ProductsPage() {
  const { 
    products, 
    loading, 
    error, 
    searchTerm, 
    selectedCategory,
    setSearchTerm, 
    setSelectedCategory,
    refreshProducts,
    clearProductsCache 
  } = useProducts()
  const { user } = useAuth()
  const [priceRange, setPriceRange] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && product.pricePerDay <= 20) ||
      (priceRange === "medium" && product.pricePerDay > 20 && product.pricePerDay <= 40) ||
      (priceRange === "high" && product.pricePerDay > 40)

    return matchesPrice
  })

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {/* Mobile header con botón de menú */}
          <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
            <h1 className="text-lg font-semibold">Productos</h1>
            <Sidebar />
          </div>
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Explorar Productos</h1>
              <p className="text-gray-600 text-sm md:text-base">Encuentra productos para alquilar de otros estudiantes</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 min-h-[44px]"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Rango de precio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los precios</SelectItem>
                    <SelectItem value="low">Hasta S/ 20</SelectItem>
                    <SelectItem value="medium">S/ 21 - S/ 40</SelectItem>
                    <SelectItem value="high">Más de S/ 40</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("Todos")
                    setPriceRange("all")
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
                <Button
                  variant="outline"
                  onClick={clearProductsCache}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshProducts}
                  className="mt-2"
                >
                  Reintentar
                </Button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Cargando productos...</span>
              </div>
            )}

            {/* Results */}
            {!loading && (
              <div className="mb-4">
                <p className="text-gray-600">
                  Mostrando {filteredProducts.length} de {products.length} productos disponibles
                </p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos que coincidan con tu búsqueda</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("Todos")
                    setPriceRange("all")
                  }}
                >
                  Ver todos los productos
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}