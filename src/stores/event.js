import { defineStore } from "pinia";
import { DEFAULT_PAGE, DEFAULT_SORT, PAGE_SIZE } from "../constants";
import axios from "../utils/axios";

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [],
    total: 0,
    loading: false
  }),
  actions: {
    async fetchEvents(page = DEFAULT_PAGE, limit = PAGE_SIZE, sortOrder = DEFAULT_SORT.order, q = '') {
      try {
        this.loading = true;
        const response = await axios.get('/events', {
          params: { page, limit, sortOrder, q }
        });

        this.events = response.data.data || [];
        this.total = response.data.meta?.total || 0;

        return this.events;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async addEvent(event) {
      try {
        this.loading = true;
        const response = await axios.post('/events', { ...event });
        return response.data.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateEvent(eventId, event) {
      try {
        this.loading = true;
        const response = await axios.put(`/events/${eventId}`, { ...event });
        return response.data.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteEvent(eventId) {
      try {
        const response = await axios.patch(`/events/${eventId}/cancel`);
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
});
