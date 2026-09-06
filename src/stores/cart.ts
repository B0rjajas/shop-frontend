// src/stores/cart.ts
import { defineStore } from 'pinia';
import axios from '@/utils/axios';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
    loading: false,
  }),
  actions: {
    async fetchCart() {
      this.loading = true;
      try {
        const res = await axios.get('/api/shop/get');
        this.items = res.data.items || [];
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async addToCart(productId: number, quantity: number = 1) {
      await axios.post('/api/shop/add', { productId, quantity });
      await this.fetchCart();
    },
    async updateCart(items: any[]) {
      await axios.post('/api/shop/update', { items });
      await this.fetchCart();
    },
    async clearCart() {
      await axios.delete('/api/shop/clear');
      this.items = [];
    },
    async createCheckoutSession() {
      try {
        const res = await axios.post('/api/stripe/create-checkout-session', {});
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