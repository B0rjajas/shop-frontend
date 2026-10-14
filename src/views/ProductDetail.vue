<template>
  <div class="product-detail" v-if="product">
    <div class="top">
      <img
        v-if="product.image"
        :src="getImageUrl(product.image)"
        alt="product"
        class="main-image"
        @error="(e) => (e.target.src = '/placeholder-product.png')"
      />
      <div class="info">
        <h1>{{ product.name }}</h1>
        <p><strong>Marca:</strong> {{ product.brand }}</p>
        <p><strong>Precio:</strong> ${{ product.price }}</p>
        <p v-if="product.discounted_price"><strong>Oferta:</strong> ${{ product.discounted_price }}</p>
        <p><strong>Stock:</strong> {{ product.stock }}</p>
        <p><strong>Categoría:</strong> {{ product.category?.name }}</p>
        <button class="btn-add" @click="addToCart">Añadir al carrito</button>
      </div>
    </div>

    <div class="tabs">
      <el-tabs>
        <el-tab-pane label="Detalle">
          <div v-html="product.detail" class="detail-content"></div>
        </el-tab-pane>
        <el-tab-pane label="Evaluaciones">
          <div v-if="evaluations.length === 0" class="empty">No hay evaluaciones aún.</div>
          <div v-else v-for="ev in evaluations" :key="ev.id" class="evaluation-item">
            <p><strong>{{ ev.user_name }}</strong> - <el-rate v-model="ev.star" disabled :max="5" /></p>
            <p>{{ ev.content }}</p>
            <small>{{ new Date(ev.created_at).toLocaleString() }}</small>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <div v-else class="loading">Cargando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';

import axios from '@/utils/axios';
import { useCartStore } from '../stores/cart';
import { useEvaluationStore } from '../stores/evaluation';
import { ElMessage } from 'element-plus';

import { getImageUrl } from '@/utils/image';

const route = useRoute();
const cartStore = useCartStore();
const evalStore = useEvaluationStore();

const product = ref<any>(null);
const evaluations = ref<any[]>([]);

const fetchProduct = async () => {
  try {
    const id = route.params.id;
    if (!id) return;
    const res = await axios.get(`/api/products/products/${id}`);
    product.value = res.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    ElMessage.error('No se pudo cargar el producto');
  }
};

const loadEvaluations = async () => {
  try {
    const productId = route.params.id;
    if (!productId || isNaN(Number(productId))) {
      console.warn('ID de producto inválido para evaluaciones');
      return;
    }
    await evalStore.fetchEvaluations({ gid: Number(productId), state: 1, limit: 20 });
    evaluations.value = evalStore.evaluations;
  } catch (error) {
    console.error('Error loading evaluations:', error);
  }
};

const addToCart = async () => {
  try {
    await cartStore.addToCart(product.value.id, 1);
    ElMessage.success('Producto añadido al carrito');
  } catch (error) {
    ElMessage.error('Error al añadir al carrito');
  }
};

onMounted(() => {
  fetchProduct();
  loadEvaluations();
});
</script>

<style scoped>
/* ─────────────────────────────────────── */
/* Layout base */
/* ─────────────────────────────────────── */
.product-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.top {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  margin-bottom: 40px;
}

.main-image {
  width: 100%;
  max-width: 420px;
  max-height: 420px;
  object-fit: contain;
  border-radius: 8px;
  background: #f8f8f8;
}

.info {
  flex: 1;
  min-width: 0; /* ← TRUCO: permite wrap de texto largo en flex-child */
}

.info h1 {
  font-size: 2rem;
  line-height: 1.2;
  margin-bottom: 12px;
  word-break: break-word;
}

.info p {
  margin: 8px 0;
  font-size: 1rem;
}

.btn-add {
  background: #42b883;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 12px;
}

.btn-add:hover {
  background: #359c6e;
}

/* ─────────────────────────────────────── */
/* Tabs y contenido */
/* ─────────────────────────────────────── */
.tabs {
  margin-top: 24px;
}

.detail-content {
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 4px;
  min-height: 200px;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

/* IMPORTANTE: las imágenes internas del detalle (WangEditor) no deben
   desbordar. Sin esto, si el usuario sube una foto de 2000px, rompe el móvil. */
.detail-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.detail-content :deep(table) {
  max-width: 100%;
  overflow-x: auto;
  display: block;
}

.detail-content :deep(pre) {
  max-width: 100%;
  overflow-x: auto;
}

.loading {
  text-align: center;
  padding: 50px;
}

.evaluation-item {
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}

.empty {
  text-align: center;
  color: #888;
  padding: 20px;
}

/* ─────────────────────────────────────── */
/* RESPONSIVE — Tablet (768px) */
/* ─────────────────────────────────────── */
@media (max-width: 768px) {
  .product-detail {
    padding: 16px;
  }

  .top {
    flex-direction: column;  /* ← LA CLAVE: apilar verticalmente */
    gap: 20px;
    margin-bottom: 24px;
  }

  .info {
    width: 100%;  /* ← ESTA LÍNEA ES LA QUE FALTABA */
  }

  .main-image {
    max-width: 100%;
    max-height: 340px;
    margin: 0 auto;
    display: block;
  }

  .info h1 {
    font-size: 1.6rem;
  }

  .info p {
    font-size: 0.95rem;
  }

  .btn-add {
    width: auto;
    min-width: 220px;
    display: block;
    margin: 12px auto 0;
    padding: 14px 24px;
    font-size: 1rem;
  }

  .tabs {
    margin-top: 16px;
  }

  .detail-content {
    padding: 12px;
    font-size: 0.95rem;
    min-height: 120px;
  }
}

/* ─────────────────────────────────────── */
/* RESPONSIVE — Móvil pequeño (480px) */
/* ─────────────────────────────────────── */
@media (max-width: 480px) {
  .product-detail {
    padding: 12px;
  }

  .main-image {
    max-height: 280px;
  }

  .info h1 {
    font-size: 1.35rem;
  }

  .info p {
    font-size: 0.9rem;
  }

  .detail-content {
    padding: 10px;
    font-size: 0.9rem;
  }

  .evaluation-item {
    padding: 10px 0;
    font-size: 0.9rem;
  }
}
</style>