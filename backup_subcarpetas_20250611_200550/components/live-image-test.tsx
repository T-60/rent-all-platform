"use client"

import { useState, useEffect } from 'react';

export function LiveImageTest() {
  const [results, setResults] = useState<string[]>(['🚀 Iniciando test...']);
  
  useEffect(() => {
    async function runLiveTest() {
      const newResults: string[] = [];
      
      // URL de una imagen real que sabemos que existe
      const realImageUrl = 'http://localhost:3001/uploads/products/product-1749503893109-152139440.PNG';
      const placeholderUrl = '/placeholder-product.svg';
      
      newResults.push('📋 === LIVE IMAGE TEST ===');
      
      // Test 1: Fetch de imagen real
      try {
        newResults.push('🔄 Test 1: Fetch HEAD imagen real...');
        const response = await fetch(realImageUrl, { method: 'HEAD', mode: 'cors' });
        newResults.push(`✅ Status: ${response.status}, Type: ${response.headers.get('content-type')}`);
      } catch (error) {
        newResults.push(`❌ Fetch error: ${error}`);
      }
      
      // Test 2: Image object de imagen real
      try {
        newResults.push('🔄 Test 2: Image object imagen real...');
        const imageTest = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(`✅ Image loaded: ${img.naturalWidth}x${img.naturalHeight}`);
          img.onerror = () => reject('❌ Image failed to load');
          setTimeout(() => reject('❌ Timeout'), 3000);
          img.src = realImageUrl;
        });
        
        const result = await imageTest;
        newResults.push(result as string);
      } catch (error) {
        newResults.push(`❌ Image test error: ${error}`);
      }
      
      // Test 3: Placeholder
      try {
        newResults.push('🔄 Test 3: Placeholder...');
        const placeholderTest = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(`✅ Placeholder loaded: ${img.naturalWidth}x${img.naturalHeight}`);
          img.onerror = () => reject('❌ Placeholder failed');
          setTimeout(() => reject('❌ Timeout'), 3000);
          img.src = placeholderUrl;
        });
        
        const result = await placeholderTest;
        newResults.push(result as string);
      } catch (error) {
        newResults.push(`❌ Placeholder test error: ${error}`);
      }
      
      setResults(newResults);
    }
    
    runLiveTest();
  }, []);
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">🧪 Test de Imágenes en Vivo</h3>
      <div className="text-sm space-y-1 font-mono">
        {results.map((result, index) => (
          <div key={index} className={`
            ${result.includes('✅') ? 'text-green-700' : 
              result.includes('❌') ? 'text-red-700' : 
              result.includes('🔄') ? 'text-yellow-700' : 'text-gray-700'}
          `}>
            {result}
          </div>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold mb-1">Imagen Real:</p>
          <img 
            src="http://localhost:3001/uploads/products/product-1749503893109-152139440.PNG"
            alt="Test real"
            className="w-full h-20 object-cover border-2 border-green-300 rounded"
            onLoad={() => console.log('✅ [LiveImageTest] Imagen real cargada')}
            onError={() => console.error('❌ [LiveImageTest] Error imagen real')}
          />
        </div>
        
        <div>
          <p className="text-sm font-semibold mb-1">Placeholder:</p>
          <img 
            src="/placeholder-product.svg"
            alt="Test placeholder"
            className="w-full h-20 object-cover border-2 border-gray-300 rounded"
            onLoad={() => console.log('✅ [LiveImageTest] Placeholder cargado')}
            onError={() => console.error('❌ [LiveImageTest] Error placeholder')}
          />
        </div>
      </div>
    </div>
  );
}
