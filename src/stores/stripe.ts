import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useStripeStore = defineStore('stripe', {
  actions: {
    async createCheckoutSession() {
      const userStore = useUserStore();
      try {
        const response = await axios.post(
          `${API_URL}/api/stripe/create-checkout-session`,
          {},
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