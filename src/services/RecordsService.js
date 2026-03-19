import { api } from './api';

export const RecordsService = {
  getTableRecords: (tableName) => api.get(`/records/${tableName}`)
};
