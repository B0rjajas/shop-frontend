// src/stores/user.ts
import { defineStore } from 'pinia';
import { API_URL } from '@/config';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    // 'token' aquí es el ACCESS token (JWT de 15 min).
    // El refresh token vive en una cookie HttpOnly, JS nunca lo ve.
    token: null as string | null,
    user: null as User | null,
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setUser(user: User) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    /**
     * Limpia el estado local sin tocar el backend.
     * Se usa desde el interceptor de axios cuando el refresh ya falló
     * (no tiene sentido pedir al backend revocar algo que ya está roto).
     */
    clearLocal() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    /**
     * Logout completo: revoca el refresh token en el backend (limpia
     * la cookie HttpOnly) y limpia el estado local.
     *
     * Se hace con fetch en vez de axios para evitar una dependencia
     * circular (axios.ts ya importa este store).
     */
    async logout() {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch {
        // Si el backend está caído, igual limpiamos. El usuario quiere salir.
      }
      this.clearLocal();
    },

    loadFromStorage() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token) this.token = token;
      if (user) this.user = JSON.parse(user);
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
  },
});