"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useProducts } from "@/contexts/products-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { apiService } from "@/lib/api"
import { toast } from "sonner"

const categories = [
  { value: "electronics", label: "Electrónicos" },
  { value: "vehicles", label: "Vehículos" },
  { value: "tools", label: "Herramientas" },
  { value: "furniture", label: "Muebles" },
  { value: "sports", label: "Deportes" },
  { value: "others", label: "Otros" }
]

interface AddProductFormProps {
  onClose: () => void
}

export function AddProductForm({ onClose }: AddProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { addProductToList, refreshProducts } = useProducts()
  const [imageFiles, setImageFiles] = useState<File[]>([])

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

      // 🔥 VALIDACIONES FRONTEND AMIGABLES
      if (!title || title.trim().length < 3) {
        toast('El título debe tener al menos 3 caracteres', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
          },
          icon: '📝',
        })
        setIsLoading(false)
        return
      }

      if (!description || description.trim().length < 10) {
        toast('La descripción debe tener al menos 10 caracteres para explicar mejor tu producto', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
          },
          icon: '📋',
        })
        setIsLoading(false)
        return
      }

      if (!pricePerDay || pricePerDay <= 0) {
        toast('Por favor, establece un precio válido por día', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
          },
          icon: '💰',
        })
        setIsLoading(false)
        return
      }

      if (!pickupAddress || pickupAddress.trim().length < 5) {
        toast('La dirección de recogida debe tener al menos 5 caracteres', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
          },
          icon: '📍',
        })
        setIsLoading(false)
        return
      }

      if (!returnAddress || returnAddress.trim().length < 5) {
        toast('La dirección de devolución debe tener al menos 5 caracteres', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
          },
          icon: '🏠',
        })
        setIsLoading(false)
        return
      }

      if (!category) {
        toast('Por favor, selecciona una categoría para tu producto', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '14px',
            fontWeight: '500',
          },
          icon: '🏷️',
        })
        setIsLoading(false)
        return
      }

      // Agregar campos al FormData
      formData.append("title", title)
      formData.append("description", description)
      formData.append("pricePerDay", pricePerDay.toString())
      formData.append("category", category)
      formData.append("pickupAddress", pickupAddress)
      formData.append("returnAddress", returnAddress)

      // Agregar imágenes
      imageFiles.forEach((file) => {
        formData.append("images", file)
      })

      const response = await apiService.createProduct(formData)

      // Agregar el producto al contexto global
      if (response.product) {
        addProductToList(response.product)
      }

      toast.success('🎉 ¡Producto publicado exitosamente! Tu producto ya está visible para otros estudiantes. Recibirás notificaciones cuando alguien esté interesado en alquilarlo.', {
        duration: 6000,
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

      // Limpiar formulario
      formElement.reset()
      setImageFiles([])

      // Actualizar la lista de productos en segundo plano
      setTimeout(() => {
        refreshProducts()
      }, 1000)

      onClose()
    } catch (error: any) {
      console.error("Error al crear producto:", error)
      
      // Manejo específico de errores mejorado
      let errorTitle = "❌ Error al crear producto"
      let errorDescription = "No se pudo crear el producto. Inténtalo de nuevo."
      
      if (error.response?.data) {
        const errorData = error.response.data
        
        // Error de imágenes
        if (errorData.error === 'NO_IMAGES') {
          errorTitle = "📷 ¡Falta la imagen!"
          errorDescription = "Tu producto necesita al menos una imagen para que otros estudiantes puedan verlo. Por favor, sube una foto."
        }
        // Errores de validación específicos
        else if (errorData.errors && Array.isArray(errorData.errors)) {
          const firstError = errorData.errors[0]
          
          if (firstError.field === 'title') {
            errorTitle = "📝 Problema con el título"
            errorDescription = firstError.message + " Usa un nombre descriptivo y corto."
          } else if (firstError.field === 'description') {
            errorTitle = "📄 Problema con la descripción"
            errorDescription = firstError.message + " Describe bien tu producto para atraer más interesados."
          } else if (firstError.field === 'pricePerDay') {
            errorTitle = "💰 Problema con el precio"
            errorDescription = firstError.message + " Verifica que sea un número válido."
          } else if (firstError.field === 'pickupAddress' || firstError.field === 'returnAddress') {
            errorTitle = "📍 Problema con las direcciones"
            errorDescription = firstError.message + " Especifica direcciones claras y completas."
          } else if (firstError.field === 'category') {
            errorTitle = "🏷️ Problema con la categoría"
            errorDescription = firstError.message
          } else {
            errorTitle = "📝 Información incompleta"
            errorDescription = firstError.message
          }
          
          // Agregar sugerencias si están disponibles
          if (errorData.suggestions && errorData.suggestions.length > 0) {
            errorDescription += "\n\n💡 Consejos:\n• " + errorData.suggestions.slice(0, 3).join("\n• ")
          }
        }
        // Error con mensaje personalizado del servidor
        else if (errorData.message) {
          errorTitle = errorData.message.includes('❌') ? errorData.message : `❌ ${errorData.message}`
          errorDescription = errorData.details || "Revisa la información e inténtalo de nuevo."
        }
      }
      // Error de red o conexión
      else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorTitle = "🌐 Error de conexión"
        errorDescription = "No se pudo conectar con el servidor. Verifica tu conexión a internet."
      }
      
      toast.error(`${errorTitle}: ${errorDescription}`, {
        duration: 8000,
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
            <Label htmlFor="image">Fotos del Producto</Label>
            <ImageUpload onImageChange={(files) => setImageFiles(files)} />
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nombre del Producto</Label>
              <Input id="title" name="title" placeholder="Ej: Cámara Canon EOS" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select name="category" required>
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
            <Label htmlFor="pricePerDay">Precio por Día (S/)</Label>
            <Input id="pricePerDay" name="pricePerDay" type="number" min="1" step="0.01" placeholder="25.00" required />
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
