import { defineStore } from "pinia";
import axios from '../utils/axios';

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    departments: [],
    total: 0,
    loading: false
  }),
  actions: {
    async fetchDepartments(page = 1, limit = 10, sortOrder = 'desc', q = '') {
      try {
        this.loading = true;
        const response = await axios.get('/departments', {
          params: { page, limit, sortOrder, q }
        });

        this.departments = response.data.data || [];
        this.total = response.data.meta.total || 0;
        return this.departments;
      } catch (error) {
        console.error('Lỗi khi load departments:', error);
      } finally {
        this.loading = false;
      }
    },
    async addDepartment(department) {
      try {
        const response = await axios.post('/departments', department);
        this.departments.unshift(response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('Lỗi khi add department:', error);
        throw error;
      }
    },
    async updateDepartment(id, department) {
      try {
        const response = await axios.put(`/departments/${id}`, department);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteDepartment(id) {
      try {
        const response = await axios.delete(`/departments/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
});
