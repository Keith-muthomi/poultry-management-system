import { api } from './api';
import { AuthService } from './AuthService.js';

export const SettingsService = {
  async updateProfile(data) {
    const user = AuthService.getUser();
    const response = await api.post(`/auth/update-profile`, { ...data, id: user.id });
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  async updatePassword(data) {
    const user = AuthService.getUser();
    return api.post(`/auth/update-password`, { ...data, id: user.id });
  }
};
