<template>
    <div class="operational-form">
      <h2>{{ isEdit ? 'Editar Banner' : 'Crear Banner' }}</h2>
      <form @submit.prevent="submit">
        <div>
          <label>Nombre</label>
          <input v-model="form.name" required />
        </div>
        <div>
          <label>Estado</label>
          <select v-model="form.status">
            <option :value="1">Activo</option>
            <option :value="0">Inactivo</option>
          </select>
        </div>
        <div>
          <label>URL de imagen (cover)</label>
          <input v-model="form.cover" placeholder="https://ejemplo.com/imagen.jpg" />
        </div>
        <div>
          <label>Contenido</label>
          <textarea v-model="form.content" rows="3"></textarea>
        </div>
        <div>
          <label>URI (enlace)</label>
          <input v-model="form.uri" placeholder="/productos/oferta" />
        </div>
        <button type="submit" class="btn-submit">{{ isEdit ? 'Actualizar' : 'Crear' }}</button>
        <button type="button" @click="goBack" class="btn-back">Cancelar</button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useOperationalStore } from '../stores/operational';
  
  const store = useOperationalStore();
  const router = useRouter();
  const route = useRoute();
  
  const isEdit = route.params.id !== undefined;
  const form = ref({
    name: '',
    status: 1,
    cover: '',
    content: '',
    uri: '',
  });
  
  onMounted(async () => {
    if (isEdit) {
      await store.fetchItems();
      const item = store.items.find(i => i.id === Number(route.params.id));
      if (item) {
        form.value = { ...item };
      }
    }
  });
  
  const submit = async () => {
    try {
      if (isEdit) {
        // Para edición, actualizamos el estado (PUT) - podríamos implementar update completo
        await store.updateStatus(Number(route.params.id), form.value.status);
      } else {
        await store.createItem(form.value);
      }
      router.push('/admin/operational');
    } catch (error) {
      alert('Error al guardar el banner');
    }
  };
  
  const goBack = () => {
    router.push('/admin/operational');
  };
  </script>
  
  <style scoped>
  .operational-form {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  form div {
    margin-bottom: 1rem;
  }
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
  input, select, textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .btn-submit {
    background: #42b883;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 0.5rem;
  }
  .btn-back {
    background: #6c757d;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>