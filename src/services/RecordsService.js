import { api } from './api';

export const RecordsService = {
  getSupplies: () => api.get('/records/supplies'),
  createSupply: (data) => api.post('/records/supplies', data),
  updateSupply: (id, data) => api.put(`/records/supplies/${id}`, data),
  deleteSupply: (id) => api.delete(`/records/supplies/${id}`),
  
  // Generic explorer method used by RecordsPage.js
  getTableRecords: (tableName) => api.get(`/records/table/${tableName}`)
};
