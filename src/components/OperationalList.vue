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
  :src="banner.cover.startsWith('http') ? banner.cover : API_URL + banner.cover"
  alt="banner"
  style="width:100%; height:300px; object-fit:cover;"
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
import { API_URL } from '@/config';

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
.operational-list { max-width: 900px; margin: 0 auto; padding: 20px; }
h2 { color: #2c3e50; margin-bottom: 20px; }
.btn-create {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}
.btn-create:hover { background: #33a06f; }
.banner-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background: #fafafa;
  transition: box-shadow 0.2s;
}
.banner-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.banner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.banner-header h3 { margin: 0; color: #2c3e50; }
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}
.status-badge.active { background: #d4edda; color: #155724; }
.status-badge.inactive { background: #f8d7da; color: #721c24; }
.banner-body {
  display: flex;
  gap: 20px;
  margin: 10px 0;
}
.banner-image {
  max-width: 150px;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
}
.banner-info { flex: 1; }
.banner-info p { margin: 5px 0; color: #555; }
.banner-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.btn-edit, .btn-status, .btn-delete {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-edit { background: #5bc0de; color: white; }
.btn-edit:hover { background: #46b8da; }
.btn-status { background: #f0ad4e; color: white; }
.btn-status:hover { background: #ec971f; }
.btn-delete { background: #d9534f; color: white; }
.btn-delete:hover { background: #c9302c; }
</style>