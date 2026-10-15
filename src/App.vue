<template>
  <div id="app">
    <nav :class="{ 'menu-open': menuOpen }">
      <!-- Mobile header: logo + hamburger -->
      <div class="nav-mobile-header">
        <router-link to="/" class="brand-logo">
          <img src="/logo.png" alt="VitaSport" class="logo-img" />
        </router-link>

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
      </div>

      <!-- Desktop: logo a la izquierda -->
      <router-link to="/" class="brand-logo brand-desktop">
        <img src="/logo.png" alt="VitaSport" class="logo-img" />
      </router-link>

      <div class="nav-left">
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

    <main class="main-content">
      <router-view />
    </main>

    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-section">
          <img src="/logo.png" alt="VitaSport" class="footer-logo" />
          <p class="footer-tagline">Material deportivo de calidad</p>
        </div>

        <div class="footer-section">
          <h4>Tienda</h4>
          <router-link to="/">Inicio</router-link>
          <router-link to="/cart">Carrito</router-link>
          <router-link to="/orders">Mis pedidos</router-link>
        </div>

        <div class="footer-section">
          <h4>Cuenta</h4>
          <router-link to="/login">Iniciar sesión</router-link>
          <router-link to="/register">Registrarse</router-link>
        </div>

        <div class="footer-section">
          <h4>Contacto</h4>
          <p>hola@vitasport.pro</p>
          <p>España</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ new Date().getFullYear() }} VitaSport — Todos los derechos reservados</p>
      </div>
    </footer>
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
/* ─────────── Reset básico ─────────── */
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
  min-height: 100vh;
}

#app {
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
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
  padding: 0.75rem 2rem;
  background: #f8f9fa;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.brand-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

/* ✅ Logo a 40px de alto (tamaño correcto) */
.logo-img {
  height: 100px;
  width: auto;
  object-fit: contain;
}

.brand-desktop {
  display: none;
}

.nav-mobile-header {
  display: none;
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
  flex: 1;
  justify-content: center;
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

@media (min-width: 1025px) {
  .brand-desktop {
    display: flex;
  }
}

/* ─────────── NAV (mobile) ─────────── */
@media (max-width: 1024px) {
  nav {
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem 1rem;
    gap: 0;
  }

  .brand-desktop {
    display: none;
  }

  .nav-mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .hamburger {
    display: flex;
    align-self: auto;
  }

  .nav-left,
  .nav-right {
    display: none;
  }

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

/* ─────────── FOOTER (oscuro) ─────────── */
.site-footer {
  background: #f8f9fa;
  color: #ecf0f1;
  padding: 40px 20px 0;
  margin-top: 60px;
}

.footer-content {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section h4 {
  color: #42b883;
  font-size: 1rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.footer-section p,
.footer-section a {
  display: block;
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.9rem;
  margin: 6px 0;
  transition: color 0.2s;
}

.footer-section a:hover {
  color: #42b883;
  text-decoration: none;
}

/* ✅ Logo del footer a 50px de alto (antes estaba a 100px) */
.footer-logo {
  height: 50px;
  width: auto;
  margin-bottom: 12px;
  border-radius: 6px;
}

.footer-tagline {
  color: #95a5a6 !important;
  font-style: italic;
  font-size: 0.85rem !important;
}

.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 0;
  text-align: center;
  color: #7f8c8d;
  font-size: 0.85rem;
}

/* ─────────── FOOTER (tablet) ─────────── */
@media (max-width: 768px) {
  .site-footer {
    padding: 30px 16px 0;
    margin-top: 40px;
  }

  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding-bottom: 24px;
  }

  .footer-logo {
    height: 40px;
  }
}

/* ─────────── FOOTER (móvil) ─────────── */
@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-logo {
    margin: 0 auto 12px;
    display: block;
  }
}
</style>