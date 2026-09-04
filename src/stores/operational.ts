import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

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
        const res = await axios.get('http://localhost:3000/api/operational', {
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
        const res = await axios.get(`http://localhost:3000/api/operational/${id}`, {
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

    // Crear banner con FormData (para incluir imagen)
    async createBanner(formData: FormData) {
      try {
        const res = await axios.post('http://localhost:3000/api/operational', formData, {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        });
        await this.fetchBanners(); // Recargar lista
        return res.data;
      } catch (error) {
        console.error('Error creating banner:', error);
        throw error;
      }
    },

    // Actualizar banner completo con FormData
    async updateBanner(id: number, formData: FormData) {
      try {
        const res = await axios.put(`http://localhost:3000/api/operational/${id}`, formData, {
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
        await axios.put(`http://localhost:3000/api/operational/${id}/status`, { status }, {
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
        await axios.delete(`http://localhost:3000/api/operational/${id}`, {
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