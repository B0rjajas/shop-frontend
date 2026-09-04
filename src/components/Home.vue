<template>
  <div class="home">
    <h1>Bienvenido a la tienda online</h1>
    <p v-if="user">Hola, {{ user.username }}!</p>
    <button @click="logout">Cerrar sesión</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.home {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}
button {
  padding: 0.5rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>