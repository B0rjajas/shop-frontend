import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

// Componentes públicos
import HomePage from '../views/HomePage.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';

// Admin
import OperationalList from '../components/OperationalList.vue';
import OperationalCreate from '../components/OperationalCreate.vue';
import OperationalEdit from '../components/OperationalEdit.vue';
import CategoryManager from '../components/CategoryManager.vue';
import ProductList from '../components/ProductList.vue';
import ProductEditor from '../components/ProductEditor.vue';
import OrderList from '../components/OrderList.vue';
import StatisticalComponent from '../components/StatisticalComponent.vue';

// Usuario logueado
import ShopCar from '../components/ShopCar.vue';
import OrderPage from '../components/OrderPage.vue';
import EvaluationPage from '../views/EvaluationPage.vue';
import SuccessPage from '../views/SuccessPage.vue';
import CancelPage from '../views/CancelPage.vue';

import SearchPage from '../views/SearchPage.vue';

const routes = [
  // ── Público ──
  { path: '/', component: HomePage },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/product/:id', component: ProductDetail, props: true },
  { path: '/search/:keyword', component: SearchPage, props: true },

  // ── Solo login ──
  { path: '/cart', component: ShopCar, meta: { requiresAuth: true } },
  { path: '/orders', component: OrderPage, meta: { requiresAuth: true } },
  { path: '/evaluation/:orderId', component: EvaluationPage, meta: { requiresAuth: true } },
  { path: '/success', component: SuccessPage, meta: { requiresAuth: true } },
  { path: '/cancel', component: CancelPage, meta: { requiresAuth: true } },

  // ── Solo admin ──
  { path: '/operational', component: OperationalList, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/operational/create', component: OperationalCreate, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/operational/edit/:id', component: OperationalEdit, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/categories', component: CategoryManager, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/products', component: ProductList, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/product/create', component: ProductEditor, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/product/:id', component: ProductEditor, meta: { requiresAuth: true, requiresAdmin: true }, props: true },
  { path: '/admin/orders', component: OrderList, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/statistics', component: StatisticalComponent, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;
  const isAdmin = userStore.isAdmin;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !isAdmin) {
    // Logueado pero no admin intentando /admin/*.
    // Lo mandamos al home. Podría ser una /403 dedicada, pero para el
    // tamaño del proyecto no merece la pena.
    next('/');
  } else {
    next();
  }
});

export default router;