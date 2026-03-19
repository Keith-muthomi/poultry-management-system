import { api } from './api';

export const FinanceService = {
  getFinanceRecords: () => api.get('/finance'),
  createFinanceRecord: (data) => api.post('/finance', data),
  updateFinanceRecord: (id, data) => api.put(`/finance/${id}`, data),
  deleteFinanceRecord: (id) => api.delete(`/finance/${id}`)
};
