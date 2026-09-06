// src/stores/product.ts
import { defineStore } from 'pinia';
import axios from '@/utils/axios';  // 👈 usar el interceptor
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
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await axios.get('/api/products/categories');
        this.categories = res.data;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(data: { name: string; description: string; sort?: number }) {
      await axios.post('/api/products/categories', data);
      await this.fetchCategories();
    },

    async updateCategory(id: number, data: { name: string; description: string; sort?: number }) {
      await axios.put(`/api/products/categories/${id}`, data);
      await this.fetchCategories();
    },

    async deleteCategory(id: number) {
      await axios.delete(`/api/products/categories/${id}`);
      await this.fetchCategories();
    },

    async fetchProducts(params: { categoryId?: number; offset?: number; limit?: number; keyword?: string } = {}) {
      this.loading = true;
      try {
        const res = await axios.get('/api/products/products', { params });
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
        const res = await axios.get(`/api/products/products/${id}`);
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
      await axios.post('/api/products/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await this.fetchProducts();
    },

    async updateProduct(id: number, data: FormData) {
      await axios.put(`/api/products/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await this.fetchProducts();
    },

    async deleteProduct(id: number) {
      await axios.delete(`/api/products/products/${id}`);
      await this.fetchProducts();
    },
  },
});