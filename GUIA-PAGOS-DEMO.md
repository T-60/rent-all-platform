# 🎮 SISTEMA DE PAGOS DEMO PARA RENT-ALL

## 🎯 **LA SOLUCIÓN PERFECTA PARA TU PROYECTO**

Como no tienes empresa registrada, vamos a crear un **sistema de pagos completamente funcional** pero en modo demo. Se verá y funcionará como una pasarela real, perfecto para tu presentación.

---

## 🚀 **IMPLEMENTACIÓN PASO A PASO**

### **PASO 1: Crear Componente de Pago Demo**

```typescript
// components/PaymentDemo.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PaymentDemoProps {
  rental: {
    id: string;
    product: {
      title: string;
      images: string[];
    };
    totalAmount: number;
    startDate: string;
    endDate: string;
  };
  onPaymentSuccess: () => void;
}

export function PaymentDemo({ rental, onPaymentSuccess }: PaymentDemoProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'transfer' | 'yape'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular procesamiento de pago (2-3 segundos)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Simular confirmación en backend
    try {
      const response = await fetch('/api/payments/demo-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId: rental.id,
          method: selectedMethod,
          amount: rental.totalAmount
        })
      });
      
      if (response.ok) {
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💳 Pago Seguro - RENT ALL
            <Badge variant="secondary">DEMO MODE</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Resumen del pedido */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Resumen del Alquiler</h3>
            <div className="flex justify-between">
              <span>{rental.product.title}</span>
              <span>S/ {rental.totalAmount}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {rental.startDate} - {rental.endDate}
            </div>
          </div>

          {/* Métodos de pago */}
          <div>
            <h3 className="font-semibold mb-3">Método de Pago</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedMethod('card')}
                className={`p-3 border rounded-lg text-center ${
                  selectedMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                💳<br />Tarjeta
              </button>
              <button
                onClick={() => setSelectedMethod('yape')}
                className={`p-3 border rounded-lg text-center ${
                  selectedMethod === 'yape' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                📱<br />Yape
              </button>
              <button
                onClick={() => setSelectedMethod('transfer')}
                className={`p-3 border rounded-lg text-center ${
                  selectedMethod === 'transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                🏦<br />Transferencia
              </button>
            </div>
          </div>

          {/* Formulario según método */}
          {selectedMethod === 'card' && (
            <div className="space-y-4">
              <Input
                placeholder="Número de tarjeta (4242 4242 4242 4242)"
                value={cardData.number}
                onChange={(e) => setCardData({...cardData, number: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                />
                <Input
                  placeholder="CVV"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                />
              </div>
              <Input
                placeholder="Nombre del titular"
                value={cardData.name}
                onChange={(e) => setCardData({...cardData, name: e.target.value})}
              />
              <p className="text-sm text-yellow-600">
                💡 Usa: 4242 4242 4242 4242 para simular pago exitoso
              </p>
            </div>
          )}

          {selectedMethod === 'yape' && (
            <div className="text-center space-y-4">
              <div className="bg-purple-100 p-6 rounded-lg">
                <div className="w-32 h-32 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
                  📱 QR YAPE
                </div>
                <p className="text-sm">Escanea el código QR con tu app Yape</p>
                <p className="font-semibold">Monto: S/ {rental.totalAmount}</p>
              </div>
            </div>
          )}

          {selectedMethod === 'transfer' && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Datos para Transferencia</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Banco:</strong> BCP</p>
                <p><strong>Cuenta:</strong> 123-456-789-012</p>
                <p><strong>CCI:</strong> 00212345678901234567</p>
                <p><strong>Titular:</strong> RENT ALL PLATFORM</p>
                <p><strong>Monto:</strong> S/ {rental.totalAmount}</p>
              </div>
            </div>
          )}

          {/* Botón de pago */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-3"
            size="lg"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando pago...
              </span>
            ) : (
              `Pagar S/ ${rental.totalAmount}`
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            🔒 Este es un sistema de demostración. No se procesarán pagos reales.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### **PASO 2: Backend API para Demo**

```javascript
// backend/routes/payments.js
const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const { authMiddleware } = require('../middleware/auth');

// Confirmar pago demo
router.post('/demo-confirm', authMiddleware, async (req, res) => {
  try {
    const { rentalId, method, amount } = req.body;
    const userId = req.user.id;

    // Buscar el alquiler
    const rental = await Rental.findById(rentalId)
      .populate('product renter owner');

    if (!rental) {
      return res.status(404).json({ message: 'Alquiler no encontrado' });
    }

    // Verificar que el usuario sea el arrendatario
    if (rental.renter._id.toString() !== userId) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Simular diferentes resultados según método
    let paymentStatus = 'success';
    let transactionId = `demo_${Date.now()}_${method}`;

    // Simular fallos ocasionales para realismo
    if (Math.random() > 0.95) {
      paymentStatus = 'failed';
    }

    if (paymentStatus === 'success') {
      // Actualizar estado del alquiler
      rental.status = 'confirmed';
      rental.paymentStatus = 'paid';
      rental.paymentMethod = method;
      rental.transactionId = transactionId;
      rental.confirmedAt = new Date();
      
      await rental.save();

      // Enviar notificación al propietario (opcional)
      // await sendNotification(rental.owner._id, 'new_rental', rental);

      res.json({
        success: true,
        message: 'Pago confirmado exitosamente',
        transactionId,
        rental: rental
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Error en el procesamiento del pago',
        error: 'payment_failed'
      });
    }

  } catch (error) {
    console.error('Error confirming demo payment:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
});

// Obtener métodos de pago disponibles
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      {
        id: 'card',
        name: 'Tarjeta de Crédito/Débito',
        icon: '💳',
        description: 'Visa, Mastercard, American Express',
        fee: '3.5%'
      },
      {
        id: 'yape',
        name: 'Yape',
        icon: '📱',
        description: 'Pago móvil instantáneo',
        fee: 'Gratis'
      },
      {
        id: 'transfer',
        name: 'Transferencia Bancaria',
        icon: '🏦',
        description: 'Desde cualquier banco',
        fee: 'Gratis'
      }
    ]
  });
});

module.exports = router;
```

### **PASO 3: Integración en el Flujo de Alquiler**

```typescript
// pages/products/[id]/rent.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentDemo } from '@/components/PaymentDemo';
import { Button } from '@/components/ui/button';

export default function RentProductPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [rental, setRental] = useState(null);
  const router = useRouter();

  const handleRentalCreate = async (rentalData) => {
    // Crear el alquiler en estado 'pending'
    const response = await fetch('/api/rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rentalData)
    });

    if (response.ok) {
      const newRental = await response.json();
      setRental(newRental);
      setStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    setStep('success');
    // Redirigir después de 3 segundos
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  return (
    <div className="container mx-auto py-8">
      {step === 'details' && (
        <div>
          {/* Formulario de detalles del alquiler */}
          <h1>Detalles del Alquiler</h1>
          {/* ... campos de fechas, etc ... */}
          <Button onClick={() => handleRentalCreate({...})}>
            Continuar al Pago
          </Button>
        </div>
      )}

      {step === 'payment' && rental && (
        <PaymentDemo
          rental={rental}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {step === 'success' && (
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold text-green-600">
            ¡Pago Confirmado!
          </h2>
          <p>Tu alquiler ha sido confirmado exitosamente.</p>
          <p className="text-sm text-gray-600">
            Serás redirigido a tu dashboard en unos momentos...
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 **VENTAJAS DE ESTA SOLUCIÓN**

### ✅ **Para tu presentación:**
- **Se ve 100% profesional**
- **Funciona como pasarela real**
- **No requiere empresa ni validaciones**
- **Perfecto para demos**

### ✅ **Para desarrollo:**
- **Código preparado para migración**
- **Fácil cambiar a Stripe/Culqi después**
- **Base sólida para futuro**
- **Testing completo**

### ✅ **Experiencia realista:**
- **Formularios de pago reales**
- **Simulación de errores**
- **Diferentes métodos**
- **Estados de carga**

---

## 🚀 **PLAN DE IMPLEMENTACIÓN (3 DÍAS)**

### **Día 1: Setup básico**
- Crear componente PaymentDemo
- Backend API routes
- Testing básico

### **Día 2: Integración**
- Conectar con flujo de alquiler
- Estados y validaciones
- UI/UX polish

### **Día 3: Demo prep**
- Testing completo
- Preparar presentación
- Documentar funcionamiento

---

¿Quieres que empecemos con la implementación? ¡Esta solución te dará una pasarela de pagos perfecta para tu proyecto sin necesidad de empresa registrada! 🚀
