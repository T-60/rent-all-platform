"use client"

import { useState, useEffect } from "react"

interface SimpleTestImageProps {
  testUrl: string
  title: string
}

export function SimpleTestImage({ testUrl, title }: SimpleTestImageProps) {
  const [status, setStatus] = useState('loading');
  
  useEffect(() => {
    async function testImage() {
      try {
        console.log(`🧪 [SimpleTest] Testing ${title}:`, testUrl);
        
        // Test 1: Fetch HEAD
        const headResponse = await fetch(testUrl, { method: 'HEAD', mode: 'cors' });
        console.log(`🧪 [SimpleTest] ${title} HEAD:`, headResponse.status, headResponse.headers.get('content-type'));
        
        // Test 2: Fetch GET  
        const getResponse = await fetch(testUrl, { method: 'GET', mode: 'cors' });
        console.log(`🧪 [SimpleTest] ${title} GET:`, getResponse.status, getResponse.size);
        
        setStatus('fetch-ok');
      } catch (error) {
        console.error(`🧪 [SimpleTest] ${title} fetch error:`, error);
        setStatus('fetch-error');
      }
    }
    
    testImage();
  }, [testUrl, title]);
  
  return (
    <div className="border p-2">
      <p className="text-xs font-bold">{title}</p>
      <p className="text-xs text-gray-600">Status: {status}</p>
      <img 
        src={testUrl}
        alt={title}
        className="w-full h-16 object-cover mt-1"
        onLoad={() => {
          console.log(`🧪 [SimpleTest] ${title} IMG loaded successfully`);
          setStatus('img-loaded');
        }}
        onError={(e) => {
          console.error(`🧪 [SimpleTest] ${title} IMG error:`, e);
          setStatus('img-error');
        }}
      />
    </div>
  );
}
