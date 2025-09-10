"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface StripeCheckoutProps {
  rental: any
  onSuccess: () => void
  onError: (error: string) => void
}

export function StripeCheckout({ rental, onSuccess, onError }: StripeCheckoutProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payments/success?rental_id=${rental._id}`,
        },
        redirect: "if_required"
      })

      if (error) {
        console.error('Payment error:', error)
        onError(error.message || 'Error al procesar el pago')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent)
        onSuccess()
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      onError('Error inesperado al procesar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>
      
      <div className="space-y-3">
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Procesando pago...
            </>
          ) : (
            `Pagar S/ ${rental.totalAmount}`
          )}
        </Button>
        
        <p className="text-xs text-center text-gray-500">
          Al hacer clic en "Pagar", aceptas nuestros términos y condiciones
        </p>
      </div>
    </form>
  )
}
