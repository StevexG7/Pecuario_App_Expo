import { apiClient } from './api.client';

export const getMisLotes = async () => {
  return await apiClient.get('/lote/mis-lotes');
};

export const getMisFichas = async () => {
  return await apiClient.get('/ingreso/mis-fichas');
}; 