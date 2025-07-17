import axios from "../utils/axios";
import { defineStore } from "pinia";

export const useEventCategoriesStore = defineStore('event-categories', {
  state: () => ({
    eventCategories: [],
    total: 0,
    loading: false
  }),
  actions: {
    async fetchEventCategories(page = 1, limit = 10, sortOrder = 'desc', q = '') {
      try {
        this.loading = true;
        const response = await axios.get('/event-categories', {
          params: { page, limit, sortOrder, q }
        });

        this.eventCategories = response.data.data || [];
        this.total = response.data.meta.total;
      } catch (error) {
        console.error('Lỗi khi load event categories:', error);
      } finally {
        this.loading = false;
      }
    },
    async updateEventCategory(id, eventCategory) {
      try {
        const response = await axios.put(`/event-categories/${id}`, eventCategory);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    async addEventCategory(eventCategory) {
      try {
        const response = await axios.post('/event-categories', eventCategory);
        this.eventCategories.unshift(response.data.data);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteEventCategory(id) {
      try {
        const response = await axios.delete(`/event-categories/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
});
