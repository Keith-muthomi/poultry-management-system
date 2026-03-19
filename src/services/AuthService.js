import { api } from './api';

export const AuthService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async verifyAdmin(id, secondaryPassword) {
    return api.post('/auth/verify-admin', { id, secondaryPassword });
  },

  async register(data) {
    return api.post('/auth/register', data);
  },

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/auth';
  },

  isAuthenticated() {
    return localStorage.getItem('user') !== null;
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
