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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const username = ref('');
const email = ref('');
const password = ref('');
const message = ref('');
const isError = ref(false);
const router = useRouter();
const userStore = useUserStore();

const handleRegister = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
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
