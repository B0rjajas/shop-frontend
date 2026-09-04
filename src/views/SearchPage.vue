<template>
    <div class="search-page">
      <h2>Resultados para "{{ keyword }}"</h2>
      <div v-if="loading">Buscando...</div>
      <div v-else-if="products.length === 0" class="empty">No se encontraron productos</div>
      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card" @click="goToDetail(product.id)">
          <img v-if="product.image" :src="'http://localhost:3000' + product.image" alt="product" />
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p><strong>${{ product.price }}</strong></p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const router = useRouter();
  const keyword = ref(route.params.keyword as string || '');
  const products = ref<any[]>([]);
  const loading = ref(false);
  
  const fetchSearch = async () => {
    if (!keyword.value) return;
    loading.value = true;
    try {
      const res = await axios.get('http://localhost:3000/api/products/products', {
        params: { keyword: keyword.value }
      });
      products.value = res.data.products;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  const goToDetail = (id: number) => {
    router.push(`/product/${id}`);
  };
  
  onMounted(fetchSearch);
  </script>
  
  <style scoped>
  .search-page { padding: 20px; }
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
  .product-card { border: 1px solid #eee; padding: 15px; border-radius: 8px; cursor: pointer; }
  .product-card img { max-width: 100%; height: 150px; object-fit: cover; }
  .empty { text-align: center; padding: 40px; color: #888; }
  </style>