// src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import App from './App.vue';
import router from './router';
import { useUserStore } from './stores/user';

// Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// ECharts
import ECharts from 'vue-echarts';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([BarChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer]);

const pinia = createPinia();
const app = createApp(App);

// Registrar head (SEO dinámico)
const head = createHead();
app.use(head);

app.use(pinia);
app.use(router);
app.use(ElementPlus);

// 👇 CARGAR EL ESTADO DEL USUARIO DESDE LOCALSTORAGE
const userStore = useUserStore();
userStore.loadFromStorage();

// Registrar iconos de Element Plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// Registrar ECharts
app.component('v-chart', ECharts);

app.mount('#app');