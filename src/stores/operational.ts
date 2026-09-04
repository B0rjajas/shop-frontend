import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    getAuthHeaders() {
      const userStore = useUserStore();
      return {
        Authorization: `Bearer ${userStore.token}`,
      };
    },

    async fetchBanners() {
      this.loading = true;
      try {
        const res = await axios.get(`${API_URL}/api/operational`, {
          headers: this.getAuthHeaders(),
        });
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
        const res = await axios.get(`${API_URL}/api/operational/${id}`, {
          headers: this.getAuthHeaders(),
        });
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
        const res = await axios.post(`${API_URL}/api/operational`, formData, {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
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
        const res = await axios.put(`${API_URL}/api/operational/${id}`, formData, {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
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
        await axios.put(`${API_URL}/api/operational/${id}/status`, { status }, {
          headers: this.getAuthHeaders(),
        });
        await this.fetchBanners();
      } catch (error) {
        console.error('Error updating status:', error);
        throw error;
      }
    },

    async deleteBanner(id: number) {
      try {
        await axios.delete(`${API_URL}/api/operational/${id}`, {
          headers: this.getAuthHeaders(),
        });
        await this.fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        throw error;
      }
    },
  },
});