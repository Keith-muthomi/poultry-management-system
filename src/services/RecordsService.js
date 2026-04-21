import { api } from './api';

// Managing all the farm's supplies and records
export const RecordsService = {
  // Get all our supply records
  getSupplies: () => api.get('/records/supplies'),

  // Record a new supply entry
  createSupply: (data) => api.post('/records/supplies', data),

  // Fix a supply record
  updateSupply: (id, data) => api.put(`/records/supplies/${id}`, data),

  // Delete a supply record
  deleteSupply: (id) => api.delete(`/records/supplies/${id}`),
  
  // Generic way to get records from any table
  getTableRecords: (tableName) => api.get(`/records/table/${tableName}`)
};
