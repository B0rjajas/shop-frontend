<template>
    <div class="category-manager">
      <h2>Gestión de Categorías</h2>
      <button @click="openCreateDialog" class="btn-primary">Nueva Categoría</button>
  
      <el-table :data="categories" style="width: 100%; margin-top: 20px;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Nombre" />
        <el-table-column prop="description" label="Descripción" />
        <el-table-column prop="sort" label="Orden" width="100" />
        <el-table-column label="Acciones" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="openEditDialog(row)">Editar</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row.id)">Eliminar</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- Diálogo para crear/editar -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle">
        <el-form :model="form">
          <el-form-item label="Nombre">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="Descripción">
            <el-input v-model="form.description" />
          </el-form-item>
          <el-form-item label="Orden (mayor primero)">
            <el-input-number v-model="form.sort" :min="0" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">Cancelar</el-button>
          <el-button type="primary" @click="saveCategory">Guardar</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue';
  import { useProductStore } from '../stores/product';
  import { ElMessage, ElMessageBox } from 'element-plus';
  
  const store = useProductStore();
  const categories = ref(store.categories);
  const dialogVisible = ref(false);
  const dialogTitle = ref('');
  const editingId = ref<number | null>(null);
  const form = reactive({ name: '', description: '', sort: 0 });
  
  onMounted(async () => {
    await store.fetchCategories();
    categories.value = store.categories;
  });
  
  const openCreateDialog = () => {
    dialogTitle.value = 'Nueva Categoría';
    editingId.value = null;
    form.name = '';
    form.description = '';
    form.sort = 0;
    dialogVisible.value = true;
  };
  
  const openEditDialog = (row: any) => {
    dialogTitle.value = 'Editar Categoría';
    editingId.value = row.id;
    form.name = row.name;
    form.description = row.description;
    form.sort = row.sort;
    dialogVisible.value = true;
  };
  
  const saveCategory = async () => {
    try {
      if (editingId.value) {
        await store.updateCategory(editingId.value, { ...form });
        ElMessage.success('Categoría actualizada');
      } else {
        await store.createCategory({ ...form });
        ElMessage.success('Categoría creada');
      }
      categories.value = store.categories;
      dialogVisible.value = false;
    } catch (error) {
      ElMessage.error('Error al guardar categoría');
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await ElMessageBox.confirm('¿Eliminar esta categoría?', 'Confirmar');
      await store.deleteCategory(id);
      categories.value = store.categories;
      ElMessage.success('Categoría eliminada');
    } catch (error) {
      if (error !== 'cancel') ElMessage.error('Error al eliminar');
    }
  };
  </script>
  
  <style scoped>
  .category-manager {
    padding: 20px;
  }
  .btn-primary {
    background: #42b883;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>