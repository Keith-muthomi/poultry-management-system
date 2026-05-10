const API_BASE_URL = '/api';

// Main helper to talk to our backend
export const api = {
  // Get the right headers, including the farm ID if we're logged in
  getHeaders() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = { 'Content-Type': 'application/json' };
    if (user.farm_id) headers['X-Farm-Id'] = user.farm_id;
    return headers;
  },

  // Basic GET request to fetch some data
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API GET] ${endpoint} failed:`, error);
      throw error;
    }
  },

  // POST request to send new stuff to the server
  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API POST] ${endpoint} failed:`, error);
      throw error;
    }
  },

  // PUT request when we need to update something existing
  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API PUT] ${endpoint} failed:`, error);
      throw error;
    }
  },

  // DELETE request to remove something
  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API DELETE] ${endpoint} failed:`, error);
      throw error;
    }
  }
};
