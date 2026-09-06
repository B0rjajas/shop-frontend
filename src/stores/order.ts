// src/stores/order.ts
import { defineStore } from 'pinia';
import axios from '@/utils/axios';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as any[],
    total: 0,
    loading: false,
  }),
  actions: {
    async fetchOrders(params: { offset?: number; limit?: number; filter?: number; order?: string; type?: number } = {}) {
      this.loading = true;
      try {
        const res = await axios.get('/api/orders/list/get', {
          params: { ...params, type: params.type ?? 1 },
        });
        this.orders = res.data.orders;
        this.total = res.data.total;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createOrder(address: string) {
      try {
        await axios.post('/api/orders/create', { address });
        await this.fetchOrders({ filter: 0 });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateOrderState(orderId: number, state: number) {
      await axios.post('/api/orders/update', { orderId, state });
      await this.fetchOrders();
    },
  },
});