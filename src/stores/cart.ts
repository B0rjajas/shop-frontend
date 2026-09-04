import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
    loading: false,
  }),
  actions: {
    getAuthHeaders() {
      const userStore = useUserStore();
      return { Authorization: `Bearer ${userStore.token}` };
    },
    async fetchCart() {
      this.loading = true;
      try {
        const res = await axios.get(`${API_URL}/api/shop/get`, {
          headers: this.getAuthHeaders(),
        });
        this.items = res.data.items || [];
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async addToCart(productId: number, quantity: number = 1) {
      await axios.post(
        `${API_URL}/api/shop/add`,
        { productId, quantity },
        { headers: this.getAuthHeaders() }
      );
      await this.fetchCart();
    },
    async updateCart(items: any[]) {
      await axios.post(
        `${API_URL}/api/shop/update`,
        { items },
        { headers: this.getAuthHeaders() }
      );
      await this.fetchCart();
    },
    async clearCart() {
      await axios.delete(`${API_URL}/api/shop/clear`, {
        headers: this.getAuthHeaders(),
      });
      this.items = [];
    },
    async createCheckoutSession() {
      console.log('Creando sesión de pago...');
      const headers = this.getAuthHeaders();
      console.log('Token enviado a Stripe:', headers);
      try {
        const res = await axios.post(
          `${API_URL}/api/stripe/create-checkout-session`,
          {},
          { headers: this.getAuthHeaders() }
        );
        return res.data;
      } catch (error) {
        console.error('Error al crear sesión de Stripe:', error);
        throw error;
      }
    },
  },
  getters: {
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce(
        (acc, item) => acc + (item.product.discounted_price || item.product.price) * item.quantity,
        0
      ),
  },
});