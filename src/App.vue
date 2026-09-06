<template>
  <div id="app">
    <nav>
      <div class="nav-left">
        <router-link to="/">Inicio</router-link>
        <router-link to="/operational" v-if="isAuthenticated">Banners</router-link>
        <router-link to="/admin/categories" v-if="isAuthenticated">Categorías</router-link>
        <router-link to="/admin/products" v-if="isAuthenticated">Productos</router-link>
        <router-link to="/admin/orders" v-if="isAuthenticated && isAdmin">Pedidos</router-link>
        <router-link to="/cart" v-if="isAuthenticated">Carrito</router-link>
        <router-link to="/admin/statistics" v-if="isAuthenticated && isAdmin">Estadísticas</router-link>
      </div>
      <div class="nav-right">
        <template v-if="isAuthenticated">
          <span>Hola, {{ user?.username || 'Usuario' }}</span>
          <button @click="logout">Cerrar sesión</button>
        </template>
        <template v-else>
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Registro</router-link>
        </template>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';
import { storeToRefs } from 'pinia';

const router = useRouter();
const userStore = useUserStore();
const { isAuthenticated, isAdmin, user } = storeToRefs(userStore);

const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f8f9fa;
}
nav a {
  text-decoration: none;
  color: #42b883;
  margin-right: 1rem;
}
nav a:hover {
  text-decoration: underline;
}
nav button {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1rem;
}
nav .nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>