import { api } from './api';

// Managing farm rules and procedures
export const ProtocolService = {
  // Get all the protocols we need to follow
  getProtocols: () => api.get('/protocols'),

  // Add a new protocol to the list
  createProtocol: (data) => api.post('/protocols', data),

  // Remove a protocol that's no longer needed
  deleteProtocol: (id) => api.delete(`/protocols/${id}`)
};
