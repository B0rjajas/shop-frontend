<template>
  <div class="shop-car">
    <h2>Mi Carrito</h2>
    <el-table :data="cart.items" style="width: 100%">
      <el-table-column prop="product.name" label="Producto" />
      <el-table-column prop="product.price" label="Precio">
        <template #default="{ row }">
          ${{ row.product.discounted_price || row.product.price }}
        </template>
      </el-table-column>
      <el-table-column label="Cantidad">
        <template #default="{ row, $index }">
          <el-input-number
            v-model="row.quantity"
            :min="1"
            @change="updateItem($index, row.quantity)"
          />
        </template>
      </el-table-column>
      <el-table-column label="Subtotal">
        <template #default="{ row }">
          ${{ ((row.product.discounted_price || row.product.price) * row.quantity).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="Acciones">
        <template #default="{ $index }">
          <el-button type="danger" size="small" @click="removeItem($index)">Eliminar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="total">
      <strong>Total: ${{ cart.totalPrice.toFixed(2) }}</strong>
    </div>

    <el-button type="primary" :disabled="cart.items.length === 0" @click="showCheckout = true">
      Proceder al pago
    </el-button>
    <el-button type="primary" :disabled="cart.items.length === 0" @click="handleCheckout">
      Pagar con Stripe
    </el-button>

    <el-dialog v-model="showCheckout" title="Confirmar pedido" width="400px">
      <el-form>
        <el-form-item label="Dirección de envío">
          <el-input v-model="address" placeholder="Calle, número, ciudad..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCheckout = false">Cancelar</el-button>
        <el-button type="primary" @click="confirmOrderWithAddress">Crear pedido</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { useOrderStore } from '../stores/order';
import { useStripeStore } from '../stores/stripe';
import { ElMessage } from 'element-plus';

const cart = useCartStore();
const orderStore = useOrderStore();
const stripeStore = useStripeStore();
const showCheckout = ref(false);
const address = ref('');

const updateItem = (index: number, quantity: number) => {
  const newItems = cart.items.map((item, i) =>
    i === index ? { ...item, quantity } : item
  );
  cart.updateCart(newItems);
};

const removeItem = (index: number) => {
  const newItems = cart.items.filter((_, i) => i !== index);
  cart.updateCart(newItems);
};

// 🔥 CORREGIDO: Ya no crea el pedido aquí, se lo pasa al backend de Stripe
const confirmOrderWithAddress = async () => {
  if (!address.value.trim()) {
    ElMessage.warning('Ingresa una dirección de envío');
    return;
  }
  try {
    // ✅ Pasamos la dirección al backend de Stripe, él creará el pedido
    await stripeStore.createCheckoutSession(address.value);
    // No llamamos a createOrder aquí
    showCheckout.value = false;
    address.value = '';
    // El backend ya redirige a Stripe
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Error al procesar el pago';
    ElMessage.error(msg);
    console.error('Error en checkout:', error);
  }
};

const handleCheckout = async () => {
  try {
    // Para el pago rápido sin dirección, también enviamos una dirección genérica o la pedimos aquí
    // Como es un flujo alternativo, puedes redirigir al modal o hacer lo mismo.
    // Por simplicidad, si no hay dirección, pedimos que use el modal.
    if (!address.value.trim()) {
      showCheckout.value = true;
      return;
    }
    await stripeStore.createCheckoutSession(address.value);
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Error al iniciar el pago';
    ElMessage.error(msg);
    console.error('Error en Stripe:', error);
  }
};
</script>

<style scoped>
.shop-car { padding: 20px; }
.total { margin: 20px 0; font-size: 18px; }
</style>