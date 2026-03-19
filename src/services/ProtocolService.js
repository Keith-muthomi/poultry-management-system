import { api } from './api';

export const ProtocolService = {
  getProtocols: () => api.get('/protocols'),
  createProtocol: (data) => api.post('/protocols', data),
  deleteProtocol: (id) => api.delete(`/protocols/${id}`)
};
