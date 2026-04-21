import { api } from './api';

// Helping admins manage users and data
export const AdminService = {
  // Get everyone on the platform
  async getAllUsers() {
    return api.get('/admin/users');
  },

  // Switch someone's status (like active/suspended)
  async updateUserStatus(id, status) {
    return api.post(`/admin/users/${id}/status`, { status });
  },

  // Kick a user off the system
  async deleteUser(id) {
    return api.delete(`/admin/users/${id}`);
  },

  // Download all our data as a JSON file
  async exportData() {
    const data = await api.get('/admin/export');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
