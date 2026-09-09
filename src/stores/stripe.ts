// src/stores/stripe.ts
import { defineStore } from 'pinia';
import axios from '@/utils/axios';

export const useStripeStore = defineStore('stripe', {
  actions: {
    // 🔥 Ahora recibe la dirección como parámetro
    async createCheckoutSession(address: string) {
      try {
        const response = await axios.post('/api/stripe/create-checkout-session', {
          address // Enviamos la dirección al backend
        });
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      } catch (error) {
        console.error('Error creando sesión de pago:', error);
        throw error;
      }
    },
  },
});