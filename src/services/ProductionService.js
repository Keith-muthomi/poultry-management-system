import { api } from './api';

export const ProductionService = {
  async getLogs() {
    return api.get('/production');
  },

  async getTodayStats() {
    return api.get('/production/today');
  },

  async recordLog(data) {
    return api.post('/production', data);
  },

  async deleteLog(id) {
    return api.delete(`/production/${id}`);
  }
};
