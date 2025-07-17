import axios from "../utils/axios";
import { defineStore } from "pinia";
import { DEFAULT_PAGE, DEFAULT_SORT, LIMIT } from "../constants";

export const useInviteStore = defineStore('invite', {
  state: () => ({
    invites: [],
    total: 0,
    loading: false
  }),
  actions: {
    async getInvites(page = DEFAULT_PAGE, limit = LIMIT, sortOrder = DEFAULT_SORT.order, q = '') {
      try {
        this.loading = true;
        const response = await axios.get('/invite', {
          params: { page, limit, sortOrder, q }
        });

        this.invites = response.data.data || [];
        this.total = response.data.meta?.total || 0;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateInvite(id, invite) {
      try {
        const response = await axios.put(`/invite/${id}`, invite);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    async addInvite(invite) {
      try {
        const response = await axios.post('/invite', invite);
        this.invites.unshift(response.data.data);
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    async deleteInvite(id) {
      try {
        const response = await axios.delete(`/invite/${id}`);
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
});
