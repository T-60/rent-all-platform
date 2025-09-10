'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const rentalId = searchParams.get('rental_id');

  useEffect(() => {
    if (rentalId) {
      fetchRentalDetails();
    }
  }, [rentalId]);

  const fetchRentalDetails = async () => {
    try {
      const response = await fetch(`/api/rentals/${rentalId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRental(data.rental);
      }
    } catch (error) {
      console.error('Error fetching rental:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Verificando tu pago...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Mensaje de éxito */}
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h1 className="text-3xl font-bold text-green-600">
            ¡Pago Confirmado!
          </h1>
          <p className="text-gray-600 text-lg">
            Tu pago ha sido procesado exitosamente
          </p>
        </div>

        {/* Detalles del alquiler */}
        {rental && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Detalles del Alquiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={rental.product?.images?.[0] || '/placeholder-product.svg'}
                  alt={rental.product?.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{rental.product?.title}</h3>
                  <p className="text-sm text-gray-600">
                    Propietario: {rental.product?.owner?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    S/ {rental.totalPrice}
                  </p>
                  <Badge variant="default" className="bg-green-600">
                    💰 Pagado
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de inicio:</span>
                  <span className="font-medium">
                    {new Date(rental.startDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de fin:</span>
                  <span className="font-medium">
                    {new Date(rental.endDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">
                    {rental.totalDays} {rental.totalDays === 1 ? 'día' : 'días'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Próximos pasos */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">1.</span>
              <div>
                <p className="font-semibold">El propietario ha sido notificado</p>
                <p className="text-sm text-gray-600">
                  Recibirá una notificación de que el pago fue exitoso
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <div>
                <p className="font-semibold">Coordinación de entrega</p>
                <p className="text-sm text-gray-600">
                  El propietario contactará contigo para programar la entrega
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">3.</span>
              <div>
                <p className="font-semibold">Chat disponible</p>
                <p className="text-sm text-gray-600">
                  Puedes chatear con el propietario desde tu dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Button
            onClick={() => router.push('/dashboard')}
            className="flex-1"
          >
            📊 Ir al Dashboard
          </Button>
          <Button
            onClick={() => router.push('/profile')}
            variant="outline"
            className="flex-1"
          >
            👤 Ver mis Alquileres
          </Button>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">ℹ️</span>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Información importante:</p>
              <ul className="space-y-1">
                <li>• Recibirás un email de confirmación del pago</li>
                <li>• Puedes ver todos los detalles en tu dashboard</li>
                <li>• El chat con el propietario ya está disponible</li>
                <li>• Recuerda cuidar bien el producto durante el alquiler</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
