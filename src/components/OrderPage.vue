<template>
  <div class="order-page">
    <h2>Mis Pedidos</h2>

    <el-select v-model="filterState" placeholder="Filtrar por estado" @change="loadOrders">
      <el-option :value="null" label="Todos" />
      <el-option :value="0" label="Pendiente" />
      <el-option :value="1" label="Enviado" />
      <el-option :value="2" label="Recibido" />
      <el-option :value="3" label="Completado" />
    </el-select>

    <el-table :data="orders" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="created_at" label="Fecha" />
      <el-table-column prop="address" label="Dirección" />
      <el-table-column prop="price" label="Total" />
      <el-table-column label="Estado">
        <template #default="{ row }">
          {{ ['Pendiente', 'Enviado', 'Recibido', 'Completado'][row.state] }}
        </template>
      </el-table-column>
      <el-table-column label="Acciones">
        <template #default="{ row }">
          <el-button
            v-if="row.state === 1"
            type="success"
            size="small"
            @click="confirmReceived(row.id)"
          >
            Confirmar recepción
          </el-button>
          <el-button
            v-if="row.state === 2"
            type="primary"
            size="small"
            @click="goToEvaluation(row.id)"
          >
            Evaluar
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="limit"
        :total="total"
        layout="prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrderStore } from '../stores/order';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const store = useOrderStore();
const router = useRouter();
const orders = ref(store.orders);
const total = ref(store.total);
const currentPage = ref(1);
const limit = 10;
const filterState = ref<number | null>(null);

const loadOrders = async () => {
  try {
    const offset = (currentPage.value - 1) * limit;
    const params: any = { offset, limit };
    if (filterState.value !== null) {
      params.filter = filterState.value;
    }
    await store.fetchOrders(params);
    orders.value = store.orders;
    total.value = store.total;
  } catch (error: any) {
    ElMessage.error('Error al cargar los pedidos');
    console.error(error);
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadOrders();
};

const confirmReceived = async (orderId: number) => {
  try {
    await store.updateOrderState(orderId, 2);
    ElMessage.success('Pedido recibido');
    await loadOrders();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || 'Error al confirmar recepción');
  }
};

const goToEvaluation = (orderId: number) => {
  router.push(`/evaluation/${orderId}`);
};

onMounted(loadOrders);
</script>

<style scoped>
.order-page { padding: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>