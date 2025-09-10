'use client';

import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '@/lib/stripe';
import { StripeCheckout } from './StripeCheckout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface PaymentCheckoutProps {
  rental: {
    _id: string;
    product: {
      _id: string;
      title: string;
      images: string[];
      owner: {
        name: string;
        avatar?: string;
      };
    };
    startDate: string;
    endDate: string;
    totalDays: number;
    totalPrice: number;
    status: string;
    paymentStatus: string;
  };
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

export function PaymentCheckout({ rental, onSuccess, onCancel }: PaymentCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const createPaymentIntent = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rentalId: rental._id,
          amount: rental.totalPrice
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error creating payment intent');
      }

      setClientSecret(data.clientSecret);
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      setError(error.message || 'Error al preparar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">💳 Pago Seguro</h1>
        <p className="text-gray-600">
          Completa tu pago para confirmar el alquiler
        </p>
        <Badge variant="secondary" className="text-xs">
          🔒 Protegido por Stripe
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumen del pedido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Resumen del Alquiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Producto */}
            <div className="flex items-center gap-3">
              <img
                src={rental.product.images[0] || '/placeholder-product.svg'}
                alt={rental.product.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{rental.product.title}</h3>
                <p className="text-sm text-gray-600">
                  Propietario: {rental.product.owner.name}
                </p>
              </div>
            </div>

            <Separator />

            {/* Fechas */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha de inicio:</span>
                <span className="font-medium">{formatDate(rental.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha de fin:</span>
                <span className="font-medium">{formatDate(rental.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duración:</span>
                <span className="font-medium">
                  {rental.totalDays} {rental.totalDays === 1 ? 'día' : 'días'}
                </span>
              </div>
            </div>

            <Separator />

            {/* Precio */}
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total a pagar:</span>
                <span className="text-green-600">S/ {rental.totalPrice}</span>
              </div>
            </div>

            {/* Estado */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Estado:</span>
              <Badge variant={rental.status === 'confirmed' ? 'default' : 'secondary'}>
                {rental.status === 'confirmed' ? '✅ Confirmado' : rental.status}
              </Badge>
              <Badge variant={rental.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                {rental.paymentStatus === 'paid' ? '💰 Pagado' : '⏳ Pendiente de pago'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💳 Método de Pago
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!clientSecret ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    ℹ️ Información del Pago
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Procesamiento seguro con Stripe</li>
                    <li>• Acepta tarjetas Visa, Mastercard, etc.</li>
                    <li>• Tu dinero está protegido</li>
                    <li>• Solo se cobra si el pago es exitoso</li>
                  </ul>
                </div>

                <Button
                  onClick={createPaymentIntent}
                  disabled={isLoading}
                  className="w-full py-3 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Preparando pago...
                    </span>
                  ) : (
                    `Proceder al Pago - S/ ${rental.totalPrice}`
                  )}
                </Button>

                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#16a34a',
                    }
                  }
                }}
              >
                <StripeCheckout
                  rental={rental}
                  onSuccess={onSuccess}
                  onCancel={() => {
                    setClientSecret('');
                    onCancel();
                  }}
                />
              </Elements>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
