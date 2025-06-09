"use client"

import { useState, useEffect } from 'react';
import { SmartImage } from './smart-image';
import { SimpleTestImage } from './simple-test-image';

export function ImageDebugComponent() {
  const [testResults, setTestResults] = useState<string[]>(['Iniciando pruebas...']);

  const testImageUrl = "http://localhost:3001/uploads/products/product-1749503893109-152139440.PNG";
  const testImageUrl2 = "http://localhost:3001/uploads/products/test-black.svg";
  const testImageUrl3 = "http://localhost:3001/uploads/products/test-red.svg";
  const testImageUrl4 = "http://localhost:3001/uploads/products/test-blue.svg";

  useEffect(() => {
    async function runTests() {
      const results: string[] = [];

      // Test básico con fetch
      try {
        results.push('🔄 Probando fetch HEAD request...');
        const response = await fetch(testImageUrl, { method: 'HEAD', mode: 'cors' });
        results.push(`✅ Fetch HEAD: ${response.status} - ${response.headers.get('content-type')}`);
        
        // Test con fetch GET para verificar contenido
        results.push('🔄 Probando fetch GET request...');
        const getResponse = await fetch(testImageUrl, { method: 'GET', mode: 'cors' });
        results.push(`✅ Fetch GET: ${getResponse.status} - ${getResponse.headers.get('content-length')} bytes`);
        
      } catch (error) {
        results.push(`❌ Fetch error: ${error}`);
      }

      // Test con la función verifyImageExists
      try {
        results.push('🔄 Probando verifyImageExists...');
        const { verifyImageExists } = await import('@/lib/utils-api');
        const exists = await verifyImageExists(testImageUrl);
        results.push(`${exists ? '✅' : '❌'} verifyImageExists: ${exists}`);
      } catch (error) {
        results.push(`❌ verifyImageExists error: ${error}`);
      }

      setTestResults(results);
    }

    runTests();
  }, []);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      <h3 className="font-bold text-lg mb-2">🔍 Debug de Imágenes - TEMPORAL</h3>
      
      <div className="mb-3">
        <p className="text-sm"><strong>URL de prueba:</strong></p>
        <p className="text-xs font-mono bg-white p-1 rounded">{testImageUrl}</p>
      </div>

      <div className="mb-3">
        <strong>Resultados:</strong>
        <div className="bg-white p-2 rounded text-xs">
          {testResults.map((result, index) => (
            <div key={index}>{result}</div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <SimpleTestImage 
          testUrl={testImageUrl}
          title="Producto Real PNG"
        />
        <SimpleTestImage 
          testUrl={testImageUrl2}
          title="Test SVG Negro"
        />
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        <div>
          <p className="text-xs font-semibold">PNG Original (img):</p>
          <img 
            src={testImageUrl} 
            alt="Test PNG" 
            className="w-full h-20 object-cover border border-blue-300"
            onLoad={() => console.log('✅ IMG PNG cargado:', testImageUrl)}
            onError={(e) => console.error('❌ IMG PNG error:', testImageUrl, e)}
          />
        </div>
        
        <div>
          <p className="text-xs font-semibold">PNG (SmartImage):</p>
          <div className="w-full h-20 border border-green-300">
            <SmartImage 
              imagePath="/uploads/products/product-1749503893109-152139440.PNG"
              alt="Test SmartImage PNG" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div>
          <p className="text-xs font-semibold">SVG Negro:</p>
          <img 
            src={testImageUrl2} 
            alt="Test SVG Black" 
            className="w-full h-20 object-cover border border-gray-300"
            onLoad={() => console.log('✅ IMG SVG Negro cargado:', testImageUrl2)}
            onError={(e) => console.error('❌ IMG SVG Negro error:', testImageUrl2, e)}
          />
        </div>

        <div>
          <p className="text-xs font-semibold">SVG Rojo:</p>
          <img 
            src={testImageUrl3} 
            alt="Test SVG Red" 
            className="w-full h-20 object-cover border border-red-300"
            onLoad={() => console.log('✅ IMG SVG Rojo cargado:', testImageUrl3)}
            onError={(e) => console.error('❌ IMG SVG Rojo error:', testImageUrl3, e)}
          />
        </div>

        <div>
          <p className="text-xs font-semibold">SVG Azul:</p>
          <img 
            src={testImageUrl4} 
            alt="Test SVG Blue" 
            className="w-full h-20 object-cover border border-blue-300"
            onLoad={() => console.log('✅ IMG SVG Azul cargado:', testImageUrl4)}
            onError={(e) => console.error('❌ IMG SVG Azul error:', testImageUrl4, e)}
          />
        </div>
      </div>
    </div>
  );
}
