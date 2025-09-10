# 💳 FLUJO DE PAGOS STRIPE PARA RENT-ALL

## 🎯 **FLUJO COMPLETO DEL SISTEMA DE PAGOS**

### **🔄 PROCESO PASO A PASO:**

```
1. SELECCIÓN DE PRODUCTO
   ├── Usuario navega productos
   ├── Elige fechas de alquiler
   ├── Sistema calcula precio total
   └── Click "Alquilar Ahora"

2. DATOS DEL ALQUILER
   ├── Formulario de detalles
   ├── Términos y condiciones
   ├── Resumen de costos
   └── Click "Proceder al Pago"

3. PASARELA STRIPE
   ├── Checkout seguro de Stripe
   ├── Datos de tarjeta encriptados
   ├── Validación en tiempo real
   └── Confirmación de pago

4. CONFIRMACIÓN AUTOMÁTICA
   ├── Webhook de Stripe
   ├── Actualización de estado
   ├── Notificaciones automáticas
   └── Habilitación del chat

5. GESTIÓN POST-PAGO
   ├── Dashboard actualizado
   ├── Comunicación directa
   ├── Seguimiento de entrega
   └── Sistema de calificaciones
```

---

## 🏗️ **ARQUITECTURA TÉCNICA**

### **FRONTEND (Next.js):**
```
components/payments/
├── CheckoutForm.tsx          # Formulario principal
├── StripeCheckout.tsx        # Integración Stripe
├── PaymentSummary.tsx        # Resumen de pago
├── PaymentSuccess.tsx        # Página de éxito
├── PaymentMethods.tsx        # Selector de métodos
└── PriceCalculator.tsx       # Calculadora de precios

pages/
├── products/[id]/rent.tsx    # Página de alquiler
├── payments/success.tsx      # Confirmación
├── payments/cancel.tsx       # Cancelación
└── dashboard/payments.tsx    # Historial
```

### **BACKEND (Express):**
```
routes/
├── payments.js               # Rutas de pagos
├── webhooks.js              # Webhooks Stripe
└── rentals.js               # Gestión alquileres

models/
├── Payment.js               # Schema de pagos
├── Transaction.js           # Transacciones
└── PaymentMethod.js         # Métodos guardados

services/
├── StripeService.js         # Lógica Stripe
├── PaymentProcessor.js      # Procesamiento
└── NotificationService.js   # Notificaciones
```

---

## 💻 **IMPLEMENTACIÓN DETALLADA**

### **1. INSTALACIÓN Y SETUP**

```bash
# Frontend
npm install @stripe/stripe-js @stripe/react-stripe-js

# Backend
npm install stripe express-validator
```

### **2. CONFIGURACIÓN STRIPE**

```javascript
// lib/stripe.ts (Frontend)
import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// backend/config/stripe.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
```

### **3. VARIABLES DE ENTORNO**

```env
# .env.local (Frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001

# .env (Backend)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🔧 **COMPONENTES PRINCIPALES**

### **CheckoutForm.tsx - Formulario Principal:**

```typescript
'use client';

import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import { StripeCheckout } from './StripeCheckout';
import { PaymentSummary } from './PaymentSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CheckoutFormProps {
  rental: {
    id: string;
    product: {
      id: string;
      title: string;
      pricePerDay: number;
      images: string[];
      owner: {
        name: string;
        avatar?: string;
      };
    };
    startDate: string;
    endDate: string;
    totalDays: number;
    totalAmount: number;
    depositAmount: number;
  };
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

export function CheckoutForm({ rental, onSuccess, onCancel }: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId: rental.id,
          amount: Math.round(rental.totalAmount * 100), // Centavos
          currency: 'pen'
        })
      });

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Resumen del pedido */}
      <div>
        <PaymentSummary rental={rental} />
      </div>

      {/* Formulario de pago */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💳 Pago Seguro
              <span className="text-sm font-normal text-gray-500">
                Powered by Stripe
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {!clientSecret ? (
              <button
                onClick={createPaymentIntent}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Preparando pago...' : `Pagar S/ ${rental.totalAmount}`}
              </button>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckout
                  rental={rental}
                  onSuccess={onSuccess}
                  onCancel={onCancel}
                />
              </Elements>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### **StripeCheckout.tsx - Integración Stripe:**

```typescript
import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

interface StripeCheckoutProps {
  rental: any;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

export function StripeCheckout({ rental, onSuccess, onCancel }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payments/success?rental_id=${rental.id}`,
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message || 'Ocurrió un error al procesar el pago');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setErrorMessage('Error inesperado. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del producto */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <img
            src={rental.product.images[0]}
            alt={rental.product.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h3 className="font-semibold">{rental.product.title}</h3>
            <p className="text-sm text-gray-600">
              {rental.startDate} - {rental.endDate}
            </p>
            <p className="text-lg font-bold text-green-600">
              S/ {rental.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de pago Stripe */}
      <div className="space-y-4">
        <PaymentElement 
          options={{
            layout: 'tabs',
            defaultValues: {
              billingDetails: {
                address: {
                  country: 'PE'
                }
              }
            }
          }}
        />
        
        <AddressElement
          options={{
            mode: 'billing',
            defaultValues: {
              address: {
                country: 'PE'
              }
            }
          }}
        />
      </div>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando...
            </span>
          ) : (
            `Confirmar Pago - S/ ${rental.totalAmount}`
          )}
        </Button>
      </div>

      {/* Información de seguridad */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>🔒 Pago seguro procesado por Stripe</p>
        <p>Tus datos están protegidos con encriptación de nivel bancario</p>
      </div>
    </form>
  );
}
```

---

## 🚀 **BACKEND - PAYMENT INTENT & WEBHOOKS**

### **Payment Intent Creation:**

```javascript
// backend/routes/payments.js
const express = require('express');
const stripe = require('../config/stripe');
const Rental = require('../models/Rental');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Crear Payment Intent
router.post('/create-intent', authMiddleware, async (req, res) => {
  try {
    const { rentalId, amount, currency = 'pen' } = req.body;
    const userId = req.user.id;

    // Verificar que el alquiler existe y pertenece al usuario
    const rental = await Rental.findById(rentalId)
      .populate('product renter owner');

    if (!rental) {
      return res.status(404).json({ error: 'Alquiler no encontrado' });
    }

    if (rental.renter._id.toString() !== userId) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ya viene en centavos
      currency,
      metadata: {
        rentalId: rental._id.toString(),
        userId: userId,
        productTitle: rental.product.title
      },
      description: `Alquiler: ${rental.product.title}`
    });

    // Guardar Payment Intent ID en el alquiler
    rental.paymentIntentId = paymentIntent.id;
    await rental.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Error al crear la intención de pago',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
```

### **Webhook Handler:**

```javascript
// backend/routes/webhooks.js
const express = require('express');
const stripe = require('../config/stripe');
const Rental = require('../models/Rental');
const NotificationService = require('../services/NotificationService');

const router = express.Router();

// Webhook endpoint para Stripe
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar diferentes tipos de eventos
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

async function handlePaymentSuccess(paymentIntent) {
  try {
    const rentalId = paymentIntent.metadata.rentalId;
    
    const rental = await Rental.findById(rentalId)
      .populate('product renter owner');

    if (rental) {
      // Actualizar estado del alquiler
      rental.status = 'confirmed';
      rental.paymentStatus = 'paid';
      rental.transactionId = paymentIntent.id;
      rental.confirmedAt = new Date();
      
      await rental.save();

      // Enviar notificaciones
      await NotificationService.sendRentalConfirmed(rental);
      
      console.log(`✅ Alquiler ${rentalId} confirmado tras pago exitoso`);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent) {
  try {
    const rentalId = paymentIntent.metadata.rentalId;
    
    const rental = await Rental.findById(rentalId);
    if (rental) {
      rental.status = 'payment_failed';
      rental.paymentStatus = 'failed';
      await rental.save();
      
      console.log(`❌ Pago falló para alquiler ${rentalId}`);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

module.exports = router;
```

---

## 🎯 **FLUJO COMPLETO EN LA UI**

### **Página de Alquiler:**

```typescript
// pages/products/[id]/rent.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutForm } from '@/components/payments/CheckoutForm';
import { calculateRentalCost } from '@/lib/pricing';

export default function RentProductPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [rental, setRental] = useState(null);
  const [product, setProduct] = useState(null);
  const router = useRouter();

  // Cargar producto
  useEffect(() => {
    fetchProduct(params.id);
  }, [params.id]);

  const handleCreateRental = async (rentalData) => {
    try {
      const response = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: params.id,
          ...rentalData
        })
      });

      if (response.ok) {
        const newRental = await response.json();
        setRental(newRental);
        setStep('payment');
      }
    } catch (error) {
      console.error('Error creating rental:', error);
    }
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setStep('success');
    // Redirigir al dashboard después de 3 segundos
    setTimeout(() => {
      router.push('/dashboard/rentals');
    }, 3000);
  };

  if (step === 'payment' && rental) {
    return (
      <CheckoutForm
        rental={rental}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setStep('details')}
      />
    );
  }

  if (step === 'success') {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-6xl">✅</div>
          <h1 className="text-3xl font-bold text-green-600">
            ¡Pago Confirmado!
          </h1>
          <p className="text-gray-600">
            Tu alquiler ha sido confirmado exitosamente. 
            El propietario ha sido notificado.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              💬 Ahora puedes chatear con el propietario para coordinar la entrega
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Resto del componente para step 'details'...
}
```

---

## ✅ **CONFIGURACIÓN PARA PRODUCCIÓN**

### **1. Registro en Stripe:**
```
1. Ir a stripe.com
2. "Start now" con email personal
3. Verificar email
4. Completar perfil básico
5. Activar modo LIVE cuando esté listo
```

### **2. Webhook Configuration:**
```
Stripe Dashboard > Developers > Webhooks
├── Endpoint URL: https://tu-dominio.com/api/webhooks/stripe
├── Events: payment_intent.succeeded, payment_intent.payment_failed
└── Copiar webhook secret
```

### **3. Variables de Producción:**
```env
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

¿Quieres que empecemos con la implementación? **Con este diseño tendrás un sistema de pagos completamente funcional y profesional** que puede manejar transacciones reales desde el primer día! 🚀
