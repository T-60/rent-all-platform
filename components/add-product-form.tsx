"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { categories } from "@/lib/mock-data"
import { Plus } from "lucide-react"
import { ImageUpload } from "./image-upload"

interface AddProductFormProps {
  onClose: () => void
}

export function AddProductForm({ onClose }: AddProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addProduct } = useAuth()
  const { toast } = useToast()
  const [imageData, setImageData] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      priceUnit: "hour" as const,
      category: formData.get("category") as string,
      image: imageData || "/placeholder.svg?height=300&width=400",
      pickupAddress: formData.get("pickupAddress") as string,
      returnAddress: formData.get("returnAddress") as string,
      paymentMethod: "efectivo" as const,
      available: true,
    }

    addProduct(productData)

    toast({
      title: "¡Producto añadido!",
      description: "Tu producto ha sido publicado exitosamente.",
    })

    setIsLoading(false)
    onClose()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Añadir Producto para Alquilar
        </CardTitle>
        <CardDescription>
          Completa la información de tu producto para que otros estudiantes puedan alquilarlo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imagen del producto */}
          <div className="space-y-2">
            <Label htmlFor="image">Foto del Producto</Label>
            <ImageUpload onImageChange={setImageData} />
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" name="name" placeholder="Ej: Cámara Canon EOS" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat !== "Todos")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción Detallada</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe tu producto, incluye características importantes, estado, accesorios incluidos, etc."
              rows={4}
              required
            />
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <Label htmlFor="price">Precio por Hora (S/)</Label>
            <Input id="price" name="price" type="number" min="1" step="0.01" placeholder="25.00" required />
            <p className="text-xs text-gray-500">Los pagos se realizarán únicamente en efectivo</p>
          </div>

          {/* Direcciones */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Dirección de Recogida</Label>
              <Input
                id="pickupAddress"
                name="pickupAddress"
                placeholder="Ej: Campus UNSA, Biblioteca Central, Piso 2"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnAddress">Dirección de Devolución</Label>
              <Input
                id="returnAddress"
                name="returnAddress"
                placeholder="Ej: Campus UNSA, Biblioteca Central, Piso 2"
                required
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Información Importante:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Los pagos se realizan únicamente en efectivo</li>
              <li>• Tú serás responsable de coordinar la entrega y recogida</li>
              <li>• Asegúrate de que las direcciones sean claras y accesibles</li>
              <li>• El producto aparecerá disponible inmediatamente</li>
            </ul>
          </div>

          {/* Botones */}
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Publicando..." : "Publicar Producto"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
