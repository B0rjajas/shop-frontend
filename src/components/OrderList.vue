<template>
    <div class="order-list">
      <h2>Gestión de Pedidos</h2>
  
      <div class="filters">
        <el-select v-model="filterState" placeholder="Filtrar por estado" @change="loadOrders">
          <el-option :value="undefined" label="Todos" />
          <el-option :value="0" label="Pendiente" />
          <el-option :value="1" label="Enviado" />
          <el-option :value="2" label="Recibido" />
          <el-option :value="3" label="Completado" />
        </el-select>
  
        <el-select v-model="sortBy" placeholder="Ordenar por" @change="loadOrders">
          <el-option value="" label="Default" />
          <el-option value="created_at" label="Fecha" />
          <el-option value="user_id" label="Usuario" />
          <el-option value="price" label="Precio" />
          <el-option value="state" label="Estado" />
        </el-select>
      </div>
  
      <el-table :data="orders" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user_id" label="Usuario ID" width="100" />
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
  
  const loadOrders = async () => {
    const offset = (currentPage.value - 1) * limit;
    const params: any = { offset, limit };
    if (filterState.value !== undefined) params.filter = filterState.value;
    if (sortBy.value) params.order = sortBy.value;
    // type=0 para obtener todos (admin)
    await store.fetchOrders({ ...params, type: 0 });
    orders.value = store.orders;
    total.value = store.total;
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