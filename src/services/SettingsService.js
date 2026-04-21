import { api } from './api';
import { AuthService } from './AuthService.js';

// This service handles all the user settings stuff like profile updates and password changes.
export const SettingsService = {
  // Updates the user's profile info. We also sync the local storage so the UI knows who we are.
  async updateProfile(data) {
    const user = AuthService.getUser();
    const response = await api.post(`/auth/update-profile`, { ...data, id: user.id });
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Pretty straightforward - just sends the new password info to the server.
  async updatePassword(data) {
    const user = AuthService.getUser();
    return api.post(`/auth/update-password`, { ...data, id: user.id });
  }
};
