"use client"

import { useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { StripeCheckout } from "./stripe-checkout"
import { stripePromise, stripeAppearance } from "@/lib/stripe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SimpleSmartImage } from "@/components/simple-smart-image"
import { X, Calendar, MapPin, DollarSign } from "lucide-react"
import { apiService } from "@/lib/api"

interface PaymentCheckoutProps {
  rental: any
  onClose: () => void
  onSuccess: () => void
}

export function PaymentCheckout({ rental, onClose, onSuccess }: PaymentCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreatePaymentIntent = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiService.createPaymentIntent(rental._id)
      setClientSecret(response.clientSecret)
    } catch (error) {
      console.error('Error creating payment intent:', error)
      setError('No se pudo inicializar el pago. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const appearance = stripeAppearance

  const options = clientSecret ? {
    clientSecret,
    appearance,
  } : undefined

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Procesar Pago</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumen del alquiler */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumen del Alquiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                <SimpleSmartImage
                  imagePath={rental.product.images?.[0]}
                  alt={rental.product.title}
                  className="w-full h-full object-cover"
                  showLoadingIndicator={true}
                  debugId={`Payment-Product-${rental.product._id}`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{rental.product.title}</h3>
                <p className="text-sm text-gray-600">{rental.product.description}</p>
                <Badge variant="secondary" className="mt-1">{rental.product.category}</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Precio por día:</span>
                <span className="font-semibold">S/ {rental.product.pricePerDay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duración:</span>
                <span className="font-semibold">{rental.days} {rental.days === 1 ? "día" : "días"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="font-semibold">S/ {(rental.product.pricePerDay * rental.days).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-green-600">S/ {rental.totalAmount}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">Inicio:</span>
                <span className="ml-2 font-medium">
                  {new Date(rental.startDate).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">Fin:</span>
                <span className="ml-2 font-medium">
                  {new Date(rental.endDate).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                <span className="text-gray-600">Recogida:</span>
                <span className="ml-2 font-medium">{rental.product.pickupAddress}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de pago */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Información de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {!clientSecret ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    Haz clic en "Inicializar Pago" para proceder con el pago seguro a través de Stripe.
                  </p>
                </div>
                <Button
                  onClick={handleCreatePaymentIntent}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? "Inicializando..." : "Inicializar Pago"}
                </Button>
              </div>
            ) : options ? (
              <Elements options={options} stripe={stripePromise}>
                <StripeCheckout
                  rental={rental}
                  onSuccess={onSuccess}
                  onError={(error: string) => setError(error)}
                />
              </Elements>
            ) : (
              <div>Error al cargar el formulario de pago</div>
            )}

            <div className="mt-6 space-y-2 text-xs text-gray-500">
              <p>🔒 Tu información de pago está protegida con cifrado SSL</p>
              <p>💳 Aceptamos todas las tarjetas de crédito y débito</p>
              <p>🛡️ Procesado de forma segura por Stripe</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
