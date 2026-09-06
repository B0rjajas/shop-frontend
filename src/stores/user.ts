import { defineStore } from 'pinia';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;  // 👈 añadir
}

export const useUserStore = defineStore('user', {
  state: () => ({
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
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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