import { api } from './api';

export const AdminService = {
  async getAllUsers() {
    return api.get('/admin/users');
  },

  async updateUserStatus(id, status) {
    return api.post(`/admin/users/${id}/status`, { status });
  },

  async deleteUser(id) {
    return api.delete(`/admin/users/${id}`);
  },

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
