import { api } from './api';

// Managing the money side of things
export const FinanceService = {
  // Get all money records
  getFinanceRecords: () => api.get('/finance'),
  
  // Record a new transaction
  createFinanceRecord: (data) => api.post('/finance', data),
  
  // Fix a mistake in a record
  updateFinanceRecord: (id, data) => api.put(`/finance/${id}`, data),
  
  // Delete a record we don't need anymore
  deleteFinanceRecord: (id) => api.delete(`/finance/${id}`)
};
