import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

export const useStripeStore = defineStore('stripe', {
  actions: {
    async createCheckoutSession() {
      const userStore = useUserStore();

      try {
        const response = await axios.post(
          'http://localhost:3000/api/stripe/create-checkout-session',
          {}, // El backend obtiene el carrito del usuario autenticado
          {
            headers: {
              Authorization: `Bearer ${userStore.token}`,
            },
          }
        );

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