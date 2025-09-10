// Configuración de Stripe para el backend
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
