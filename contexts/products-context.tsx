"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiService, type Product as ApiProduct } from "@/lib/api"

interface ProductsContextType {
  products: ApiProduct[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  searchTerm: string
  selectedCategory: string
  refreshProducts: () => Promise<void>
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  setCurrentPage: (page: number) => void
  searchProducts: (params?: {
    search?: string
    category?: string
    page?: number
    limit?: number
  }) => Promise<void>
  removeProductFromList: (productId: string) => void
  addProductToList: (product: ApiProduct) => void
  updateProductInList: (product: ApiProduct) => void
  clearProductsCache: () => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const searchProducts = async (params?: {
    search?: string
    category?: string
    page?: number
    limit?: number
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.getProducts({
        search: params?.search || searchTerm,
        category: params?.category || selectedCategory,
        page: params?.page || currentPage,
        limit: params?.limit || 12,
      })
      
      setProducts(response.products)
      setCurrentPage(response.pagination.currentPage)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar productos")
      console.error("Error al cargar productos:", err)
    } finally {
      setLoading(false)
    }
  }

  const refreshProducts = async () => {
    await searchProducts()
  }

  const removeProductFromList = (productId: string) => {
    setProducts(prev => prev.filter(p => p._id !== productId))
  }

  const addProductToList = (product: ApiProduct) => {
    setProducts(prev => [product, ...prev])
  }

  const updateProductInList = (updatedProduct: ApiProduct) => {
    setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p))
  }

  const clearProductsCache = () => {
    console.log('🧹 Limpiando caché de productos...');
    setProducts([]);
    setCurrentPage(1);
    setTotalPages(1);
    setSearchTerm("");
    setSelectedCategory("");
    setError(null);
    // Forzar una nueva carga desde el servidor
    setTimeout(() => {
      searchProducts();
    }, 100);
  }

  // Cargar productos iniciales
  useEffect(() => {
    searchProducts()
  }, [])

  // Actualizar productos cuando cambien los filtros
  useEffect(() => {
    if (searchTerm !== "" || selectedCategory !== "") {
      const timer = setTimeout(() => {
        searchProducts()
      }, 500) // Debounce para evitar muchas peticiones
      
      return () => clearTimeout(timer)
    }
  }, [searchTerm, selectedCategory])

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        currentPage,
        totalPages,
        searchTerm,
        selectedCategory,
        refreshProducts,
        setSearchTerm,
        setSelectedCategory,
        setCurrentPage,
        searchProducts,
        removeProductFromList,
        addProductToList,
        updateProductInList,
        clearProductsCache,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
