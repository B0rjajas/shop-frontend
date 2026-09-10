<template>
  <div class="order-list">
    <h2>Gestión de Pedidos</h2>

    <div class="filters">
      <el-select v-model="filterState" placeholder="Filtrar por estado" @change="loadOrders" clearable>
        <el-option :value="undefined" label="Todos" />
        <el-option :value="0" label="Pendiente" />
        <el-option :value="1" label="Enviado" />
        <el-option :value="2" label="Recibido" />
        <el-option :value="3" label="Completado" />
      </el-select>

      <el-select v-model="sortBy" placeholder="Ordenar por" @change="loadOrders" clearable>
        <el-option value="" label="Default" />
        <el-option value="created_at" label="Fecha" />
        <el-option value="user_id" label="Usuario" />
        <el-option value="price" label="Precio" />
        <el-option value="state" label="Estado" />
      </el-select>
    </div>

    <el-table :data="orders" style="width: 100%; margin-top: 20px;" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="user_id" label="Usuario ID" width="120" />
      <el-table-column label="Fecha" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="Dirección" />
      <el-table-column label="Total" width="120">
        <template #default="{ row }">
          ${{ Number(row.price).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="Estado" width="120">
        <template #default="{ row }">
          <el-tag :type="stateType(row.state)">
            {{ ['Pendiente', 'Enviado', 'Recibido', 'Completado'][row.state] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Acciones" width="220">
        <template #default="{ row }">
          <el-button
            v-if="row.state === 0"
            type="primary"
            size="small"
            @click="updateState(row.id, 1)"
          >
            Marcar como enviado
          </el-button>
          <el-button
            v-else-if="row.state === 1"
            type="warning"
            size="small"
            @click="updateState(row.id, 0)"
          >
            Revertir
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

const store = useOrderStore();
const orders = ref(store.orders);
const total = ref(store.total);
const currentPage = ref(1);
const limit = 10;
const filterState = ref<number | undefined>(undefined);
const sortBy = ref('');

// 🔥 Formatear fecha de forma legible
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

// 🔥 Color del tag según estado
const stateType = (state: number) => {
  switch (state) {
    case 0: return 'warning';
    case 1: return 'primary';
    case 2: return 'success';
    case 3: return 'info';
    default: return 'info';
  }
};

const loadOrders = async () => {
  try {
    const offset = (currentPage.value - 1) * limit;
    const params: any = { offset, limit };
    if (filterState.value !== undefined) params.filter = filterState.value;
    if (sortBy.value) params.order = sortBy.value;
    // type=0 para obtener todos (admin)
    await store.fetchOrders({ ...params, type: 0 });
    orders.value = store.orders;
    total.value = store.total;
  } catch (error) {
    ElMessage.error('Error al cargar pedidos');
    console.error(error);
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadOrders();
};

const updateState = async (orderId: number, state: number) => {
  try {
    await store.updateOrderState(orderId, state);
    ElMessage.success('Estado actualizado');
    await loadOrders();
  } catch (error) {
    ElMessage.error('Error al actualizar estado');
  }
};

onMounted(loadOrders);
</script>

<style scoped>
.order-list { padding: 20px; }
.filters { display: flex; gap: 20px; margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>