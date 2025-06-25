import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    login(userData) {
      this.user = userData.user;
      this.token = userData.token;
    },
    logout() {
      this.user = null;
      this.token = null;
    }
  }
});
