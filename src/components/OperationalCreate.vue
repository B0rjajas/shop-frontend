<template>
  <div class="operational-create">
    <h2>Crear Nuevo Banner</h2>
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div>
        <label>Nombre</label>
        <input v-model="form.name" type="text" required />
      </div>
      <div>
        <label>URL de destino (uri)</label>
        <input v-model="form.uri" type="text" required />
      </div>
      <div>
        <label>Contenido</label>
        <textarea v-model="form.content" rows="3"></textarea>
      </div>
      <div>
        <label>Imagen (cover)</label>
        <input type="file" @change="handleFileUpload" />
        <img 
          v-if="previewImage" 
          :src="previewImage" 
          alt="preview" 
          style="max-width: 200px; display: block; margin-top: 8px;" 
        />
      </div>
      <div>
        <label>Estado</label>
        <select v-model="form.status">
          <option :value="1">Activo</option>
          <option :value="0">Inactivo</option>
        </select>
      </div>
      <button type="submit">Guardar</button>
      <button type="button" @click="$router.push('/operational')">Cancelar</button>
    </form>
    <p v-if="message" :class="{ success: !error, error: error }">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useOperationalStore } from '../stores/operational';
import { getImageUrl } from '@/utils/image';

const router = useRouter();
const store = useOperationalStore();

const form = reactive({
  name: '',
  uri: '',
  content: '',
  cover: '',
  status: 1,
});

const file = ref<File | null>(null);
const previewImage = ref<string | null>(null);
const message = ref('');
const error = ref(false);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
    // Mostrar previsualización local
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(target.files[0]);
  }
};

const handleSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('uri', form.uri);
    formData.append('content', form.content);
    formData.append('status', String(form.status));
    if (file.value) {
      formData.append('cover', file.value);
    }

    await store.createBanner(formData);
    message.value = '✅ Banner creado correctamente';
    error.value = false;
    setTimeout(() => router.push('/operational'), 1500);
  } catch (err) {
    console.error(err);
    message.value = '❌ Error al crear banner. Revisa la consola.';
    error.value = true;
  }
};
</script>

<style scoped>
.operational-create {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
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
input, textarea, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button[type="button"] {
  background: #ccc;
  color: #333;
}
.success { color: green; }
.error { color: red; }
</style>