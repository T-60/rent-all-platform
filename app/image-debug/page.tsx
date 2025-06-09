"use client"

import { SimpleSmartImage } from "@/components/simple-smart-image"

export default function ImageTestPage() {
  const testImages = [
    {
      name: "Imagen válida existente",
      path: "/uploads/products/product-1749506182137-923723580.png",
      size: "grande"
    },
    {
      name: "Imagen válida pequeña",
      path: "/uploads/products/product-1749501763383-65395117.png", 
      size: "pequeña"
    },
    {
      name: "Imagen inexistente",
      path: "/uploads/products/no-existe.png",
      size: "pequeña"
    },
    {
      name: "Ruta vacía",
      path: "",
      size: "pequeña"
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Prueba de Imágenes - SimpleSmartImage</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testImages.map((test, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">{test.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Ruta: {test.path || 'vacía'}</p>
              
              {/* Imagen grande */}
              {test.size === "grande" && (
                <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <SimpleSmartImage
                    imagePath={test.path}
                    alt={test.name}
                    className="w-full h-full object-cover"
                    showLoadingIndicator={true}
                  />
                </div>
              )}
              
              {/* Imagen pequeña (como en el perfil) */}
              {test.size === "pequeña" && (
                <div className="flex items-center space-x-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                    <SimpleSmartImage
                      imagePath={test.path}
                      alt={test.name}
                      className="w-full h-full object-cover"
                      showLoadingIndicator={true}
                    />
                  </div>
                  <div className="text-sm text-gray-700">
                    Tamaño: 64x64px (como en perfil)
                  </div>
                </div>
              )}
              
              {/* URL construida */}
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs font-mono">
                URL: {test.path ? `http://localhost:3001${test.path}` : 'placeholder'}
              </div>
            </div>
          ))}
        </div>
        
        {/* Prueba adicional: Varias imágenes pequeñas juntas */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Múltiples Imágenes Pequeñas (Simulando Lista de Perfil)</h3>
          <div className="space-y-4">
            {[
              "/uploads/products/product-1749506182137-923723580.png",
              "/uploads/products/product-1749501763383-65395117.png",
              "/uploads/products/product-1749503893109-152139440.PNG",
              "/uploads/products/no-existe.png"
            ].map((imagePath, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                  <SimpleSmartImage
                    imagePath={imagePath}
                    alt={`Producto ${index + 1}`}
                    className="w-full h-full object-cover"
                    showLoadingIndicator={true}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Producto de Prueba {index + 1}</h4>
                  <p className="text-sm text-gray-600">Imagen: {imagePath}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
