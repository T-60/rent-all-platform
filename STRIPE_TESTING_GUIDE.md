# 🧪 GUÍA DE TESTING - STRIPE PAYMENTS

## ⚡ CONFIGURACIÓN RÁPIDA

### 1. Obtener Claves de Stripe (Test Mode)
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/test/developers)
2. En "API Keys", copia:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### 2. Configurar Variables de Entorno
Crea `.env.local` en la raíz del proyecto:
```bash
# Claves de Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret_aqui
```

### 3. Configurar Webhook (Para Testing Completo)
1. En Stripe Dashboard → **Webhooks** → **Add endpoint**
2. URL: `http://localhost:3001/api/webhooks/stripe`
3. Eventos a escuchar:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copia el **Signing secret** al `.env.local`

## 🔧 TESTING LOCAL

### Paso 1: Iniciar Servicios
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd rent-all-platform
npm run dev
```

### Paso 2: Crear Alquiler de Test
1. **Login** como usuario
2. **Buscar producto** en Dashboard
3. **Solicitar alquiler** con fechas válidas
4. **Cambiar a propietario** (otro usuario/cuenta)
5. **Confirmar alquiler** en perfil → estado `confirmed`

### Paso 3: Probar Pago
1. **Volver al usuario inquilino**
2. **Ir a Perfil** → Tab "Mis Alquileres"
3. **Verificar alquiler confirmado** muestra:
   - Badge: "Confirmado"
   - Badge: "⏳ Pago pendiente"
   - Botón: "💳 Pagar"
4. **Hacer clic en "💳 Pagar"**

### Paso 4: Procesar Pago
1. **Modal se abre** con resumen del alquiler
2. **Clic en "Inicializar Pago"**
3. **Formulario de tarjeta aparece**
4. **Usar tarjeta de test**:
   - Número: `4242 4242 4242 4242`
   - Fecha: Cualquier fecha futura
   - CVC: Cualquier 3 dígitos
   - ZIP: Cualquier código postal
5. **Clic en "Pagar S/ [monto]"**

## 🧪 TARJETAS DE TEST

### ✅ Pago Exitoso
- `4242 4242 4242 4242` - Visa
- `5555 5555 5555 4444` - Mastercard
- `3782 822463 10005` - American Express

### ❌ Pago Fallido
- `4000 0000 0000 0002` - Generic decline
- `4000 0000 0000 9995` - Insufficient funds
- `4000 0000 0000 9987` - Lost card

### ⏳ Requiere Autenticación
- `4000 0025 0000 3155` - 3D Secure authentication

## ✅ VERIFICACIONES DE TESTING

### Frontend
- [ ] Modal de pago se abre correctamente
- [ ] Resumen del alquiler muestra información correcta
- [ ] Formulario de Stripe carga sin errores
- [ ] Botón de pago muestra monto correcto
- [ ] Estados de carga funcionan
- [ ] Mensajes de error se muestran apropiadamente

### Backend
- [ ] Payment Intent se crea con monto correcto
- [ ] Webhook recibe eventos de Stripe
- [ ] Estado del alquiler se actualiza correctamente
- [ ] paymentStatus cambia de 'pending' a 'paid'
- [ ] Logs del servidor muestran procesamiento correcto

### Flujo Completo
- [ ] Badge cambia de "⏳ Pago pendiente" a "✓ Pagado"
- [ ] Propietario puede programar entrega después del pago
- [ ] Botón "💳 Pagar" desaparece tras pago exitoso
- [ ] Estados persisten tras recargar página

## 🐛 DEBUGGING

### Logs a Revistar
```bash
# Backend - Verificar procesamiento
console.log('Payment Intent created:', paymentIntent)
console.log('Webhook received:', event.type)
console.log('Rental updated:', updatedRental)

# Frontend - Verificar estados
console.log('Client secret received:', clientSecret)
console.log('Payment success:', paymentIntent)
console.log('Rental state updated:', rental)
```

### URLs de Verificación
- **Stripe Dashboard**: [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
- **Webhook Logs**: [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
- **Payment Intents**: [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)

## 🚨 PROBLEMAS COMUNES

### Error: "Stripe key not found"
- ✅ Verificar `.env.local` existe y tiene las claves
- ✅ Reiniciar servidor after agregar variables

### Error: "Payment Intent creation failed"
- ✅ Verificar conexión a base de datos
- ✅ Verificar que el alquiler existe y está en estado 'confirmed'
- ✅ Verificar clave secreta de Stripe es correcta

### Error: "Webhook signature verification failed"  
- ✅ Verificar STRIPE_WEBHOOK_SECRET en `.env.local`
- ✅ Verificar URL del webhook en Stripe Dashboard
- ✅ Verificar que el endpoint recibe raw body

### Payment no actualiza estado
- ✅ Verificar webhook está configurado y funcionando
- ✅ Verificar logs del servidor para errores de webhook
- ✅ Verificar que el evento correcto se está enviando

---

**🎯 TESTING EXITOSO**
Si todos los pasos funcionan, la integración de Stripe está completa y lista para presentación.
