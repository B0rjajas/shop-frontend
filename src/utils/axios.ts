// src/utils/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '@/stores/user';
import router from '@/router';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const instance = axios.create({
  baseURL,
  // ⚠️ CRUCIAL para refresh tokens en cookie HttpOnly.
  // Sin esto, el navegador ignora el Set-Cookie y no envía la cookie
  // en peticiones cross-origin (Vercel ↔ Render).
  withCredentials: true,
});

// ──────────────────────────────────────────────────────────
// 1. Request: añadir access token
// ──────────────────────────────────────────────────────────
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──────────────────────────────────────────────────────────
// 2. Single-flight: una sola llamada a /refresh aunque
//    haya varias peticiones concurrentes devolviendo 401
// ──────────────────────────────────────────────────────────
let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

// Endpoints donde un 401 significa "credenciales malas",
// no "token caducado". No hay que intentar refresh en ellos.
const skipRefreshUrls = [
  '/api/auth/refresh',
  '/api/users/login',
  '/api/users/register',
];

// ──────────────────────────────────────────────────────────
// 3. Response: manejar 401 con refresh + retry
// ──────────────────────────────────────────────────────────
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Solo actuamos en 401
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // No refrescar en endpoints excluidos
    const url = originalRequest.url ?? '';
    if (skipRefreshUrls.some((skip) => url.includes(skip))) {
      return Promise.reject(error);
    }

    // No reintentar dos veces la misma petición
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const userStore = useUserStore();

    // Si ya hay un refresh en curso, encolamos esta petición y esperamos
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(instance(originalRequest));
        });
      });
    }

    // Somos la primera petición con 401 → lanzamos el refresh
    isRefreshing = true;
    try {
      const res = await instance.post('/api/auth/refresh');
      const newToken = res.data.access_token as string;

      userStore.setToken(newToken);
      processQueue(newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return instance(originalRequest);
    } catch (refreshError) {
      // Refresh falló → limpiamos y mandamos a login
      processQueue(null);
      userStore.clearLocal();
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login');
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;