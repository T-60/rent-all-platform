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
import { categories, type Product } from "@/lib/mock-data"
import { ImageUpload } from "./image-upload"
import { Edit } from "lucide-react"

interface EditProductFormProps {
  product: Product
  onClose: () => void
}

export function EditProductForm({ product, onClose }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageData, setImageData] = useState<string | null>(product.image)
  const { updateProduct } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const updates = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      category: formData.get("category") as string,
      image: imageData || "/placeholder.svg?height=300&width=400",
      pickupAddress: formData.get("pickupAddress") as string,
      returnAddress: formData.get("returnAddress") as string,
    }

    updateProduct(product.id, updates)

    toast({
      title: "¡Producto actualizado!",
      description: "Los cambios han sido guardados exitosamente.",
    })

    setIsLoading(false)
    onClose()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Edit className="h-5 w-5 mr-2" />
          Editar Producto
        </CardTitle>
        <CardDescription>Modifica la información de tu producto</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imagen del producto */}
          <ImageUpload onImageChange={setImageData} currentImage={product.image} />

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" name="name" defaultValue={product.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select name="category" defaultValue={product.category} required>
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
            <Textarea id="description" name="description" defaultValue={product.description} rows={4} required />
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <Label htmlFor="price">Precio por Hora (S/)</Label>
            <Input id="price" name="price" type="number" min="1" step="0.01" defaultValue={product.price} required />
          </div>

          {/* Direcciones */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Dirección de Recogida</Label>
              <Input id="pickupAddress" name="pickupAddress" defaultValue={product.pickupAddress} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnAddress">Dirección de Devolución</Label>
              <Input id="returnAddress" name="returnAddress" defaultValue={product.returnAddress} required />
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
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
