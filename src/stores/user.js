import { defineStore } from "pinia";
import { DEFAULT_PAGE, DEFAULT_SORT, LIMIT } from "../constants";
import axios from "../utils/axios";

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    total: 0,
    loading: false
  }),
  actions: {
    async fetchPaginationUsers(page = DEFAULT_PAGE, limit = LIMIT, sortOrder = 'desc', q = '') {
      try {
        this.loading = true;
        const response = await axios.get('/users', {
          params: { page, limit, sortOrder, q }
        });

        this.users = response.data.data || [];
        this.total = response.data.meta?.total || 0;

        return this.users;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await axios.get('/users');

        this.users = response.data.data || [];
        this.total = response.data.meta?.total || 0;

        return this.users;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async addUser(user) {
      try {
        this.loading = true;
        const response = await axios.post('/users', user);
        this.users.unshift(response.data.data);
        return response.data.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateUser(id, user) {
      try {
        this.loading = true;
        const response = await axios.put(`/users/${id}`, user);
        return response.data.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id) {
      try {
        this.loading = true;
        const response = await axios.delete(`/users/${id}`);
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async changePassword(oldPassword, newPassword) {
      try {
        this.loading = true;
        const response = await axios.post('/users/change-password', {
          oldPassword: oldPassword,
          newPassword: newPassword
        });
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
