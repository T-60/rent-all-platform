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
import { ImageUpload } from "./image-upload"
import { Edit } from "lucide-react"
import { apiService, type Product } from "@/lib/api"
import { getImageUrl } from "@/lib/utils-api"
import { toast } from "sonner"

const categories = [
  { value: "electronics", label: "Electrónicos" },
  { value: "vehicles", label: "Vehículos" },
  { value: "tools", label: "Herramientas" },
  { value: "furniture", label: "Muebles" },
  { value: "sports", label: "Deportes" },
  { value: "others", label: "Otros" }
]

interface EditProductFormProps {
  product: Product
  onClose: () => void
}

export function EditProductForm({ product, onClose }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formElement = e.currentTarget
      const formData = new FormData()

      // Obtener datos del formulario
      const title = (formElement.elements.namedItem("title") as HTMLInputElement)?.value
      const description = (formElement.elements.namedItem("description") as HTMLTextAreaElement)?.value
      const pricePerDay = Number((formElement.elements.namedItem("pricePerDay") as HTMLInputElement)?.value)
      const category = (formElement.elements.namedItem("category") as HTMLSelectElement)?.value
      const pickupAddress = (formElement.elements.namedItem("pickupAddress") as HTMLInputElement)?.value
      const returnAddress = (formElement.elements.namedItem("returnAddress") as HTMLInputElement)?.value

      // Agregar campos al FormData
      formData.append("title", title)
      formData.append("description", description)
      formData.append("pricePerDay", pricePerDay.toString())
      formData.append("category", category)
      formData.append("pickupAddress", pickupAddress)
      formData.append("returnAddress", returnAddress)

      // Agregar nuevas imágenes si las hay
      imageFiles.forEach((file) => {
        formData.append("images", file)
      })

      const response = await apiService.updateProduct(product._id, formData)

      toast.success('¡Producto actualizado! Los cambios han sido guardados exitosamente.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '14px',
          fontWeight: '500',
        },
      })

      onClose()
    } catch (error) {
      console.error("Error al actualizar producto:", error)
      toast.error('Error: No se pudo actualizar el producto. Inténtalo de nuevo.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '14px',
          fontWeight: '500',
        },
      })
    } finally {
      setIsLoading(false)
    }
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
          <ImageUpload 
            onImageChange={(files) => setImageFiles(files)} 
            currentImages={product.images.map(img => getImageUrl(img))} 
          />

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nombre del Producto</Label>
              <Input id="title" name="title" defaultValue={product.title} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select name="category" defaultValue={product.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
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
            <Label htmlFor="pricePerDay">Precio por Día (S/)</Label>
            <Input id="pricePerDay" name="pricePerDay" type="number" min="1" step="0.01" defaultValue={product.pricePerDay} required />
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
