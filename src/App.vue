<template>
  <div id="app">
    <nav :class="{ 'menu-open': menuOpen }">
      <button
        class="hamburger"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="Abrir menú"
        @click="menuOpen = !menuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-left">
        <router-link to="/">Inicio</router-link>
        <router-link to="/operational" v-if="isAuthenticated && isAdmin">Banners</router-link>
        <router-link to="/admin/categories" v-if="isAuthenticated && isAdmin">Categorías</router-link>
        <router-link to="/admin/products" v-if="isAuthenticated && isAdmin">Productos</router-link>
        <router-link to="/admin/orders" v-if="isAuthenticated && isAdmin">Pedidos</router-link>
        <router-link to="/cart" v-if="isAuthenticated">Carrito</router-link>
        <router-link to="/admin/statistics" v-if="isAuthenticated && isAdmin">Estadísticas</router-link>
        <router-link to="/admin/evaluations" v-if="isAuthenticated && isAdmin">Evaluaciones</router-link>
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
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from './stores/user';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { isAuthenticated, isAdmin, user } = storeToRefs(userStore);

const menuOpen = ref(false);

// Cierra el menú al cambiar de ruta
watch(
  () => route.path,
  () => {
    menuOpen.value = false;
  }
);

const logout = async () => {
  menuOpen.value = false;
  await userStore.logout();
  router.push('/login');
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  overflow-x: hidden;
  max-width: 100%;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

#app {
  overflow-x: hidden;
}

img {
  max-width: 100%;
  height: auto;
}

/* ─────────── NAV (desktop) ─────────── */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f8f9fa;
  flex-wrap: wrap;
  gap: 1rem;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #2c3e50;
  border-radius: 2px;
}

.nav-left {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: #42b883;
}
nav a:hover {
  text-decoration: underline;
}

nav button:not(.hamburger) {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1rem;
}

/* ─────────── NAV (mobile) ─────────── */
@media (max-width: 1280px) {
  nav {
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem 1rem;
    gap: 0;
  }

  .hamburger {
    display: flex;
    align-self: flex-end;
  }

  /* Por defecto ocultos */
  .nav-left,
  .nav-right {
    display: none;
  }

  /* Solo visibles cuando nav tiene .menu-open */
  nav.menu-open .nav-left,
  nav.menu-open .nav-right {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-top: 0.5rem;
  }

  nav.menu-open .nav-left {
    gap: 0.25rem;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  nav.menu-open .nav-right {
    gap: 0.25rem;
  }

  nav a,
  nav .nav-right span {
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
  }

  nav a:active {
    background: #eef2f7;
  }

  nav .nav-right span {
    color: #6b7280;
  }

  nav .nav-right button:not(.hamburger) {
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    text-align: left;
  }

  nav .nav-right button:not(.hamburger):active {
    background: #fdecec;
  }
}
</style>