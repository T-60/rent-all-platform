"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { EditProductForm } from "@/components/edit-product-form"
import { useAuth } from "@/contexts/auth-context"
import { mockProducts, type Product } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, GraduationCap, Package, Calendar, Clock, MapPin, Eye, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
  const { user, userProducts, deleteProduct } = useAuth()
  const { toast } = useToast()
  const [selectedRental, setSelectedRental] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Combinar productos mock con productos de usuarios para el historial
  const allProducts = [...mockProducts, ...userProducts]
  const rentedProducts = allProducts.filter((product) => user?.rentedProducts.includes(product.id))

  // Productos propios del usuario
  const ownedProducts = userProducts.filter((product) => product.ownerId === user?.id)

  const selectedRentalDetails = selectedRental ? user?.rentalHistory.find((r) => r.id === selectedRental) : null

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${productName}"?`)) {
      deleteProduct(productId)
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente.",
      })
    }
  }

  if (editingProduct) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <EditProductForm product={editingProduct} onClose={() => setEditingProduct(null)} />
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
                        <span className="text-sm">{user?.rentedProducts.length || 0} productos alquilados</span>
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
                        {rentedProducts.length === 0 ? (
                          <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No has alquilado productos aún</h3>
                            <p className="text-gray-600">
                              Explora nuestro catálogo y encuentra el producto perfecto para ti
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {rentedProducts.map((product) => {
                              const rentalDetail = user?.rentalHistory.find((r) => r.productId === product.id)
                              return (
                                <div
                                  key={product.id}
                                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                                >
                                  <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                    <Image
                                      src={product.image || "/placeholder.svg"}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{product.name}</h4>
                                    <p className="text-sm text-gray-600">Por: {product.owner}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant="secondary">{product.category}</Badge>
                                      <span className="text-sm text-gray-500">S/ {product.price}/hora</span>
                                      {rentalDetail && (
                                        <span className="text-sm text-blue-600">
                                          {rentalDetail.hours} {rentalDetail.hours === 1 ? "hora" : "horas"} - Total: S/{" "}
                                          {rentalDetail.totalPrice}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right space-y-2">
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                      Alquilado
                                    </Badge>
                                    {rentalDetail && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setSelectedRental(selectedRental === rentalDetail.id ? null : rentalDetail.id)
                                        }
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        {selectedRental === rentalDetail.id ? "Ocultar" : "Ver"} Detalles
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
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
                        {ownedProducts.length === 0 ? (
                          <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No has publicado productos aún</h3>
                            <p className="text-gray-600">Ve al Dashboard y añade tu primer producto para alquilar</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {ownedProducts.map((product) => (
                              <div
                                key={product.id}
                                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                              >
                                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{product.name}</h4>
                                  <p className="text-sm text-gray-600">{product.description}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="secondary">{product.category}</Badge>
                                    <span className="text-sm text-gray-500">S/ {product.price}/hora</span>
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
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
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
                          <p className="text-sm">{selectedRentalDetails.productName}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Duración:</h4>
                          <p className="text-sm">
                            {selectedRentalDetails.hours} {selectedRentalDetails.hours === 1 ? "hora" : "horas"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Fecha de Recogida:</h4>
                          <p className="text-sm">{selectedRentalDetails.pickupDate}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Hora de Recogida:</h4>
                          <p className="text-sm">{selectedRentalDetails.pickupTime}</p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Lugar de Recogida:</h4>
                          <p className="text-sm flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedRentalDetails.pickupAddress}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Lugar de Devolución:</h4>
                          <p className="text-sm flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {selectedRentalDetails.returnAddress}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Total Pagado:</h4>
                          <p className="text-lg font-bold text-green-600">S/ {selectedRentalDetails.totalPrice}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-1">Estado:</h4>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {selectedRentalDetails.status === "active" ? "Activo" : "Completado"}
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Recordatorio:</strong> El pago se realizó en efectivo al momento de la recogida.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
