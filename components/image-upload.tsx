"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImageChange: (files: File[]) => void
  currentImages?: string[]
  className?: string
  multiple?: boolean
}

export function ImageUpload({ onImageChange, currentImages = [], className, multiple = true }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(currentImages)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    if (selectedFiles.length === 0) return

    // Validar archivos
    const validFiles: File[] = []
    const newPreviews: string[] = []

    selectedFiles.forEach((file) => {
      // Validar tipo de archivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona solo archivos de imagen válidos")
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Las imágenes deben ser menores a 5MB")
        return
      }

      validFiles.push(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        newPreviews.push(result)
        
        // Si ya hemos procesado todos los archivos
        if (newPreviews.length === validFiles.length) {
          if (multiple) {
            const updatedFiles = [...files, ...validFiles]
            const updatedPreviews = [...previews, ...newPreviews]
            setFiles(updatedFiles)
            setPreviews(updatedPreviews)
            onImageChange(updatedFiles)
          } else {
            setFiles(validFiles)
            setPreviews(newPreviews)
            onImageChange(validFiles)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    setPreviews(updatedPreviews)
    onImageChange(updatedFiles)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <Label htmlFor="image">Fotos del Producto</Label>
      <div className="mt-2 space-y-4">
        {/* Preview de imágenes existentes */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Área de subida */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleClick}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600">
            Haz clic para seleccionar {multiple ? 'imágenes' : 'una imagen'}
            <br />
            <span className="text-xs text-gray-500">JPG, PNG, GIF hasta 5MB {multiple ? '(máximo 5 imágenes)' : ''}</span>
          </p>
        </div>
        
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          multiple={multiple}
          onChange={handleFileSelect} 
          className="hidden" 
        />
      </div>
    </div>
  )
}
