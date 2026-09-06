<template>
  <div class="operational-list">
    <h2>Gestión de Banners</h2>
    <button @click="$router.push('/operational/create')" class="btn-create">Crear Banner</button>
    
    <div v-if="store.loading">Cargando...</div>
    
    <div v-else-if="store.banners.length === 0">
      <p>No hay banners. ¡Crea uno!</p>
    </div>
    
    <div v-else>
      <div v-for="banner in store.banners" :key="banner.id" class="banner-card">
        <div class="banner-header">
          <h3>{{ banner.name }}</h3>
          <span class="status-badge" :class="banner.status === 1 ? 'active' : 'inactive'">
            {{ banner.status === 1 ? 'Activo' : 'Inactivo' }}
          </span>
        </div>
        <div class="banner-body">
          <img 
            v-if="banner.cover" 
            :src="getImageUrl(banner.cover)" 
            alt="cover" 
            class="banner-image"
            @error="(e) => (e.target.src = '/placeholder-banner.png')"
          />
          <div class="banner-info">
            <p><strong>Contenido:</strong> {{ banner.content }}</p>
            <p><strong>URL:</strong> {{ banner.uri }}</p>
            <p><strong>Creado:</strong> {{ new Date(banner.created_at).toLocaleString() }}</p>
          </div>
        </div>
        <div class="banner-actions">
          <button @click="$router.push(`/operational/edit/${banner.id}`)" class="btn-edit">Editar</button>
          <button @click="toggleStatus(banner.id, banner.status)" class="btn-status">
            {{ banner.status === 1 ? 'Desactivar' : 'Activar' }}
          </button>
          <button @click="deleteBanner(banner.id)" class="btn-delete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useOperationalStore } from '../stores/operational';
import { getImageUrl } from '@/utils/image';

const store = useOperationalStore();

onMounted(() => {
  store.fetchBanners();
});

const toggleStatus = (id: number, currentStatus: number) => {
  const newStatus = currentStatus === 1 ? 0 : 1;
  store.updateStatus(id, newStatus);
};

const deleteBanner = (id: number) => {
  if (confirm('¿Eliminar este banner?')) {
    store.deleteBanner(id);
  }
};
</script>

<style scoped>
/* ... tus estilos ... */
</style>