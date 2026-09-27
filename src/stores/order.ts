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
        const res = await axios.post('/api/orders/create', { address });
        // ✅ Después de crear el pedido, recargar la lista (sin filtros)
        await this.fetchOrders({ filter: 0 });
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async updateOrderState(orderId: number, state: number) {
      try {
        await axios.post('/api/orders/update', { orderId, state });
        await this.fetchOrders();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async receiveOrder(orderId: number) {
      try {
        await axios.post('/api/orders/receive', { orderId });
        await this.fetchOrders();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
        /**
     * Obtiene UN pedido concreto con sus items ya parseados.
     * No se guarda en el state: solo lo consume la vista de evaluación.
     * Si se reutiliza en más sitios, se promueve a state.
     */
        async fetchOrderById(orderId: number) {
          const res = await axios.get(`/api/orders/${orderId}`);
          return res.data;
        },
  },
});