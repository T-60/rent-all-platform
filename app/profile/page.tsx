"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { EditProductForm } from "@/components/edit-product-form"
import { useFloatingChat } from "@/components/floating-chat-manager"
import { ScheduleDeliveryModal } from "@/components/schedule-delivery-modal"
import { PaymentCheckout } from "@/components/payment-checkout"
import { useAuth } from "@/contexts/auth-context"
import { useProducts } from "@/contexts/products-context"
import { useChat } from "@/contexts/chat-context"
import { apiService, type Product, type Rental } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, GraduationCap, Package, Calendar, Clock, MapPin, Eye, Edit, Trash2, Loader2, MessageCircle } from "lucide-react"
import { SimpleSmartImage } from "@/components/simple-smart-image"

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { removeProductFromList, refreshProducts } = useProducts()
  const { unreadCount } = useChat()
  const { openChat } = useFloatingChat()
  const [selectedRental, setSelectedRental] = useState<string | null>(null)
  const [ownedProducts, setOwnedProducts] = useState<Product[]>([])
  const [userRentals, setUserRentals] = useState<Rental[]>([])
  const [ownerRentals, setOwnerRentals] = useState<any[]>([])  // Solicitudes como propietario
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isLoadingRentals, setIsLoadingRentals] = useState(true)
  const [isLoadingOwnerRentals, setIsLoadingOwnerRentals] = useState(true)

  // Estados para el modal de programación
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [scheduleModalType, setScheduleModalType] = useState<'delivery' | 'return'>('delivery')
  const [activeScheduleRental, setActiveScheduleRental] = useState<any>(null)

  // Estados para el modal de pago
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [activePaymentRental, setActivePaymentRental] = useState<any>(null)

  // Fetch user's owned products
  useEffect(() => {
    const fetchOwnedProducts = async () => {
      if (!user) return
      
      try {
        setIsLoadingProducts(true)
        const response = await apiService.getProducts()
        // Filter products owned by current user
        const userProducts = response.products.filter((product: Product) => product.owner._id === user.id)
        
        // Validar productos para evitar errores de imágenes
        const validProducts = userProducts.filter(product => {
          if (!product || !product._id || !product.title) {
            console.warn('⚠️ Producto sin datos mínimos:', product);
            return false;
          }
          
          // Verificar imágenes
          if (product.images && Array.isArray(product.images)) {
            product.images = product.images.filter(img => 
              img && typeof img === 'string' && img !== 'undefined' && img !== 'null'
            );
          }
          
          return true;
        });
        
        console.log(`✅ Productos propios cargados: ${userProducts.length} total, ${validProducts.length} válidos`);
        setOwnedProducts(validProducts)
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

  // Función para abrir el chat flotante
  const handleOpenChat = (rental: any) => {
    console.log('🔍 Debug rental data:', rental)
    console.log('🔍 Debug user data:', user)
    
    // Determinar quién es el otro usuario con más validaciones
    let otherUser = null

    if (user?._id === rental.owner?._id || user?.id === rental.owner?._id) {
      // Soy el propietario, el otro es el inquilino
      otherUser = rental.renter
      console.log('🔍 Soy propietario, otro usuario es renter:', otherUser)
    } else {
      // Soy el inquilino, el otro es el propietario
      otherUser = rental.product?.owner || rental.owner
      console.log('🔍 Soy inquilino, otro usuario es owner:', otherUser)
    }

    if (!otherUser || (!otherUser._id && !otherUser.id)) {
      console.error('❌ No se pudo determinar el otro usuario:', { 
        rental, 
        user, 
        otherUser,
        rentalOwner: rental.owner,
        rentalRenter: rental.renter,
        productOwner: rental.product?.owner
      })
      return
    }

    openChat({
      rentalId: rental._id,
      productTitle: rental.product?.title || 'Producto',
      otherUser: {
        _id: otherUser._id || otherUser.id,
        name: otherUser.name || 'Usuario',
        avatar: otherUser.avatar
      }
    })
  }

  // Fetch user's rentals
  useEffect(() => {
    const fetchUserRentals = async () => {
      if (!user) return
      
      try {
        setIsLoadingRentals(true)
        const rentals = await apiService.getUserRentals(user.id)
        
        // Filtrar y validar alquileres para evitar errores de imágenes
        const validRentals = rentals.filter(rental => {
          if (!rental || !rental.product) {
            console.warn('⚠️ Alquiler sin producto válido:', rental);
            return false;
          }
          
          // Validar que el producto tenga datos mínimos
          if (!rental.product._id || !rental.product.title) {
            console.warn('⚠️ Producto sin datos mínimos:', rental.product);
            return false;
          }
          
          return true;
        });
        
        console.log(`✅ Alquileres cargados: ${rentals.length} total, ${validRentals.length} válidos`);
        setUserRentals(validRentals)
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

  // Fetch rentals where user is the owner (rental requests)
  useEffect(() => {
    const fetchOwnerRentals = async () => {
      if (!user) return
      
      try {
        setIsLoadingOwnerRentals(true)
        const response = await apiService.getOwnerRentals()
        
        // Filtrar y validar alquileres
        const validRentals = response.rentals.filter(rental => {
          if (!rental || !rental.product) {
            console.warn('⚠️ Alquiler sin producto válido:', rental);
            return false;
          }
          return true;
        });
        
        console.log(`✅ Solicitudes de alquiler cargadas: ${response.rentals.length} total, ${validRentals.length} válidas`);
        setOwnerRentals(validRentals)
      } catch (error) {
        console.error('Error fetching owner rentals:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las solicitudes de alquiler",
          variant: "destructive"
        })
      } finally {
        setIsLoadingOwnerRentals(false)
      }
    }

    fetchOwnerRentals()
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

  // Función para confirmar alquiler
  const handleConfirmRental = async (rentalId: string, productTitle: string) => {
    if (!confirm(`¿Confirmar el alquiler de "${productTitle}"?`)) {
      return
    }

    try {
      await apiService.updateRentalStatus(rentalId, 'confirmed')
      
      // Actualizar la lista local
      setOwnerRentals(prev => prev.map(rental => 
        rental._id === rentalId 
          ? { ...rental, status: 'confirmed' }
          : rental
      ))
      
      toast({
        title: "Alquiler confirmado",
        description: `Has confirmado el alquiler de "${productTitle}". Ahora puedes coordinar la entrega.`
      })
    } catch (error) {
      console.error('Error confirming rental:', error)
      toast({
        title: "Error",
        description: "No se pudo confirmar el alquiler",
        variant: "destructive"
      })
    }
  }

  // Función para rechazar alquiler
  const handleRejectRental = async (rentalId: string, productTitle: string) => {
    if (!confirm(`¿Rechazar el alquiler de "${productTitle}"?`)) {
      return
    }

    try {
      await apiService.updateRentalStatus(rentalId, 'cancelled')
      
      // Actualizar la lista local
      setOwnerRentals(prev => prev.map(rental => 
        rental._id === rentalId 
          ? { ...rental, status: 'cancelled' }
          : rental
      ))
      
      toast({
        title: "Alquiler rechazado",
        description: `Has rechazado el alquiler de "${productTitle}"`
      })
    } catch (error) {
      console.error('Error rejecting rental:', error)
      toast({
        title: "Error",
        description: "No se pudo rechazar el alquiler",
        variant: "destructive"
      })
    }
  }

  // Función para programar entrega
  const handleScheduleDelivery = (rental: any) => {
    setActiveScheduleRental(rental)
    setScheduleModalType('delivery')
    setScheduleModalOpen(true)
  }

  // Función para programar devolución
  const handleScheduleReturn = (rental: any) => {
    setActiveScheduleRental(rental)
    setScheduleModalType('return')
    setScheduleModalOpen(true)
  }

  // Función para abrir el modal de pago
  const handleOpenPayment = (rental: any) => {
    setActivePaymentRental(rental)
    setPaymentModalOpen(true)
  }

  // Función para confirmar la programación desde el modal
  const handleConfirmSchedule = async (dateTime: string) => {
    if (!activeScheduleRental) return

    try {
      if (scheduleModalType === 'delivery') {
        await apiService.scheduleDelivery(activeScheduleRental._id, dateTime)
        
        // Actualizar la lista local
        setOwnerRentals(prev => prev.map(rental => 
          rental._id === activeScheduleRental._id 
            ? { ...rental, status: 'delivery_arranged', deliveryScheduledDate: dateTime }
            : rental
        ))
        
        toast({
          title: "Entrega programada",
          description: `Has programado la entrega de "${activeScheduleRental.product.title}" exitosamente`
        })
      } else {
        await apiService.scheduleReturn(activeScheduleRental._id, dateTime)
        
        // Actualizar la lista local
        setOwnerRentals(prev => prev.map(rental => 
          rental._id === activeScheduleRental._id 
            ? { ...rental, status: 'return_arranged', returnScheduledDate: dateTime }
            : rental
        ))
        
        toast({
          title: "Devolución programada",
          description: `Has programado la devolución de "${activeScheduleRental.product.title}" exitosamente`
        })
      }
    } catch (error) {
      console.error('Error scheduling:', error)
      toast({
        title: "Error",
        description: `No se pudo programar la ${scheduleModalType === 'delivery' ? 'entrega' : 'devolución'}`,
        variant: "destructive"
      })
    }
  }

  // Función para confirmar entrega
  const handleConfirmDelivery = async (rentalId: string, productTitle: string) => {
    if (!confirm(`¿Confirmar que se ha entregado "${productTitle}"?`)) {
      return
    }

    try {
      await apiService.confirmDelivery(rentalId)
      
      // Actualizar la lista local
      setOwnerRentals(prev => prev.map(rental => 
        rental._id === rentalId 
          ? { ...rental, status: 'active' }
          : rental
      ))
      
      toast({
        title: "Entrega confirmada",
        description: `Has confirmado la entrega de "${productTitle}". El alquiler está ahora activo.`
      })
    } catch (error) {
      console.error('Error confirming delivery:', error)
      toast({
        title: "Error",
        description: "No se pudo confirmar la entrega",
        variant: "destructive"
      })
    }
  }

  // Función para confirmar devolución
  const handleConfirmReturn = async (rentalId: string, productTitle: string) => {
    if (!confirm(`¿Confirmar que se ha devuelto "${productTitle}"?`)) {
      return
    }

    try {
      await apiService.confirmReturn(rentalId)
      
      // Actualizar la lista local
      setOwnerRentals(prev => prev.map(rental => 
        rental._id === rentalId 
          ? { ...rental, status: 'completed' }
          : rental
      ))
      
      toast({
        title: "Devolución confirmada",
        description: `Has confirmado la devolución de "${productTitle}". El alquiler se ha completado exitosamente.`
      })
    } catch (error) {
      console.error('Error confirming return:', error)
      toast({
        title: "Error",
        description: "No se pudo confirmar la devolución",
        variant: "destructive"
      })
    }
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
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="rentals">Mis Alquileres</TabsTrigger>
                    <TabsTrigger value="requests" className="relative">
                      Solicitudes
                      {ownerRentals.filter(r => r.status === 'pending').length > 0 && (
                        <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-red-500">
                          {ownerRentals.filter(r => r.status === 'pending').length}
                        </Badge>
                      )}
                    </TabsTrigger>
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
                                    debugId={`Profile-Rental-${rental._id}`}
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
                                      rental.status === 'confirmed' 
                                        ? "text-green-600 border-green-600"
                                        : rental.status === 'delivery_arranged'
                                        ? "text-blue-600 border-blue-600"
                                        : rental.status === 'active'
                                        ? "text-orange-600 border-orange-600"
                                        : rental.status === 'return_arranged'
                                        ? "text-purple-600 border-purple-600"
                                        : rental.status === 'completed'
                                        ? "text-indigo-600 border-indigo-600"
                                        : rental.status === 'pending'
                                        ? "text-yellow-600 border-yellow-600"
                                        : "text-red-600 border-red-600"
                                    }
                                  >
                                    {rental.status === 'confirmed' ? 'Confirmado' : 
                                     rental.status === 'delivery_arranged' ? 'Entrega Programada' :
                                     rental.status === 'active' ? 'Activo' :
                                     rental.status === 'return_arranged' ? 'Devolución Programada' :
                                     rental.status === 'completed' ? 'Completado' :
                                     rental.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                  </Badge>
                                  
                                  {/* Mostrar estado de pago si está confirmado */}
                                  {rental.status === 'confirmed' && (
                                    <Badge 
                                      variant="outline"
                                      className={
                                        rental.paymentStatus === 'paid'
                                          ? "text-green-600 border-green-600 bg-green-50"
                                          : rental.paymentStatus === 'failed'
                                          ? "text-red-600 border-red-600 bg-red-50"
                                          : "text-yellow-600 border-yellow-600 bg-yellow-50"
                                      }
                                    >
                                      {rental.paymentStatus === 'paid' ? '✓ Pagado' : 
                                       rental.paymentStatus === 'failed' ? '✗ Pago fallido' : '⏳ Pago pendiente'}
                                    </Badge>
                                  )}
                                  
                                  <div className="flex space-x-2">
                                    {(rental.status !== 'cancelled' && rental.status !== 'completed') && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenChat(rental)}
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Chat
                                      </Button>
                                    )}
                                    {/* Botón de pago para alquileres confirmados pero no pagados */}
                                    {rental.status === 'confirmed' && rental.paymentStatus === 'pending' && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleOpenPayment(rental)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        💳 Pagar
                                      </Button>
                                    )}
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
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Rental Requests Tab */}
                  <TabsContent value="requests">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          Solicitudes de Alquiler
                          {ownerRentals.filter(r => r.status === 'pending').length > 0 && (
                            <Badge className="ml-2 bg-orange-100 text-orange-800">
                              {ownerRentals.filter(r => r.status === 'pending').length} pendientes
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isLoadingOwnerRentals ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                          </div>
                        ) : ownerRentals.length === 0 ? (
                          <div className="text-center py-8">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes solicitudes de alquiler</h3>
                            <p className="text-gray-600">
                              Cuando alguien solicite alquilar tus productos, aparecerán aquí
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {ownerRentals.map((rental) => (
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
                                    debugId={`Profile-OwnerRental-${rental._id}`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{rental.product.title}</h4>
                                  <p className="text-sm text-gray-600">
                                    Solicitado por: <span className="font-medium text-blue-600">{rental.renter.name}</span>
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Badge variant="secondary">{rental.product.category}</Badge>
                                    <span className="text-sm text-gray-500">S/ {rental.pricePerDay}/día</span>
                                    <span className="text-sm text-blue-600">
                                      {rental.totalDays} {rental.totalDays === 1 ? "día" : "días"} - Total: S/ {rental.totalPrice}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                      {new Date(rental.startDate).toLocaleDateString('es-ES')} - {new Date(rental.endDate).toLocaleDateString('es-ES')}
                                    </span>
                                  </div>
                                  {rental.notes && (
                                    <p className="text-sm text-gray-600 mt-1 italic">
                                      Nota: {rental.notes}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right space-y-2">
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      rental.status === 'confirmed' 
                                        ? "text-green-600 border-green-600"
                                        : rental.status === 'delivery_arranged'
                                        ? "text-blue-600 border-blue-600"
                                        : rental.status === 'active'
                                        ? "text-orange-600 border-orange-600"
                                        : rental.status === 'return_arranged'
                                        ? "text-purple-600 border-purple-600"
                                        : rental.status === 'completed'
                                        ? "text-indigo-600 border-indigo-600"
                                        : rental.status === 'pending'
                                        ? "text-yellow-600 border-yellow-600"
                                        : "text-red-600 border-red-600"
                                    }
                                  >
                                    {rental.status === 'confirmed' ? 'Confirmado' : 
                                     rental.status === 'delivery_arranged' ? 'Entrega Programada' :
                                     rental.status === 'active' ? 'Activo' :
                                     rental.status === 'return_arranged' ? 'Devolución Programada' :
                                     rental.status === 'completed' ? 'Completado' :
                                     rental.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                  </Badge>
                                  
                                  {rental.status === 'pending' && (
                                    <div className="flex flex-col space-y-1">
                                      <Button
                                        size="sm"
                                        onClick={() => handleConfirmRental(rental._id, rental.product.title)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        ✓ Confirmar
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRejectRental(rental._id, rental.product.title)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        ✗ Rechazar
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenChat(rental)}
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Chat
                                      </Button>
                                    </div>
                                  )}
                                  
                                  {rental.status === 'confirmed' && (
                                    <div className="flex flex-col space-y-1">
                                      <Button
                                        size="sm"
                                        onClick={() => handleScheduleDelivery(rental)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        📅 Programar Entrega
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenChat(rental)}
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Chat
                                      </Button>
                                      <div className="text-xs text-green-600 text-center bg-green-50 p-2 rounded">
                                        ¡Alquiler confirmado!<br/>
                                        Programa la entrega
                                      </div>
                                    </div>
                                  )}

                                  {rental.status === 'delivery_arranged' && (
                                    <div className="flex flex-col space-y-1">
                                      <Button
                                        size="sm"
                                        onClick={() => handleConfirmDelivery(rental._id, rental.product.title)}
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                      >
                                        ✓ Confirmar Entrega
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenChat(rental)}
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Chat
                                      </Button>
                                      {rental.deliveryScheduledDate && (
                                        <div className="text-xs text-blue-600 text-center bg-blue-50 p-2 rounded">
                                          Entrega programada:<br/>
                                          {new Date(rental.deliveryScheduledDate).toLocaleDateString('es-ES')}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {rental.status === 'active' && (
                                    <div className="flex flex-col space-y-1">
                                      <Button
                                        size="sm"
                                        onClick={() => handleScheduleReturn(rental)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                      >
                                        📅 Programar Devolución
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenChat(rental)}
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Chat
                                      </Button>
                                      <div className="text-xs text-orange-600 text-center bg-orange-50 p-2 rounded">
                                        Alquiler activo<br/>
                                        Producto en uso
                                      </div>
                                    </div>
                                  )}

                                  {rental.status === 'return_arranged' && (
                                    <div className="flex flex-col space-y-1">
                                      <Button
                                        size="sm"
                                        onClick={() => handleConfirmReturn(rental._id, rental.product.title)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                      >
                                        ✓ Confirmar Devolución
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenChat(rental)}
                                      >
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        Chat
                                      </Button>
                                      {rental.returnScheduledDate && (
                                        <div className="text-xs text-purple-600 text-center bg-purple-50 p-2 rounded">
                                          Devolución programada:<br/>
                                          {new Date(rental.returnScheduledDate).toLocaleDateString('es-ES')}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {rental.status === 'completed' && (
                                    <div className="flex flex-col space-y-1">
                                      <div className="text-xs text-indigo-600 text-center bg-indigo-50 p-2 rounded">
                                        ✅ Alquiler completado<br/>
                                        ¡Gracias por usar RentAll!
                                      </div>
                                    </div>
                                  )}
                                  
                                  {rental.status === 'cancelled' && (
                                    <div className="text-xs text-red-600 text-center bg-red-50 p-2 rounded">
                                      ❌ Alquiler cancelado
                                    </div>
                                  )}
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
                                    debugId={`Profile-OwnedProduct-${product._id}`}
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
                              selectedRentalDetails.status === 'confirmed' 
                                ? "text-green-600 border-green-600"
                                : selectedRentalDetails.status === 'delivery_arranged'
                                ? "text-blue-600 border-blue-600"
                                : selectedRentalDetails.status === 'active'
                                ? "text-orange-600 border-orange-600"
                                : selectedRentalDetails.status === 'return_arranged'
                                ? "text-purple-600 border-purple-600"
                                : selectedRentalDetails.status === 'completed'
                                ? "text-indigo-600 border-indigo-600"
                                : selectedRentalDetails.status === 'pending'
                                ? "text-yellow-600 border-yellow-600"
                                : "text-red-600 border-red-600"
                            }
                          >
                            {selectedRentalDetails.status === 'confirmed' ? 'Confirmado' : 
                             selectedRentalDetails.status === 'delivery_arranged' ? 'Entrega Programada' :
                             selectedRentalDetails.status === 'active' ? 'Activo' :
                             selectedRentalDetails.status === 'return_arranged' ? 'Devolución Programada' :
                             selectedRentalDetails.status === 'completed' ? 'Completado' :
                             selectedRentalDetails.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                          </Badge>
                        </div>
                      </div>
                      {selectedRentalDetails.deliveryScheduledDate && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Entrega programada:</strong> {new Date(selectedRentalDetails.deliveryScheduledDate).toLocaleString('es-ES')}
                          </p>
                        </div>
                      )}
                      {selectedRentalDetails.returnScheduledDate && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-sm text-purple-800">
                            <strong>Devolución programada:</strong> {new Date(selectedRentalDetails.returnScheduledDate).toLocaleString('es-ES')}
                          </p>
                        </div>
                      )}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Recordatorio:</strong> {
                            selectedRentalDetails.status === 'pending' ? 'Esperando confirmación del propietario.' :
                            selectedRentalDetails.status === 'confirmed' ? 'Alquiler confirmado. Esperando programación de entrega.' :
                            selectedRentalDetails.status === 'delivery_arranged' ? 'Entrega programada. Contacta al propietario para coordinar.' :
                            selectedRentalDetails.status === 'active' ? 'Producto en uso. Cuídalo y devuélvelo en buen estado.' :
                            selectedRentalDetails.status === 'return_arranged' ? 'Devolución programada. Contacta al propietario para coordinar.' :
                            selectedRentalDetails.status === 'completed' ? '¡Alquiler completado exitosamente! Gracias por usar RentAll.' :
                            'Alquiler cancelado.'
                          }
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
        
        {/* Modal de pago */}
        {paymentModalOpen && activePaymentRental && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <PaymentCheckout
                rental={activePaymentRental}
                onClose={() => {
                  setPaymentModalOpen(false)
                  setActivePaymentRental(null)
                }}
                onSuccess={() => {
                  // Actualizar el estado del alquiler a "paid"
                  setUserRentals(prev => prev.map(rental => 
                    rental._id === activePaymentRental._id 
                      ? { ...rental, paymentStatus: 'paid' }
                      : rental
                  ))
                  setPaymentModalOpen(false)
                  setActivePaymentRental(null)
                  toast({
                    title: "Pago exitoso",
                    description: "El pago se ha procesado correctamente. El propietario puede proceder con la programación de entrega."
                  })
                }}
              />
            </div>
          </div>
        )}
        
        {/* Modal de programación de entrega/devolución */}
        <ScheduleDeliveryModal
          isOpen={scheduleModalOpen}
          onClose={() => {
            setScheduleModalOpen(false)
            setActiveScheduleRental(null)
            setScheduleModalType('delivery')
          }}
          onConfirm={handleConfirmSchedule}
          type={scheduleModalType}
          productTitle={activeScheduleRental?.product?.title || ''}
        />
      </div>
    </ProtectedRoute>
  )
}
