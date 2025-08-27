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
    async fetchEvents(params = {}) {
      try {
        this.loading = true;

        const defaultParams = {
          page: DEFAULT_PAGE,
          limit: PAGE_SIZE,
          sortOrder: DEFAULT_SORT.order,
          q: '',
          startDate: null,
          endDate: null,
          eventCategory: null
        };

        const finalParams = {...defaultParams, ...params}

        const response = await axios.get('/events', {
          params: finalParams
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
    },
    async fetchMyEvents() {
      try {
        this.loading = true;

        const response = await axios.get('/events/my-events');
        this.events = response.data.data || [];
        return this.events;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchAllEvents() {
      try {
        this.loading = true;
        const response = await axios.get('/events');

        this.events = response.data.data || [];
        this.total = response.data.meta?.total || 0;

        return this.events;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
  }
});
