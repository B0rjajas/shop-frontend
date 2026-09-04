<template>
  <div class="product-list">
    <h2>Lista de Productos</h2>
    <el-button type="primary" @click="$router.push('/admin/product/create')">Nuevo Producto</el-button>

    <el-table :data="products" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="Imagen" width="100">
        <template #default="{ row }">
          <img 
            v-if="row.image" 
            :src="API_URL + row.image" 
            style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" 
          />
          <span v-else style="color: #ccc;">Sin imagen</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Nombre" />
      <el-table-column prop="brand" label="Marca" />
      <el-table-column prop="price" label="Precio" width="120" />
      <el-table-column prop="stock" label="Stock" width="100" />
      <el-table-column prop="status" label="Estado" width="100">
        <template #default="{ row }">
          {{ row.status === 1 ? 'Activo' : 'Inactivo' }}
        </template>
      </el-table-column>
      <el-table-column label="Acciones" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="$router.push(`/admin/product/${row.id}`)">Editar</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.id)">Eliminar</el-button>
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
import { useProductStore } from '../stores/product';
import { ElMessage, ElMessageBox } from 'element-plus';
import { API_URL } from '../config';

const store = useProductStore();
const products = ref(store.products);
const total = ref(store.total);
const currentPage = ref(1);
const limit = 10;

onMounted(async () => {
  await loadProducts();
});

const loadProducts = async () => {
  const offset = (currentPage.value - 1) * limit;
  await store.fetchProducts({ offset, limit });
  products.value = store.products;
  total.value = store.total;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadProducts();
};

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('¿Eliminar este producto?', 'Confirmar');
    await store.deleteProduct(id);
    await loadProducts();
    ElMessage.success('Producto eliminado');
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('Error al eliminar');
  }
};
</script>

<style scoped>
.product-list {
  padding: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>