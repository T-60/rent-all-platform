"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { PaymentCheckout } from "@/components/payment-checkout"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin, User, Clock, Shield, Calendar, DollarSign, Loader2 } from "lucide-react"
import { apiService, type Product } from "@/lib/api"
import { translateCategory, getImageUrl } from "@/lib/utils-api"
import { SimpleSmartImage } from "@/components/simple-smart-image"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [hours, setHours] = useState(1)
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para el flujo de alquiler
  const [step, setStep] = useState<'details' | 'pending' | 'payment' | 'success'>('details')
  const [rental, setRental] = useState<any>(null)
  
  // Estados para las solicitudes pendientes (solo para propietarios)
  const [pendingRentals, setPendingRentals] = useState<any[]>([])
  const [loadingPendingRentals, setLoadingPendingRentals] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await apiService.getProduct(params.id as string)
        setProduct(response.product)
        
        // Si el usuario es el propietario, cargar solicitudes pendientes
        if (user && response.product.owner._id === user.id) {
          await fetchPendingRentals(params.id as string)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    if (params.id && user) {
      fetchProduct()
    }
  }, [params.id, user])

  const fetchPendingRentals = async (productId: string) => {
    try {
      setLoadingPendingRentals(true)
      const response = await fetch(`/api/rentals?product=${productId}&status=pending`, {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPendingRentals(data.rentals || [])
      }
    } catch (error) {
      console.error('Error cargando solicitudes pendientes:', error)
    } finally {
      setLoadingPendingRentals(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando producto...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !product) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error || 'Producto no encontrado'}
              </h1>
              <Button onClick={() => router.push("/products")}>Volver a productos</Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const totalPrice = hours * product.pricePerDay

  // Verificar si el usuario es el propietario del producto
  const isOwner = product.owner._id === user?.id

  const handleRent = async () => {
    if (isOwner) {
      toast({
        title: "No puedes alquilar tu propio producto",
        description: "Este producto te pertenece. No puedes alquilarlo a ti mismo.",
        variant: "destructive",
      })
      return
    }

    if (!pickupDate || !pickupTime) {
      toast({
        title: "Información incompleta",
        description: "Por favor selecciona la fecha y hora de recogida.",
        variant: "destructive",
      })
      return
    }

    try {
      // Calcular fechas de inicio y fin
      const startDateTime = new Date(`${pickupDate}T${pickupTime}`)
      const endDateTime = new Date(startDateTime.getTime() + (hours * 24 * 60 * 60 * 1000)) // días a milisegundos

      const rentalData = {
        product: product._id,  // Cambiado de productId a product
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        deliveryMethod: 'pickup',
        notes: `Alquiler por ${hours} días. Total: S/ ${totalPrice}`,
        totalPrice: totalPrice
      }

      const response = await apiService.createRental(rentalData)
      setRental(response.rental)
      setStep('pending') // Cambio: ir a pending en lugar de payment

      toast({
        title: "¡Solicitud de alquiler enviada!",
        description: `Tu solicitud ha sido enviada al propietario. Te notificaremos cuando sea aprobada.`,
      })
    } catch (error: any) {
      console.error("Error al crear alquiler:", error)
      
      let errorTitle = "❌ Error al alquilar"
      let errorDescription = "No se pudo procesar el alquiler. Inténtalo de nuevo."
      
      if (error.response?.data) {
        const errorData = error.response.data
        
        // Errores específicos de alquiler
        if (errorData.message) {
          if (errorData.message.includes('fechas')) {
            errorTitle = "📅 Problema con las fechas"
            errorDescription = errorData.message + " Por favor, selecciona otras fechas."
          } else if (errorData.message.includes('propio producto')) {
            errorTitle = "🚫 No puedes alquilar tu propio producto"
            errorDescription = "Este producto te pertenece. Solo puedes alquilar productos de otros usuarios."
          } else if (errorData.message.includes('disponible')) {
            errorTitle = "⏰ Producto no disponible"
            errorDescription = errorData.message + " Intenta con otras fechas."
          } else {
            errorTitle = errorData.message.includes('❌') ? errorData.message : `❌ ${errorData.message}`
            errorDescription = errorData.details || "Revisa la información e inténtalo de nuevo."
          }
        }
        
        // Errores de validación de campos
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const firstError = errorData.errors[0]
          errorTitle = "📝 Información incorrecta"
          errorDescription = firstError.message
          
          if (errorData.suggestions) {
            errorDescription += "\n\n💡 " + errorData.suggestions.join(" • ")
          }
        }
      }
      // Error de red
      else if (!error.response) {
        errorTitle = "🌐 Error de conexión"
        errorDescription = "No se pudo conectar con el servidor. Verifica tu conexión."
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
        duration: 8000,
      })
    }
  }

  const handlePaymentSuccess = () => {
    setStep('success')
    toast({
      title: "¡Pago exitoso!",
      description: "Tu alquiler ha sido confirmado. El propietario ha sido notificado.",
    })
    
    setTimeout(() => {
      router.push("/profile")
    }, 3000)
  }

  const handlePaymentCancel = () => {
    setStep('details')
    setRental(null)
  }

  // Función para aprobar una solicitud de alquiler (solo para propietarios)
  const handleApproveRental = async (rentalId: string) => {
    try {
      const response = await fetch(`/api/rentals/${rentalId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
        },
        body: JSON.stringify({
          status: 'confirmed',
          notes: 'Solicitud aprobada por el arrendador'
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "¡Solicitud aprobada!",
          description: "El arrendatario ha sido notificado y puede proceder con el pago.",
        });
        
        // Actualizar la lista de solicitudes pendientes
        await fetchPendingRentals(params.id as string)
        
        // Refrescar notificaciones si está disponible
        if (typeof window !== 'undefined' && (window as any).refreshNotifications) {
          (window as any).refreshNotifications();
        }
      } else {
        const error = await response.json();
        toast({
          title: "Error al aprobar solicitud",
          description: error.message || 'No se pudo aprobar la solicitud',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error de conexión",
        description: 'No se pudo procesar la aprobación. Inténtalo de nuevo.',
        variant: "destructive",
      });
    }
  };

  // Mostrar el paso de solicitud pendiente
  if (step === 'pending' && rental) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <div className="max-w-md mx-auto text-center space-y-6">
                <div className="text-6xl">⏳</div>
                <h1 className="text-3xl font-bold text-blue-600">
                  Solicitud Enviada
                </h1>
                <p className="text-gray-600">
                  Tu solicitud de alquiler ha sido enviada al propietario del producto.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Producto:</span>
                    <span className="text-sm text-blue-600">{product?.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Duración:</span>
                    <span className="text-sm text-blue-600">{hours} días</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Total:</span>
                    <span className="text-sm text-blue-600">S/ {totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Estado:</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Pendiente de Aprobación
                    </Badge>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Próximos pasos:</strong><br />
                    1. El propietario revisará tu solicitud<br />
                    2. Recibirás una notificación cuando sea aprobada<br />
                    3. Podrás proceder con el pago una vez confirmada
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setStep('details')
                      setRental(null)
                    }}
                    className="flex-1"
                  >
                    Volver
                  </Button>
                  <Button 
                    onClick={() => router.push("/profile")}
                    className="flex-1"
                  >
                    Ir a Mi Perfil
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  // Mostrar el paso de pago
  if (step === 'payment' && rental) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <PaymentCheckout
                rental={rental}
                onClose={handlePaymentCancel}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  // Mostrar el paso de éxito
  if (step === 'success') {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <div className="max-w-md mx-auto text-center space-y-6">
                <div className="text-6xl">✅</div>
                <h1 className="text-3xl font-bold text-green-600">
                  ¡Pago Confirmado!
                </h1>
                <p className="text-gray-600">
                  Tu alquiler ha sido confirmado exitosamente. 
                  El propietario ha sido notificado.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    Serás redirigido a tu perfil en unos momentos...
                  </p>
                </div>
              </div>
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
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.back()} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <SimpleSmartImage 
                    imagePath={product.images && product.images.length > 0 ? product.images[0] : undefined}
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Additional images */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                        <SimpleSmartImage 
                          imagePath={image}
                          alt={`${product.title} - ${index + 2}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                    <Badge variant="secondary" className="text-sm">
                      {translateCategory(product.category)}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                </div>

                {/* Price */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">S/ {product.pricePerDay}</div>
                      <div className="text-gray-500">por día</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rental Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Configurar Alquiler
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hours">Número de Días</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="1"
                          max="30"
                          value={hours}
                          onChange={(e) => setHours(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total a Pagar</Label>
                        <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="font-semibold">S/ {totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDate">Fecha de Recogida</Label>
                        <Input
                          id="pickupDate"
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupTime">Hora de Recogida</Label>
                        <Input
                          id="pickupTime"
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Owner Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Propietario
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold">{product.owner.name}</p>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {product.pickupAddress}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pickup & Return Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información de Recogida y Devolución</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Dirección de Recogida:</h4>
                      <p className="text-sm text-gray-600">{product.pickupAddress}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Dirección de Devolución:</h4>
                      <p className="text-sm text-gray-600">{product.returnAddress}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Pago:</strong> Coordinar método de pago directamente con el propietario
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>Características</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-600 mr-3" />
                      <span>Disponible ahora</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-blue-600 mr-3" />
                      <span>Usuario verificado</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                      <span>Pago en efectivo</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Rental Requests - Only for Product Owner */}
                {isOwner && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Solicitudes de Alquiler</span>
                        {loadingPendingRentals && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pendingRentals.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No hay solicitudes pendientes
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {pendingRentals.map((pendingRental) => (
                            <div key={pendingRental._id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-600" />
                                    <span className="font-medium">{pendingRental.renter.name}</span>
                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                      Pendiente
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {new Date(pendingRental.startDate).toLocaleDateString()} - {new Date(pendingRental.endDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-3 w-3" />
                                      <span>S/ {pendingRental.totalPrice}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-3 w-3" />
                                      <span>{pendingRental.days} {pendingRental.days === 1 ? 'día' : 'días'}</span>
                                    </div>
                                  </div>
                                  {pendingRental.notes && (
                                    <p className="text-sm text-gray-600 italic">
                                      "{pendingRental.notes}"
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveRental(pendingRental._id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Aprobar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                  >
                                    Rechazar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Rent Button */}
                <Button onClick={handleRent} size="lg" className="w-full" disabled={isOwner}>
                  {isOwner
                    ? "No puedes alquilar tu propio producto"
                    : `Alquilar por S/ ${totalPrice} (${hours} ${hours === 1 ? "día" : "días"})`}
                </Button>

                {isOwner && (
                  <div className="text-sm text-orange-600 text-center bg-orange-50 p-3 rounded-lg">
                    Este producto te pertenece. No puedes alquilarlo a ti mismo.
                  </div>
                )}

                <div className="text-sm text-gray-500 text-center">
                  Al alquilar, aceptas nuestros términos y condiciones
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
