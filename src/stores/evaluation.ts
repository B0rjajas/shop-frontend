// src/stores/evaluation.ts
import { defineStore } from 'pinia';
import axios from '@/utils/axios';

export const useEvaluationStore = defineStore('evaluation', {
  state: () => ({
    evaluations: [] as any[],
    total: 0,
    loading: false,
  }),
  actions: {
    async fetchEvaluations(params: { gid?: number; state?: number; offset?: number; limit?: number } = {}) {
      this.loading = true;
      try {
        const res = await axios.get('/api/evaluation/list/get', { params });
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
      await axios.post('/api/evaluation/create', { orderId, evaluations });
    },
    async updateEvaluationState(evalId: number, state: number) {
      await axios.post('/api/evaluation/update', { evalId, state });
    },
  },
});