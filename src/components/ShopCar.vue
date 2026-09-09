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

const confirmOrderWithAddress = async () => {
  if (!address.value.trim()) {
    ElMessage.warning('Ingresa una dirección de envío');
    return;
  }
  try {
    await orderStore.createOrder(address.value);
    ElMessage.success('Pedido creado exitosamente');
    showCheckout.value = false;
    address.value = '';
    // Ahora redirigir a Stripe (o continuar con el pago)
    await stripeStore.createCheckoutSession();
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || 'Error al procesar el pago';
    ElMessage.error(msg);
    console.error('Error en confirmOrderWithAddress:', error);
  }
};

const handleCheckout = async () => {
  try {
    const data = await cart.createCheckoutSession();
    window.location.href = data.url;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || 'Error al iniciar el pago';
    ElMessage.error(msg);
    console.error('Error en handleCheckout:', error);
  }
};
</script>

<style scoped>
.shop-car { padding: 20px; }
.total { margin: 20px 0; font-size: 18px; }
</style>