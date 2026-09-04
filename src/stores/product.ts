import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from './user';

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  sort: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  created_at: string;
  detail: string;
  category_id: number;
  category?: Category;
  price: number;
  discounted_price: number;
  stock: number;
  image: string;
  status: number;
  brand: string;
}

export const useProductStore = defineStore('product', {
  state: () => ({
    categories: [] as Category[],
    products: [] as Product[],
    total: 0,
    loading: false,
    currentProduct: null as Product | null,
  }),
  actions: {
    getAuthHeaders() {
      const userStore = useUserStore();
      return { Authorization: `Bearer ${userStore.token}` };
    },

    // ---- Categorías ----
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await axios.get('http://localhost:3000/api/products/categories', {
          headers: this.getAuthHeaders(),
        });
        this.categories = res.data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(data: { name: string; description: string; sort?: number }) {
      await axios.post('http://localhost:3000/api/products/categories', data, {
        headers: this.getAuthHeaders(),
      });
      await this.fetchCategories();
    },

    async updateCategory(id: number, data: { name: string; description: string; sort?: number }) {
      await axios.put(`http://localhost:3000/api/products/categories/${id}`, data, {
        headers: this.getAuthHeaders(),
      });
      await this.fetchCategories();
    },

    async deleteCategory(id: number) {
      await axios.delete(`http://localhost:3000/api/products/categories/${id}`, {
        headers: this.getAuthHeaders(),
      });
      await this.fetchCategories();
    },

    // ---- Productos ----
    async fetchProducts(params: { categoryId?: number; offset?: number; limit?: number; keyword?: string } = {}) {
      this.loading = true;
      try {
        const res = await axios.get('http://localhost:3000/api/products/products', {
          params,
          headers: this.getAuthHeaders(),
        });
        this.products = res.data.products;
        this.total = res.data.total;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchProduct(id: number) {
      this.loading = true;
      try {
        const res = await axios.get(`http://localhost:3000/api/products/products/${id}`, {
          headers: this.getAuthHeaders(),
        });
        this.currentProduct = res.data;
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(data: FormData) {
      await axios.post('http://localhost:3000/api/products/products', data, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.fetchProducts();
    },

    async updateProduct(id: number, data: FormData) {
      await axios.put(`http://localhost:3000/api/products/products/${id}`, data, {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.fetchProducts();
    },

    async deleteProduct(id: number) {
      await axios.delete(`http://localhost:3000/api/products/products/${id}`, {
        headers: this.getAuthHeaders(),
      });
      await this.fetchProducts();
    },
  },
});