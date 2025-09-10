'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StripeCheckoutProps {
  rental: {
    _id: string;
    product: {
      title: string;
      images: string[];
    };
    totalPrice: number;
  };
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
          return_url: `${window.location.origin}/payments/success?rental_id=${rental._id}`,
        },
        redirect: 'if_required'
      });

      if (error) {
        setErrorMessage(error.message || 'Ocurrió un error al procesar el pago');
        console.error('Error en el pago:', error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirmar pago en nuestro backend
        try {
          const response = await fetch('/api/payments/confirm-payment', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id
            })
          });

          const data = await response.json();

          if (response.ok) {
            onSuccess(paymentIntent.id);
          } else {
            setErrorMessage(data.message || 'Error confirmando el pago');
          }
        } catch (confirmError) {
          console.error('Error confirmando pago:', confirmError);
          setErrorMessage('Error confirmando el pago en el servidor');
        }
      }
    } catch (err) {
      console.error('Error procesando pago:', err);
      setErrorMessage('Error inesperado. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del producto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📦 Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <img
              src={rental.product.images[0] || '/placeholder-product.svg'}
              alt={rental.product.title}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{rental.product.title}</h3>
              <p className="text-xl font-bold text-green-600">
                S/ {rental.totalPrice}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de pago Stripe */}
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Información de Pago</h3>
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
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Dirección de Facturación</h3>
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
      </div>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">❌ Error en el pago</p>
          <p className="text-sm mt-1">{errorMessage}</p>
        </div>
      )}

      {/* Información de seguridad */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🔒</span>
          <span>Tu información está protegida con encriptación de nivel bancario</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          ← Volver
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
            `💳 Pagar S/ ${rental.totalPrice}`
          )}
        </Button>
      </div>
    </form>
  );
}
