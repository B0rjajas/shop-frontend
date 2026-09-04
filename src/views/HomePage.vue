<template>
  <div class="home">
    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        placeholder="Buscar productos..."
        @keyup.enter="doSearch"
      />
      <button @click="doSearch">Buscar</button>
    </div>

    <!-- 🆕 Carrusel de banners (solo si hay) -->
    <el-carousel
      v-if="banners.length"
      height="300px"
      indicator-position="outside"
    >
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <router-link :to="banner.uri || '#'">
          <img
            :src="'http://localhost:3000' + banner.cover"
            alt="banner"
            style="width:100%; height:300px; object-fit:cover;"
          />
          <div class="banner-content">
            <h3>{{ banner.name }}</h3>
            <p>{{ banner.content }}</p>
          </div>
        </router-link>
      </el-carousel-item>
    </el-carousel>

    <h1>Bienvenido a la Tienda</h1>

    <!-- Categorías -->
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

    <!-- Productos -->
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="loading && products.length === 0" class="loading">
      Cargando productos...
    </div>
    <div v-else-if="products.length === 0" class="empty">
      No hay productos disponibles.
    </div>
    <div v-else class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="goToDetail(product.id)"
      >
        <img
          v-if="product.image"
          :src="'http://localhost:3000' + product.image"
          alt="product image"
        />
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p><strong>${{ product.price }}</strong></p>
        <p v-if="product.discounted_price" class="discount">
          Oferta: ${{ product.discounted_price }}
        </p>
      </div>
    </div>

    <!-- Botón "Cargar más" -->
    <div v-if="!loading && hasMore && products.length > 0" class="load-more">
      <button @click="loadMore">Cargar más</button>
    </div>
    <div v-if="loading && products.length > 0" class="loading">
      Cargando más...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useOperationalStore } from '../stores/operational';

// --- Stores y router ---
const router = useRouter();
const operationalStore = useOperationalStore();

// --- Estado de banners ---
const banners = ref<any[]>([]);

// --- Estado de productos y categorías ---
const categories = ref<any[]>([]);
const products = ref<any[]>([]);
const selectedCategory = ref<number | null>(null);
const offset = ref(0);
const limit = 10;
const loading = ref(false);
const hasMore = ref(true);
const error = ref('');

// --- Búsqueda ---
const searchQuery = ref('');

const doSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search/${encodeURIComponent(searchQuery.value.trim())}`);
  }
};

// --- Cargar categorías ---
const fetchCategories = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/products/categories');
    categories.value = res.data;
  } catch (err) {
    console.error('Error al cargar categorías:', err);
    error.value = 'No se pudieron cargar las categorías.';
  }
};

// --- Cargar productos ---
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
    const params: any = {
      offset: offset.value,
      limit: limit,
    };
    if (selectedCategory.value !== null) {
      params.categoryId = selectedCategory.value;
    }

    const res = await axios.get('http://localhost:3000/api/products/products', { params });
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

// --- Cambiar categoría ---
const selectCategory = (catId: number | null) => {
  selectedCategory.value = catId;
  fetchProducts(true);
};

// --- Cargar más productos ---
const loadMore = () => {
  fetchProducts(false);
};

// --- Ir al detalle del producto ---
const goToDetail = (id: number) => {
  router.push(`/product/${id}`);
};

// --- Cargar banners activos ---
const loadBanners = async () => {
  try {
    await operationalStore.fetchBanners();
    // Solo mostrar banners con status = 1 (activo)
    banners.value = operationalStore.banners.filter(b => b.status === 1);
  } catch (error) {
    console.error('Error al cargar banners:', error);
  }
};

// --- Inicializar todo al montar el componente ---
onMounted(async () => {
  // Cargar banners, categorías y productos en paralelo
  await Promise.all([
    loadBanners(),
    fetchCategories(),
    fetchProducts(true),
  ]);
});
</script>

<style scoped>
/* (tus estilos existentes) */
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
  max-width: 100%;
  height: 150px;
  object-fit: cover;
}
.discount {
  color: red;
}
.load-more {
  text-align: center;
  margin-top: 20px;
}
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
.error {
  color: red;
}

.banner-content {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  background: rgba(0,0,0,0.5);
  padding: 10px 20px;
  border-radius: 8px;
}

</style>