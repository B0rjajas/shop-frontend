<template>
  <div class="register-container">
    <h2>Registro de usuario</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label>Usuario</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Contraseña</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Registrarse</button>
    </form>
    <p v-if="message" :class="{ error: isError }">{{ message }}</p>
    <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import axios from '@/utils/axios';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const email = ref('');
const password = ref('');
const message = ref('');
const isError = ref(false);

const handleRegister = async () => {
  try {
    // Sin `role` en el body. El backend lo ignora desde la sesión 8
    // (siempre asigna 'user'), así que quitarlo aquí refleja el contrato real.
    const { data } = await axios.post('/api/users/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    userStore.setToken(data.access_token);
    userStore.setUser(data.user);
    message.value = 'Registro exitoso. Redirigiendo...';
    isError.value = false;
    setTimeout(() => router.push('/'), 1000);
  } catch (error: any) {
    message.value = error.response?.data?.message || 'Error de conexión';
    isError.value = true;
  }
};
</script>

<style scoped>
.register-container {
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
.error {
  color: red;
}
</style>