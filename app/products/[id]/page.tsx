"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { mockProducts } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin, User, Clock, Shield, Calendar, DollarSign } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { rentProduct, user, userProducts } = useAuth()
  const { toast } = useToast()
  const [hours, setHours] = useState(1)
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")

  // Buscar en productos mock y productos de usuarios
  const allProducts = [...mockProducts, ...userProducts]
  const product = allProducts.find((p) => p.id === params.id)

  if (!product) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
              <Button onClick={() => router.push("/products")}>Volver a productos</Button>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const totalPrice = hours * product.price

  // Verificar si el usuario es el propietario del producto
  const isOwner = product.ownerId === user?.id

  const handleRent = () => {
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

    rentProduct(
      product.id,
      product.name,
      hours,
      pickupDate,
      pickupTime,
      product.pickupAddress,
      product.returnAddress,
      product.price,
    )

    toast({
      title: "¡Alquiler confirmado!",
      description: `Has alquilado ${product.name} por ${hours} horas. Total: S/ ${totalPrice}`,
    })
    router.push("/profile")
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
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <Badge variant="secondary" className="text-sm">
                      {product.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                </div>

                {/* Price */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">S/ {product.price}</div>
                      <div className="text-gray-500">por hora</div>
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
                        <Label htmlFor="hours">Número de Horas</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="1"
                          max="24"
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
                      <p className="font-semibold">{product.owner}</p>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {product.university}
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
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Lugar de Recogida:</h4>
                      <p className="text-sm text-gray-600">{product.pickupAddress}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Lugar de Devolución:</h4>
                      <p className="text-sm text-gray-600">{product.returnAddress}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Pago:</strong> Únicamente en efectivo al momento de la recogida
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

                {/* Rent Button */}
                <Button onClick={handleRent} size="lg" className="w-full" disabled={isOwner}>
                  {isOwner
                    ? "No puedes alquilar tu propio producto"
                    : `Alquilar por S/ ${totalPrice} (${hours} ${hours === 1 ? "hora" : "horas"})`}
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
