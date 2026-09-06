// src/stores/operational.ts
import { defineStore } from 'pinia';
import axios from '@/utils/axios';

export interface Banner {
  id: number;
  name: string;
  status: number;
  created_at: string;
  cover: string;
  content: string;
  uri: string;
}

export const useOperationalStore = defineStore('operational', {
  state: () => ({
    banners: [] as Banner[],
    loading: false,
    currentBanner: null as Banner | null,
  }),
  actions: {
    async fetchBanners() {
      this.loading = true;
      try {
        const res = await axios.get('/api/operational');
        this.banners = res.data;
      } catch (error) {
        console.error('Error fetching banners:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(id: number) {
      this.loading = true;
      try {
        const res = await axios.get(`/api/operational/${id}`);
        this.currentBanner = res.data;
        return res.data;
      } catch (error) {
        console.error('Error fetching banner:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createBanner(formData: FormData) {
      try {
        const res = await axios.post('/api/operational', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.fetchBanners();
        return res.data;
      } catch (error) {
        console.error('Error creating banner:', error);
        throw error;
      }
    },

    async updateBanner(id: number, formData: FormData) {
      try {
        const res = await axios.put(`/api/operational/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.fetchBanners();
        return res.data;
      } catch (error) {
        console.error('Error updating banner:', error);
        throw error;
      }
    },

    async updateStatus(id: number, status: number) {
      try {
        await axios.put(`/api/operational/${id}/status`, { status });
        await this.fetchBanners();
      } catch (error) {
        console.error('Error updating status:', error);
        throw error;
      }
    },

    async deleteBanner(id: number) {
      try {
        await axios.delete(`/api/operational/${id}`);
        await this.fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        throw error;
      }
    },
  },
});