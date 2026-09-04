import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

// Componentes públicos
import HomePage from '../views/HomePage.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';

// Componentes de administración (requieren autenticación)
import OperationalList from '../components/OperationalList.vue';
import OperationalCreate from '../components/OperationalCreate.vue';
import OperationalEdit from '../components/OperationalEdit.vue';
import CategoryManager from '../components/CategoryManager.vue';
import ProductList from '../components/ProductList.vue';
import ProductEditor from '../components/ProductEditor.vue';


import ShopCar from '../components/ShopCar.vue';
import OrderPage from '../components/OrderPage.vue';
import OrderList from '../components/OrderList.vue';

import SearchPage from '../views/SearchPage.vue';
import EvaluationPage from '../views/EvaluationPage.vue';

import StatisticalComponent from '../components/StatisticalComponent.vue';

import SuccessPage from '../views/SuccessPage.vue';
import CancelPage from '../views/CancelPage.vue';


const routes = [
  // Rutas públicas
  { path: '/', component: HomePage },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/product/:id', component: ProductDetail, props: true },

  // Rutas de administración (requieren autenticación)
  { path: '/operational', component: OperationalList, meta: { requiresAuth: true } },
  { path: '/operational/create', component: OperationalCreate, meta: { requiresAuth: true } },
  { path: '/operational/edit/:id', component: OperationalEdit, meta: { requiresAuth: true } },
  { path: '/admin/categories', component: CategoryManager, meta: { requiresAuth: true } },
  { path: '/admin/products', component: ProductList, meta: { requiresAuth: true } },
  { path: '/admin/product/create', component: ProductEditor, meta: { requiresAuth: true } },
  { path: '/admin/product/:id', component: ProductEditor, meta: { requiresAuth: true }, props: true },
  { path: '/cart', component: ShopCar, meta: { requiresAuth: true } },
  { path: '/orders', component: OrderPage, meta: { requiresAuth: true } },
  { path: '/admin/orders', component: OrderList, meta: { requiresAuth: true } },
  { path: '/search/:keyword', component: SearchPage, props: true },
  { path: '/evaluation/:orderId', component: EvaluationPage, meta: { requiresAuth: true } },
  
  { path: '/admin/statistics', component: StatisticalComponent, meta: { requiresAuth: true } },

  { path: '/success', component: SuccessPage, meta: { requiresAuth: true } },
  { path: '/cancel', component: CancelPage, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;