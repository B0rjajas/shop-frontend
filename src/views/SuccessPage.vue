<template>
    <div class="success-page">
      <h1>¡Pago exitoso! 🎉</h1>
      <p>Tu pedido ha sido confirmado. Recibirás un correo con los detalles.</p>
      <el-button type="primary" @click="goToOrders">Ver mis pedidos</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToOrders = () => {
    router.push('/orders');
  };
  </script>
  
  <style scoped>
  .success-page {
    text-align: center;
    padding: 60px 20px;
  }
  </style>