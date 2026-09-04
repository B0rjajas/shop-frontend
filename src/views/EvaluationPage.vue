<template>
    <div class="evaluation-page">
      <h2>Evaluar productos del pedido #{{ orderId }}</h2>
      <div v-for="(item, index) in orderItems" :key="index" class="eval-item">
        <h3>{{ item.name }}</h3>
        <el-rate v-model="evaluations[index].star" :max="5" />
        <el-input v-model="evaluations[index].content" type="textarea" placeholder="Escribe tu opinión..." rows="2" />
      </div>
      <el-button type="primary" @click="submitEvaluations">Enviar evaluaciones</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useEvaluationStore } from '../stores/evaluation';
  import { ElMessage } from 'element-plus';
  
  const route = useRoute();
  const router = useRouter();
  const store = useEvaluationStore();
  
  const orderId = Number(route.params.orderId);
  const orderItems = ref<any[]>([]);
  const evaluations = ref<Array<{ gid: number; content: string; star: number }>>([]);
  
  onMounted(() => {
    // Recuperar los items del pedido desde el estado global o desde localStorage
    // Para simplificar, asumimos que se pasan como query params o desde store
    // Aquí puedes obtenerlos del store de pedidos
    const stored = localStorage.getItem('orderItems');
    if (stored) {
      const items = JSON.parse(stored);
      orderItems.value = items;
      evaluations.value = items.map((item: any) => ({
        gid: item.product_id,
        content: '',
        star: 0,
      }));
    }
  });
  
  const submitEvaluations = async () => {
    try {
      await store.createEvaluations(orderId, evaluations.value);
      ElMessage.success('Evaluaciones enviadas');
      router.push('/orders');
    } catch (error) {
      ElMessage.error('Error al enviar evaluaciones');
    }
  };
  </script>
  
  <style scoped>
  .evaluation-page { padding: 20px; max-width: 600px; margin: 0 auto; }
  .eval-item { border: 1px solid #eee; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
  </style>