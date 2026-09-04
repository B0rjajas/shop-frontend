import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

export const useEvaluationStore = defineStore('evaluation', {
  state: () => ({
    evaluations: [] as any[],
    total: 0,
    loading: false,
  }),
  actions: {
    getAuthHeaders() {
      const userStore = useUserStore();
      return { Authorization: `Bearer ${userStore.token}` };
    },
    async fetchEvaluations(params: { gid?: number; state?: number; offset?: number; limit?: number } = {}) {
      this.loading = true;
      try {
        const res = await axios.get('http://localhost:3000/api/evaluation/list/get', {
          params,
          headers: this.getAuthHeaders(),
        });
        this.evaluations = res.data.evaluations;
        this.total = res.data.total;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createEvaluations(orderId: number, evaluations: Array<{ gid: number; content: string; star: number }>) {
      await axios.post(
        'http://localhost:3000/api/evaluation/create',
        { orderId, evaluations },
        { headers: this.getAuthHeaders() }
      );
    },
    async updateEvaluationState(evalId: number, state: number) {
      await axios.post(
        'http://localhost:3000/api/evaluation/update',
        { evalId, state },
        { headers: this.getAuthHeaders() }
      );
    },
  },
});