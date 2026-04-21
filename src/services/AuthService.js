import { api } from './api';

// Managing login, logout, and user sessions
export const AuthService = {
  // Try to log in and save user info if it works
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Extra check for admin actions
  async verifyAdmin(id, secondaryPassword) {
    return api.post('/auth/verify-admin', { id, secondaryPassword });
  },

  // Create a new account
  async register(data) {
    return api.post('/auth/register', data);
  },

  // Clear session and kick them to the login page
  logout() {
    localStorage.removeItem('user');
    window.location.href = '/auth';
  },

  // Quick check if someone is logged in
  isAuthenticated() {
    return localStorage.getItem('user') !== null;
  },

  // Get the current user's details from storage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
