// src/stores/statistical.ts
import { defineStore } from 'pinia';
import axios from '@/utils/axios';

export const useStatisticalStore = defineStore('statistical', {
  state: () => ({
    userStats: { allCount: 0, datas: [] as any[] },
    orderStats: { allCount: 0, datas: [] as any[] },
    salesStats: { allCount: 0, datas: [] as any[] },
    evaluationStats: { allCount: 0, datas: [] as any[] },
    loading: false,
  }),
  actions: {
    async fetchStats(type: string) {
      try {
        const res = await axios.get('/api/statistical/get', { params: { type } });
        return res.data;
      } catch (error) {
        console.error(`Error fetching ${type} stats:`, error);
        throw error;
      }
    },
    async loadAllStats() {
      this.loading = true;
      try {
        const [user, order, sales, evaluation] = await Promise.all([
          this.fetchStats('user'),
          this.fetchStats('order'),
          this.fetchStats('sales'),
          this.fetchStats('evaluation'),
        ]);
        this.userStats = user;
        this.orderStats = order;
        this.salesStats = sales;
        this.evaluationStats = evaluation;
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});