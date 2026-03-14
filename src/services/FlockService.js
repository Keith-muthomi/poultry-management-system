import { api } from './api';

/**
 * Service for handling all flock-related operations.
 */
export const FlockService = {
  /**
   * Fetch all flocks from the database.
   */
  async getFlocks() {
    return api.get('/flocks');
  },

  /**
   * Fetch a single flock by ID.
   */
  async getFlock(id) {
    return api.get(`/flocks/${id}`);
  },

  /**
   * Create a new poultry batch.
   */
  async createFlock(flockData) {
    return api.post('/flocks', flockData);
  },

  /**
   * Update an existing flock.
   */
  async updateFlock(id, flockData) {
    return api.put(`/flocks/${id}`, flockData);
  },

  /**
   * Remove a flock from the system.
   */
  async deleteFlock(id) {
    return api.delete(`/flocks/${id}`);
  }
};
