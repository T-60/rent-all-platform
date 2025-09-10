# 🚀 GUÍA STRIPE SETUP PARA RENT-ALL

## 📝 **PASO 1: REGISTRO STRIPE (SIN EMPRESA)**

### 1. **Ir a Stripe:**
```
https://dashboard.stripe.com/register
```

### 2. **Datos requeridos:**
```
✅ Email personal
✅ Nombre completo
✅ País: Perú
✅ Contraseña
❌ NO requiere RUC inicialmente
```

### 3. **Activar modo desarrollador:**
```
Dashboard > Developers > API Keys
├── Publishable key (público)
├── Secret key (privado)
└── Ambos en modo TEST
```

---

## 💻 **PASO 2: INSTALACIÓN EN PROYECTO**

### **Frontend:**
```bash
npm install @stripe/stripe-js
```

### **Backend:**
```bash
npm install stripe
```

---

## 🔧 **PASO 3: CONFIGURACIÓN**

### **1. Variables de entorno (.env):**
```env
# Stripe Keys (TEST MODE)
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### **2. Frontend - Checkout Component:**
```typescript
// components/StripeCheckout.tsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function StripeCheckout({ rental, amount }) {
  const handlePayment = async () => {
    const stripe = await stripePromise;
    
    // Crear payment intent
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount * 100, // Stripe usa centavos
        rentalId: rental.id,
        currency: 'pen'
      })
    });
    
    const { clientSecret } = await response.json();
    
    // Redirigir a Stripe Checkout
    const { error } = await stripe!.redirectToCheckout({
      sessionId: clientSecret
    });
    
    if (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="stripe-checkout">
      <h3>Pagar con Tarjeta</h3>
      <p>Monto: S/ {amount}</p>
      <button 
        onClick={handlePayment}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Pagar S/ {amount}
      </button>
    </div>
  );
}
```

### **3. Backend - Payment Intent:**
```javascript
// backend/routes/payments.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-intent', async (req, res) => {
  try {
    const { amount, rentalId, currency = 'pen' } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        rentalId
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook para confirmar pagos
router.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const rentalId = paymentIntent.metadata.rentalId;
      
      // Confirmar alquiler
      confirmRental(rentalId);
    }
    
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
```

---

## 🎮 **PASO 4: MODO DEMO (SIN DINERO REAL)**

### **Alternativa local para demos:**
```typescript
// components/DemoPayment.tsx
export function DemoPayment({ rental, amount, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleDemoPayment = async () => {
    setIsProcessing(true);
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // "Confirmar" pago
    await fetch('/api/rentals/confirm-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rentalId: rental.id })
    });
    
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="demo-payment">
      <h3>💳 Pago Simulado (DEMO)</h3>
      <div className="payment-details">
        <p>Producto: {rental.product.title}</p>
        <p>Monto: S/ {amount}</p>
        <p className="text-yellow-600">
          ⚠️ Este es un pago simulado para demostración
        </p>
      </div>
      
      <button 
        onClick={handleDemoPayment}
        disabled={isProcessing}
        className="bg-green-500 text-white px-6 py-3 rounded-lg"
      >
        {isProcessing ? (
          <span>🔄 Procesando pago...</span>
        ) : (
          <span>✅ Confirmar Pago Demo</span>
        )}
      </button>
    </div>
  );
}
```

---

## 🧪 **PASO 5: TESTING CON TARJETAS FICTICIAS**

### **Tarjetas de prueba Stripe:**
```
Visa exitosa: 4242 4242 4242 4242
Visa con error: 4000 0000 0000 0002
Mastercard: 5555 5555 5555 4444
Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos
```

---

## 📱 **PASO 6: INTEGRACIÓN EN RENT-ALL**

### **1. En el flujo de alquiler:**
```typescript
// pages/products/[id]/rent.tsx
export default function RentProduct() {
  const [paymentMethod, setPaymentMethod] = useState('demo');
  
  return (
    <div>
      <h2>Confirmar Alquiler</h2>
      
      {/* Selector de método de pago */}
      <div className="payment-methods">
        <label>
          <input 
            type="radio" 
            value="demo" 
            checked={paymentMethod === 'demo'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          💳 Pago Demo (Presentación)
        </label>
        
        <label>
          <input 
            type="radio" 
            value="stripe" 
            checked={paymentMethod === 'stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          💳 Pago Real (Stripe)
        </label>
      </div>
      
      {/* Componente de pago */}
      {paymentMethod === 'demo' ? (
        <DemoPayment rental={rental} amount={totalAmount} />
      ) : (
        <StripeCheckout rental={rental} amount={totalAmount} />
      )}
    </div>
  );
}
```

---

## 🎯 **VENTAJAS PARA TU PROYECTO**

### ✅ **Para presentación:**
- Funciona sin empresa
- No requiere validaciones complejas
- Demostración realista
- Sin costos de setup

### ✅ **Para futuro:**
- Fácil migración a producción
- Código ya preparado
- Solo cambiar a keys reales
- Escalable profesionalmente

---

## 🚀 **TIMELINE SUGERIDO**

### **Hoy (Día 1):**
- Registro en Stripe (15 min)
- Setup básico del proyecto (1 hora)

### **Mañana (Día 2):**
- Implementar componentes de pago (2 horas)
- Testing con tarjetas demo (30 min)

### **Día 3:**
- Integrar con flujo de alquiler (1 hora)
- Preparar demo para presentación (30 min)

**¡En 3 días tienes una pasarela de pagos funcionando perfectamente para tu demo!** 🚀
