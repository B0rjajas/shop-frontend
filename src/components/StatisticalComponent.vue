<template>
  <div class="statistical-container">
    <h2>Panel de Estadísticas</h2>
    <div v-if="loading" class="loading">Cargando estadísticas...</div>
    <div v-else class="stats-grid">
      <!-- Usuarios -->
      <div class="stat-card">
        <h3>Usuarios</h3>
        <div class="stat-number">{{ userStats.allCount }}</div>
        <div v-if="userStats.datas.length === 0" class="no-data-chart">Sin actividad en los últimos 30 días</div>
        <v-chart v-else class="chart" :option="userChartOption" />
      </div>

      <!-- Pedidos -->
      <div class="stat-card">
        <h3>Pedidos</h3>
        <div class="stat-number">{{ orderStats.allCount }}</div>
        <div v-if="orderStats.datas.length === 0" class="no-data-chart">Sin actividad en los últimos 30 días</div>
        <v-chart v-else class="chart" :option="orderChartOption" />
      </div>

      <!-- Ventas -->
      <div class="stat-card">
        <h3>Ventas totales</h3>
        <div class="stat-number">${{ Number(salesStats.allCount || 0).toFixed(2) }}</div>
        <div v-if="salesStats.datas.length === 0" class="no-data-chart">Sin actividad en los últimos 30 días</div>
        <v-chart v-else class="chart" :option="salesChartOption" />
      </div>

      <!-- Evaluaciones -->
      <div class="stat-card">
        <h3>Evaluaciones</h3>
        <div class="stat-number">{{ evaluationStats.allCount }}</div>
        <div v-if="evaluationStats.datas.length === 0" class="no-data-chart">Sin actividad en los últimos 30 días</div>
        <v-chart v-else class="chart" :option="evaluationChartOption" />
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
  // 🔥 Asegurar que date y count/total sean strings y numbers
  const dates = data.map((d: any) => String(d.date || ''));
  const values = data.map((d: any) => Number(d.count ?? d.total ?? 0));

  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: { rotate: 30, fontSize: 10 },
    },
    yAxis: { 
      type: 'value',
      minInterval: 1, // 🔥 para que el eje Y muestre enteros
    },
    series: [
      {
        name: label,
        type: 'bar',
        data: values,
        itemStyle: { color: '#42b883' },
      },
    ],
  };
};

const loadStats = async () => {
  loading.value = true;
  try {
    await store.loadAllStats();
    userStats.value = store.userStats;
    orderStats.value = store.orderStats;
    salesStats.value = store.salesStats;
    evaluationStats.value = store.evaluationStats;
    console.log('Stats loaded:', { userStats: userStats.value, orderStats: orderStats.value });
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
.no-data-chart {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-style: italic;
  background: #fafafa;
  border-radius: 4px;
}
.loading {
  text-align: center;
  padding: 40px;
  color: #888;
}
</style>