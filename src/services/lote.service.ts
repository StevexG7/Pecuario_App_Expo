import { API_CONFIG } from '../config/api.config';
import { apiClient } from './api.client';

export interface Lote {
  id: number;
  nombre: string;
  descripcion?: string;
  // Agregar más campos según la respuesta del backend
}

export const registrarLote = async (data: Partial<Lote>) => {
  return await apiClient.post(API_CONFIG.ENDPOINTS.LOTE.REGISTRAR, data);
};

export const getMisLotes = async () => {
  return await apiClient.get<Lote[]>(API_CONFIG.ENDPOINTS.LOTE.MIS_LOTES);
};

export const eliminarLote = async (loteId: number) => {
  return await apiClient.delete(`${API_CONFIG.ENDPOINTS.LOTE.ELIMINAR}/${loteId}`);
}; 