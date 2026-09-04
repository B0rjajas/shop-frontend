<template>
    <div class="evaluation-list">
      <h2>Gestión de Evaluaciones</h2>
      <el-table :data="evaluations" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user_name" label="Usuario" />
        <el-table-column prop="gid" label="Producto ID" width="100" />
        <el-table-column prop="content" label="Contenido" />
        <el-table-column prop="star" label="Estrellas" width="100" />
        <el-table-column label="Estado">
          <template #default="{ row }">
            {{ ['Pendiente', 'Aprobada', 'Rechazada'][row.state] }}
          </template>
        </el-table-column>
        <el-table-column label="Acciones">
          <template #default="{ row }">
            <el-button v-if="row.state === 0" type="success" size="small" @click="updateState(row.id, 1)">Aprobar</el-button>
            <el-button v-if="row.state === 0" type="danger" size="small" @click="updateState(row.id, 2)">Rechazar</el-button>
            <el-button v-if="row.state === 1" type="warning" size="small" @click="updateState(row.id, 0)">Revertir</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useEvaluationStore } from '../stores/evaluation';
  import { ElMessage } from 'element-plus';
  
  const store = useEvaluationStore();
  const evaluations = ref(store.evaluations);
  
  const load = async () => {
    await store.fetchEvaluations({ state: 0 }); // solo pendientes
    evaluations.value = store.evaluations;
  };
  
  const updateState = async (id: number, state: number) => {
    try {
      await store.updateEvaluationState(id, state);
      ElMessage.success('Estado actualizado');
      await load();
    } catch (error) {
      ElMessage.error('Error');
    }
  };
  
  onMounted(load);
  </script>