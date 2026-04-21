import { api } from './api';

// Tracking how many eggs or birds we're producing
export const ProductionService = {
  // Get all our historical logs
  async getLogs() {
    return api.get('/production');
  },

  // See how we're doing so far today
  async getTodayStats() {
    return api.get('/production/today');
  },

  // Save a new production record
  async recordLog(data) {
    return api.post('/production', data);
  },

  // Delete a log if it was entered wrong
  async deleteLog(id) {
    return api.delete(`/production/${id}`);
  }
};
