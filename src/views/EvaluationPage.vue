<template>
  <div class="evaluation-page">
    <div v-if="loading" class="state">Cargando pedido...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <template v-else>
      <h2>Evaluar productos del pedido #{{ orderId }}</h2>

      <div v-if="orderItems.length === 0" class="state">
        Este pedido no tiene productos que evaluar.
      </div>

      <div
        v-else
        v-for="(item, index) in orderItems"
        :key="item.product_id"
        class="eval-item"
      >
        <h3>{{ item.name }} <small>(x{{ item.quantity }})</small></h3>
        <el-rate v-model="evaluations[index].star" :max="5" />
        <el-input
          v-model="evaluations[index].content"
          type="textarea"
          placeholder="Escribe tu opinión..."
          rows="2"
        />
      </div>

      <el-button
        v-if="orderItems.length > 0"
        type="primary"
        @click="submitEvaluations"
      >
        Enviar evaluaciones
      </el-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEvaluationStore } from '../stores/evaluation';
import { useOrderStore } from '../stores/order';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const evalStore = useEvaluationStore();
const orderStore = useOrderStore();

const orderId = Number(route.params.orderId);
const orderItems = ref<any[]>([]);
const evaluations = ref<Array<{ gid: number; content: string; star: number }>>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const order = await orderStore.fetchOrderById(orderId);

    // Guard en cliente: solo pedidos en estado 2 (Recibido) se evalúan.
    // El backend también lo comprueba (409), pero aquí evitamos que el
    // usuario rellene el formulario para nada.
    if (order.state !== 2) {
      error.value = 'Este pedido ya no está disponible para evaluar.';
      return;
    }

    orderItems.value = order.items ?? [];
    evaluations.value = orderItems.value.map((item: any) => ({
      gid: item.product_id,
      content: '',
      star: 0,
    }));
  } catch (err: any) {
    const status = err.response?.status;
    if (status === 404) {
      error.value = 'Pedido no encontrado.';
    } else {
      error.value = 'Error al cargar el pedido.';
    }
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const submitEvaluations = async () => {
  // Validación mínima en cliente: todas las estrellas rellenas.
  // El backend lo revalida (Zod: min 1), pero aquí damos feedback rápido.
  if (evaluations.value.some((e) => e.star < 1)) {
    ElMessage.warning('Asigna al menos 1 estrella a cada producto');
    return;
  }

  try {
    await evalStore.createEvaluations(orderId, evaluations.value);
    ElMessage.success('Evaluaciones enviadas');
    router.push('/orders');
  } catch (err: any) {
    const status = err.response?.status;
    const msg = err.response?.data?.message;

    if (status === 409) {
      // Otro caso típico: el usuario ya había evaluado este pedido en otra
      // pestaña, o el estado cambió entre el load y el submit.
      ElMessage.warning(msg || 'El pedido ya no se puede evaluar');
    } else if (status === 404) {
      ElMessage.error(msg || 'Pedido no encontrado');
    } else {
      ElMessage.error(msg || 'Error al enviar las evaluaciones');
    }
    console.error(err);
  }
};
</script>

<style scoped>
.evaluation-page { padding: 20px; max-width: 600px; margin: 0 auto; }
.eval-item { border: 1px solid #eee; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
.eval-item small { color: #888; font-weight: normal; }
.state { text-align: center; padding: 40px; color: #888; }
.state.error { color: #dc3545; }
</style>