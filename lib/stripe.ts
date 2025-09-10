// Configuración de Stripe para el frontend
import { loadStripe } from '@stripe/stripe-js';

// Cargar Stripe con la clave pública
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Configuración de apariencia de Stripe Elements
export const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#16a34a',
    colorBackground: '#ffffff',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: '"Inter", sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      backgroundColor: '#f9fafb',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      padding: '12px',
    },
    '.Input:focus': {
      borderColor: '#16a34a',
      boxShadow: '0 0 0 1px #16a34a',
    },
    '.Label': {
      fontWeight: '500',
      marginBottom: '6px',
    },
  },
}

// Configuración de elementos de pago
export const paymentElementOptions = {
  layout: 'tabs' as const,
  paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
}

export default stripePromise;
