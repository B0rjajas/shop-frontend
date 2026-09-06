<template>
  <div class="product-detail" v-if="product">
    <div class="top">
      <img 
  v-if="product.image" 
  :src="product.image.startsWith('http') ? product.image : API_URL + product.image" 
  alt="product" 
  class="main-image" 
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
import axios from 'axios';
import { useCartStore } from '../stores/cart';
import { useEvaluationStore } from '../stores/evaluation';
import { ElMessage } from 'element-plus';
import { API_URL } from '@/config';

const route = useRoute();
const cartStore = useCartStore();
const evalStore = useEvaluationStore();

const product = ref<any>(null);
const evaluations = ref<any[]>([]);

const fetchProduct = async () => {
  try {
    const id = route.params.id;
    if (!id) return;
    const res = await axios.get(`${API_URL}/api/products/products/${id}`);
    product.value = res.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    ElMessage.error('No se pudo cargar el producto');
  }
};

const loadEvaluations = async () => {
  try {
    const productId = route.params.id;
    // ✅ Validar que sea un número
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
.product-detail { max-width: 1000px; margin: 0 auto; padding: 20px; }
.top { display: flex; gap: 40px; margin-bottom: 40px; }
.main-image { max-width: 400px; max-height: 400px; object-fit: contain; }
.info { flex: 1; }
.btn-add { background: #42b883; color: white; border: none; padding: 12px 24px; border-radius: 4px; font-size: 16px; cursor: pointer; }
.detail-content { padding: 10px; border: 1px solid #eee; border-radius: 4px; min-height: 200px; }
.loading { text-align: center; padding: 50px; }
.evaluation-item { border-bottom: 1px solid #eee; padding: 12px 0; }
.empty { text-align: center; color: #888; padding: 20px; }
</style>