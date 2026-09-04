import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

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
        const res = await axios.get('http://localhost:3000/api/orders/list/get', {
          params: { ...params, type: params.type ?? 1 }, // por defecto 1
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
          'http://localhost:3000/api/orders/create',
          { address },
          { headers: this.getAuthHeaders() }
        );
        // ✅ Recargar pedidos DESPUÉS de crear (dentro del try)
        await this.fetchOrders({ filter: 0 });
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateOrderState(orderId: number, state: number) {
      await axios.post(
        'http://localhost:3000/api/orders/update',
        { orderId, state },
        { headers: this.getAuthHeaders() }
      );
      await this.fetchOrders();
    },
  },
});