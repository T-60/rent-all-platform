"use client"

import { LiveImageTest } from "@/components/live-image-test"
import { SimpleSmartImage } from "@/components/simple-smart-image"

export default function ImageTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Página de Test de Imágenes</h1>
        
        <LiveImageTest />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Tests Adicionales</h2>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">1. SimpleSmartImage</h3>
              <SimpleSmartImage 
                imagePath="/uploads/products/product-1749503893109-152139440.PNG"
                alt="Test SimpleSmartImage"
                className="w-full h-32 object-cover border rounded"
              />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">2. Imagen PNG (IMG)</h3>
              <img 
                src="http://localhost:3001/uploads/products/product-1749503893109-152139440.PNG"
                alt="Test PNG directo"
                className="w-full h-32 object-cover border rounded"
                onLoad={() => console.log('✅ [TestPage] PNG directo cargado')}
                onError={() => console.error('❌ [TestPage] PNG directo falló')}
              />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">3. SVG de Prueba</h3>
              <img 
                src="http://localhost:3001/uploads/products/test-black.svg"
                alt="Test SVG"
                className="w-full h-32 object-cover border rounded"
                onLoad={() => console.log('✅ [TestPage] SVG cargado')}
                onError={() => console.error('❌ [TestPage] SVG falló')}
              />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">4. Placeholder Local</h3>
              <img 
                src="/placeholder-product.svg"
                alt="Placeholder"
                className="w-full h-32 object-cover border rounded"
                onLoad={() => console.log('✅ [TestPage] Placeholder cargado')}
                onError={() => console.error('❌ [TestPage] Placeholder falló')}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">📋 Instrucciones</h3>
          <ol className="text-yellow-700 text-sm space-y-1">
            <li>1. Abre las herramientas de desarrollador (F12)</li>
            <li>2. Ve a la pestaña "Console"</li>
            <li>3. Busca los logs que empiecen con ✅ o ❌</li>
            <li>4. Verifica si las imágenes se cargan visualmente</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
