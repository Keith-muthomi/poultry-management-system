import { api } from './api';

// Managing our bird batches
export const FlockService = {
  // Grab all our flocks
  async getFlocks() {
    return api.get('/flocks');
  },

  // Get details for just one flock
  async getFlock(id) {
    return api.get(`/flocks/${id}`);
  },

  // Add a new flock to the farm
  async createFlock(flockData) {
    return api.post('/flocks', flockData);
  },

  // Update info for an existing flock
  async updateFlock(id, flockData) {
    return api.put(`/flocks/${id}`, flockData);
  },

  // Remove a flock from the system
  async deleteFlock(id) {
    return api.delete(`/flocks/${id}`);
  }
};
