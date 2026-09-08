<template>
  <div class="login-container">
    <h2>{{ isAdminMode ? 'Panel de Administración' : 'Iniciar sesión' }}</h2>
    
    <!-- Formulario de login -->
    <form @submit.prevent="handleLogin">
      <div>
        <label>Usuario</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Contraseña</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Iniciar sesión</button>
    </form>

    <hr />

    <!-- Formulario de registro -->
    <h3>{{ isAdminMode ? 'Registro de administrador' : 'Registro de usuario' }}</h3>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Usuario</label>
        <input v-model="regUsername" type="text" required />
      </div>
      <div>
        <label>Email</label>
        <input v-model="regEmail" type="email" required />
      </div>
      <div>
        <label>Contraseña</label>
        <input v-model="regPassword" type="password" required />
      </div>
      <button type="submit">Registrarse</button>
    </form>

    <p v-if="message" :class="{ error: isError }">{{ message }}</p>
    <p v-if="!isAdminMode">
      ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { API_URL } from '@/config';

// 📌 Prop para determinar si es el panel de administración
defineProps<{
  isAdminMode?: boolean; // true para ShopAdmin, false o undefined para Shop
}>();

const router = useRouter();
const userStore = useUserStore();

// Estado del formulario de login
const username = ref('');
const password = ref('');

// Estado del formulario de registro
const regUsername = ref('');
const regEmail = ref('');
const regPassword = ref('');

const message = ref('');
const isError = ref(false);

// ------------------- LOGIN -------------------
const handleLogin = async () => {
  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    userStore.setToken(data.token);
    userStore.setUser(data.user);
    message.value = 'Login exitoso. Redirigiendo...';
    isError.value = false;
    setTimeout(() => router.push('/'), 1000);
  } catch (error: any) {
    message.value = error.message || 'Error de conexión';
    isError.value = true;
  }
};

// ------------------- REGISTER -------------------
const handleRegister = async () => {
  try {
    // 📌 Determinar el rol según el modo
    const role = isAdminMode ? 'admin' : 'user';

    const response = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: regUsername.value,
        email: regEmail.value,
        password: regPassword.value,
        role: role, // 🔥 Enviamos el rol al backend
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrarse');
    }
    userStore.setToken(data.token);
    userStore.setUser(data.user);
    message.value = 'Registro exitoso. Redirigiendo...';
    isError.value = false;
    setTimeout(() => router.push('/'), 1000);
  } catch (error: any) {
    message.value = error.message || 'Error de conexión';
    isError.value = true;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
form div {
  margin-bottom: 1rem;
}
input {
  width: 100%;
  padding: 0.5rem;
}
button {
  width: 100%;
  padding: 0.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #33a06f;
}
.error {
  color: red;
}
hr {
  margin: 1.5rem 0;
}
</style>