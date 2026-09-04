<template>
    <div class="cancel-page">
      <h1>Pago cancelado</h1>
      <p>No se ha realizado ningún cargo. Puedes volver al carrito.</p>
      <el-button type="primary" @click="goToCart">Ir al carrito</el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToCart = () => {
    router.push('/cart');
  };
  </script>
  
  <style scoped>
  .cancel-page {
    text-align: center;
    padding: 60px 20px;
  }
  </style>