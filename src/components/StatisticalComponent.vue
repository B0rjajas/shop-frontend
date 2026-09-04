<!-- src/components/StatisticalComponent.vue -->
<template>
  <div class="statistical-container">
    <h2>Panel de Estadísticas</h2>
    <div v-if="loading" class="loading">Cargando estadísticas...</div>
    <div v-else class="stats-grid">
      <!-- Usuarios -->
      <div class="stat-card">
        <h3>Usuarios</h3>
        <div class="stat-number">{{ userStats.allCount }}</div>
        <v-chart class="chart" :option="userChartOption" />
      </div>

      <!-- Pedidos -->
      <div class="stat-card">
        <h3>Pedidos</h3>
        <div class="stat-number">{{ orderStats.allCount }}</div>
        <v-chart class="chart" :option="orderChartOption" />
      </div>

      <!-- Ventas -->
      <div class="stat-card">
        <h3>Ventas totales</h3>
        <div class="stat-number">${{ salesStats.allCount?.toFixed(2) || 0 }}</div>
        <v-chart class="chart" :option="salesChartOption" />
      </div>

      <!-- Evaluaciones -->
      <div class="stat-card">
        <h3>Evaluaciones</h3>
        <div class="stat-number">{{ evaluationStats.allCount }}</div>
        <v-chart class="chart" :option="evaluationChartOption" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStatisticalStore } from '../stores/statistical';

const store = useStatisticalStore();
const loading = ref(true);

const userStats = ref<any>({ allCount: 0, datas: [] });
const orderStats = ref<any>({ allCount: 0, datas: [] });
const salesStats = ref<any>({ allCount: 0, datas: [] });
const evaluationStats = ref<any>({ allCount: 0, datas: [] });

const createChartOption = (data: any[], label: string) => {
  const dates = data.map((d: any) => d.date || '');
  const values = data.map((d: any) => d.count || d.total || 0);

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dates.length ? dates : ['Sin datos'],
      axisLabel: { rotate: 30, fontSize: 10 },
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: label,
        type: 'bar',
        data: values.length ? values : [0],
        itemStyle: { color: '#42b883' },
      },
    ],
  };
};

const loadStats = async () => {
  loading.value = true;
  try {
    // Usar el store en lugar de axios directamente
    await store.loadAllStats();
    userStats.value = store.userStats;
    orderStats.value = store.orderStats;
    salesStats.value = store.salesStats;
    evaluationStats.value = store.evaluationStats;
  } catch (error) {
    console.error('Error loading stats:', error);
  } finally {
    loading.value = false;
  }
};

const userChartOption = computed(() => createChartOption(userStats.value.datas || [], 'Nuevos usuarios'));
const orderChartOption = computed(() => createChartOption(orderStats.value.datas || [], 'Pedidos'));
const salesChartOption = computed(() => createChartOption(salesStats.value.datas || [], 'Ventas ($)'));
const evaluationChartOption = computed(() => createChartOption(evaluationStats.value.datas || [], 'Evaluaciones'));

onMounted(loadStats);
</script>

<style scoped>
.statistical-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.stat-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #42b883;
  margin: 10px 0;
}
.chart {
  width: 100%;
  height: 200px;
}
.loading {
  text-align: center;
  padding: 40px;
  color: #888;
}
</style>