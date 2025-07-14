import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
  },
  actions: {
    login(userData) {      
      this.user = userData.user;
      this.token = userData.token;

      // Save data user login to localStorage
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('token', userData.token);
    },
    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    updateUser(updatedData) {
      this.user = { ...this.user, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedData));
    }
  }
});
