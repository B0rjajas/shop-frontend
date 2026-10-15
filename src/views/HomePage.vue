<template>
  <div class="home">
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Buscar productos..." @keyup.enter="doSearch" />
      <button @click="doSearch">Buscar</button>
    </div>

    <el-carousel
      v-if="banners.length"
      class="home-carousel"
      :height="carouselHeight"
      indicator-position="outside"
    >
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <router-link :to="banner.uri || '#'" class="banner-link">
          <img
            :src="getImageUrl(banner.cover)"
            alt="banner"
            class="banner-img"
          />
          <div class="banner-content">
            <h3>{{ banner.name }}</h3>
            <p>{{ banner.content }}</p>
          </div>
        </router-link>
      </el-carousel-item>
    </el-carousel>

    <h1>Bienvenido a la Tienda</h1>

    <div class="categories">
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="['category-btn', { active: selectedCategory === cat.id }]"
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
      </button>
      <button
        :class="['category-btn', { active: selectedCategory === null }]"
        @click="selectCategory(null)"
      >
        Todas
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="loading && products.length === 0" class="loading">Cargando productos...</div>
    <div v-else-if="products.length === 0" class="empty">No hay productos disponibles.</div>
    <div v-else class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="goToDetail(product.id)"
      >
        <img
          :src="getImageUrl(product.image)"
          alt="producto"
          @error="(e) => (e.target.src = '/placeholder-product.png')"
        />
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p><strong>${{ product.price }}</strong></p>
        <p v-if="product.discounted_price" class="discount">Oferta: ${{ product.discounted_price }}</p>
      </div>
    </div>

    <div v-if="!loading && hasMore && products.length > 0" class="load-more">
      <button @click="loadMore">Cargar más</button>
    </div>
    <div v-if="loading && products.length > 0" class="loading">Cargando más...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import axios from '@/utils/axios';
import { useOperationalStore } from '../stores/operational';

import { getImageUrl } from '@/utils/image';

const router = useRouter();
const operationalStore = useOperationalStore();

const banners = ref<any[]>([]);
const categories = ref<any[]>([]);
const products = ref<any[]>([]);
const selectedCategory = ref<number | null>(null);
const offset = ref(0);
const limit = 10;
const loading = ref(false);
const hasMore = ref(true);
const error = ref('');
const searchQuery = ref('');

// ─────────────────────────────────────────
// Altura dinámica del carrusel según pantalla
// ─────────────────────────────────────────
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const carouselHeight = computed(() => {
  if (windowWidth.value < 480) return '160px';
  if (windowWidth.value < 768) return '220px';
  if (windowWidth.value < 1024) return '280px';
  return '300px';
});

const doSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search/${encodeURIComponent(searchQuery.value.trim())}`);
  }
};

const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/products/categories');
    categories.value = res.data;
  } catch (err) {
    console.error('Error al cargar categorías:', err);
    error.value = 'No se pudieron cargar las categorías.';
  }
};

const fetchProducts = async (reset = true) => {
  if (reset) {
    offset.value = 0;
    products.value = [];
    hasMore.value = true;
    error.value = '';
  }
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  try {
    const params: any = { offset: offset.value, limit };
    if (selectedCategory.value !== null) {
      params.categoryId = selectedCategory.value;
    }

    const res = await axios.get('/api/products/products', { params });
    const newProducts = res.data.products || [];

    if (reset) {
      products.value = newProducts;
    } else {
      products.value = [...products.value, ...newProducts];
    }

    if (newProducts.length < limit) {
      hasMore.value = false;
    }
    offset.value += newProducts.length;
  } catch (err) {
    console.error('Error al cargar productos:', err);
    error.value = 'Error al cargar productos. Intenta de nuevo.';
  } finally {
    loading.value = false;
  }
};

const selectCategory = (catId: number | null) => {
  selectedCategory.value = catId;
  fetchProducts(true);
};

const loadMore = () => {
  fetchProducts(false);
};

const goToDetail = (id: number) => {
  router.push(`/product/${id}`);
};

const loadBanners = async () => {
  try {
    await operationalStore.fetchBanners();
    banners.value = operationalStore.banners.filter(b => b.status === 1);
  } catch (error) {
    console.error('Error al cargar banners:', error);
  }
};

onMounted(async () => {
  await Promise.all([loadBanners(), fetchCategories(), fetchProducts(true)]);
});
</script>

<style scoped>
.home { padding: 20px; max-width: 1200px; margin: 0 auto; }
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.search-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.search-bar button {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.categories {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.category-btn {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 20px;
}
.category-btn.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.product-card {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
}
.product-card h3 {
  margin-top: 10px;
}
.discount { color: red; }
.load-more { text-align: center; margin-top: 20px; }
.load-more button {
  padding: 10px 30px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.loading, .empty, .error {
  text-align: center;
  padding: 40px;
  color: #888;
}
.error { color: red; }

/* ─────────────────────────────────────── */
/* CARRUSEL — La imagen SIEMPRE llena la caja */
/* ─────────────────────────────────────── */
.home-carousel {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

/* El contenedor interno hereda la altura del carrusel */
.home-carousel :deep(.el-carousel__container) {
  height: 100%;
}

/* Cada slide ocupa el 100% del contenedor */
.home-carousel :deep(.el-carousel__item) {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* El link cubre todo el slide */
.banner-link {
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
}

/* 🔑 LA IMAGEN LLENA EL HUECO SIN DEFORMARSE */
.banner-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Overlay del texto sobre el banner */
.banner-content {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 2;
  color: white;
  background: rgba(0, 0, 0, 0.55);
  padding: 10px 16px;
  border-radius: 8px;
  max-width: 70%;
}

.banner-content h3 {
  margin: 0 0 4px;
  font-size: 1.05rem;
  font-weight: 700;
}

.banner-content p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.95;
}

@media (max-width: 640px) {
  .home {
    padding: 12px;
  }
  .product-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .product-card {
    padding: 12px;
  }
  .product-card img {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .banner-content {
    bottom: 10px;
    left: 10px;
    padding: 8px 12px;
    max-width: 80%;
  }

  .banner-content h3 {
    font-size: 0.9rem;
  }

  .banner-content p {
    font-size: 0.75rem;
  }
}
</style>