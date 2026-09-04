import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as any[],
    total: 0,
    loading: false,
  }),
  actions: {
    getAuthHeaders() {
      const userStore = useUserStore();
      return { Authorization: `Bearer ${userStore.token}` };
    },
    async fetchOrders(params: { offset?: number; limit?: number; filter?: number; order?: string; type?: number } = {}) {
      this.loading = true;
      try {
        const res = await axios.get(`${API_URL}/api/orders/list/get`, {
          params: { ...params, type: params.type ?? 1 },
          headers: this.getAuthHeaders(),
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
        await axios.post(
          `${API_URL}/api/orders/create`,
          { address },
          { headers: this.getAuthHeaders() }
        );
        await this.fetchOrders({ filter: 0 });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateOrderState(orderId: number, state: number) {
      await axios.post(
        `${API_URL}/api/orders/update`,
        { orderId, state },
        { headers: this.getAuthHeaders() }
      );
      await this.fetchOrders();
    },
  },
});