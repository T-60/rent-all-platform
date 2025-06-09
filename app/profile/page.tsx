"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { EditProductForm } from "@/components/edit-product-form"
import { useAuth } from "@/contexts/auth-context"
import { useProducts } from "@/contexts/products-context"
import { apiService, type Product, type Rental } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, GraduationCap, Package, Calendar, Clock, MapPin, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import { SimpleSmartImage } from "@/components/simple-smart-image"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { removeProductFromList, refreshProducts } = useProducts()
  const [selectedRental, setSelectedRental] = useState<string | null>(null)
  const [ownedProducts, setOwnedProducts] = useState<Product[]>([])
  const [userRentals, setUserRentals] = useState<Rental[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isLoadingRentals, setIsLoadingRentals] = useState(true)

  // Fetch user's owned products
  useEffect(() => {
    const fetchOwnedProducts = async () => {
      if (!user) return
      
      try {
        setIsLoadingProducts(true)
        const response = await apiService.getProducts()
        // Filter products owned by current user
        const userProducts = response.products.filter((product: Product) => product.owner._id === user.id)
        setOwnedProducts(userProducts)
      } catch (error) {
        console.error('Error fetching owned products:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar tus productos",
          variant: "destructive"
        })
      } finally {
        setIsLoadingProducts(false)
      }
    }

    fetchOwnedProducts()
  }, [user, toast])

  // Fetch user's rentals
  useEffect(() => {
    const fetchUserRentals = async () => {
      if (!user) return
      
      try {
        setIsLoadingRentals(true)
        const rentals = await apiService.getUserRentals(user.id)
        setUserRentals(rentals)
      } catch (error) {
        console.error('Error fetching user rentals:', error)
        toast({
          title: "Error",
          description: "No se pudo cargar tu historial de alquileres",
          variant: "destructive"
        })
      } finally {
        setIsLoadingRentals(false)
      }
    }

    fetchUserRentals()
  }, [user, toast])

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${productName}"?`)) {
      return
    }

    try {
      await apiService.deleteProduct(productId)
      // Actualizar lista local del perfil
      setOwnedProducts(prev => prev.filter(p => p._id !== productId))
      // Actualizar lista global de productos
      removeProductFromList(productId)
      toast({
        title: "Producto eliminado",
        description: `"${productName}" ha sido eliminado exitosamente`
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive"
      })
    }
  }

  const handleUpdateProduct = () => {
    // Refresh the products list after update
    const fetchOwnedProducts = async () => {
      if (!user) return
      
      try {
        const response = await apiService.getProducts()
        const userProducts = response.products.filter((product: Product) => product.owner._id === user.id)
        setOwnedProducts(userProducts)
      } catch (error) {
        console.error('Error fetching owned products:', error)
      }
    }

    fetchOwnedProducts()
    setEditingProduct(null)
  }

  const selectedRentalDetails = selectedRental ? userRentals.find((r) => r._id === selectedRental) : null

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
              <p className="text-gray-600">Gestiona tu información personal y revisa tu historial de alquileres</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Info */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Información Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="text-center">
                      <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <User className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold">{user?.name}</h3>
                    </div>

                    <Separator />

                    {/* Details */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm">{user?.email}</span>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm">{user?.university}</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm">{userRentals.length} productos alquilados</span>
                      </div>
                      <div className="flex items-center">
                        <Package className="h-4 w-4 text-blue-400 mr-3" />
                        <span className="text-sm">{ownedProducts.length} productos publicados</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                        <span className="text-sm">Miembro desde 2024</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for Rental History and Owned Products */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="rentals" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="rentals">Productos Alquilados</TabsTrigger>
                    <TabsTrigger value="owned">Mis Productos</TabsTrigger>
                  </TabsList>

                  {/* Rental History Tab */}
                  <TabsContent value="rentals">
                    <Card>
                      <CardHeader>
                        <CardTitle>Historial de Alquileres</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoadingRentals ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                          </div>
                        ) : userRentals.length === 0 ? (
                          <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No has alquilado productos aún</h3>
                            <p className="text-gray-600">
                              Explora nuestro catálogo y encuentra el producto perfecto para ti
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {userRentals.map((rental) => (
                              <div
                                key={rental._id}
                                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                              >
                                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                  <SimpleSmartImage
                                    imagePath={rental.product.images?.[0]}
                                    alt={rental.product.title}
                                    className="w-full h-full object-cover"
                                    showLoadingIndicator={true}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{rental.product.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    Por: {rental.product.owner?.name || 'Usuario desconocido'}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="secondary">{rental.product.category}</Badge>
                                    <span className="text-sm text-gray-500">S/ {rental.product.pricePerDay}/día</span>
                                    <span className="text-sm text-blue-600">
                                      {rental.days} {rental.days === 1 ? "día" : "días"} - Total: S/ {rental.totalAmount}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right space-y-2">
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      rental.status === 'active' 
                                        ? "text-green-600 border-green-600"
                                        : rental.status === 'completed'
                                        ? "text-blue-600 border-blue-600"
                                        : "text-gray-600 border-gray-600"
                                    }
                                  >
                                    {rental.status === 'active' ? 'Activo' : 
                                     rental.status === 'completed' ? 'Completado' : 
                                     rental.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setSelectedRental(selectedRental === rental._id ? null : rental._id)
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    {selectedRental === rental._id ? "Ocultar" : "Ver"} Detalles
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Owned Products Tab */}
                  <TabsContent value="owned">
                    <Card>
                      <CardHeader>
                        <CardTitle>Productos que he Publicado</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoadingProducts ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                          </div>
                        ) : ownedProducts.length === 0 ? (
                          <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No has publicado productos aún</h3>
                            <p className="text-gray-600">Ve al Dashboard y añade tu primer producto para alquilar</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {ownedProducts.map((product) => (
                              <div
                                key={product._id}
                                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                              >
                                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                  <SimpleSmartImage
                                    imagePath={product.images?.[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                    showLoadingIndicator={true}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{product.title}</h4>
                                  <p className="text-sm text-gray-600">{product.description}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="secondary">{product.category}</Badge>
                                    <span className="text-sm text-gray-500">S/ {product.pricePerDay}/día</span>
                                    <Badge
                                      variant={product.available ? "default" : "secondary"}
                                      className={
                                        product.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {product.available ? "Disponible" : "No disponible"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteProduct(product._id, product.title)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Eliminar
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Rental Details Modal */}
                {selectedRentalDetails && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Detalles del Alquiler
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Producto:</h4>
                          <p className="text-sm">{selectedRentalDetails.product.title}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Duración:</h4>
                          <p className="text-sm">
                            {selectedRentalDetails.days} {selectedRentalDetails.days === 1 ? "día" : "días"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Fecha de Inicio:</h4>
                          <p className="text-sm">{new Date(selectedRentalDetails.startDate).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Fecha de Fin:</h4>
                          <p className="text-sm">{new Date(selectedRentalDetails.endDate).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Ubicación de Recogida:</h4>
                          <p className="text-sm flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedRentalDetails.product.pickupAddress}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Total Pagado:</h4>
                          <p className="text-lg font-bold text-green-600">S/ {selectedRentalDetails.totalAmount}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Estado:</h4>
                          <Badge 
                            variant="outline" 
                            className={
                              selectedRentalDetails.status === 'active' 
                                ? "text-green-600 border-green-600"
                                : selectedRentalDetails.status === 'completed'
                                ? "text-blue-600 border-blue-600"
                                : "text-gray-600 border-gray-600"
                            }
                          >
                            {selectedRentalDetails.status === 'active' ? 'Activo' : 
                             selectedRentalDetails.status === 'completed' ? 'Completado' : 
                             selectedRentalDetails.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Recordatorio:</strong> Contacta al propietario para coordinar la entrega y devolución del producto.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Edit Product Modal */}
                {editingProduct && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                      <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Editar Producto</h2>
                        <EditProductForm
                          product={editingProduct}
                          onClose={handleUpdateProduct}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
