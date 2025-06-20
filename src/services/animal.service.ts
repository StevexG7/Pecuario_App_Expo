import { apiClient } from './api.client';

export interface Animal {
  genero: string;
  proposito: string;
  raza: string;
  cantidad: number;
}

export const registrarAnimal = async (data: Animal) => {
  return await apiClient.post('/ingreso/registrar', data);
}; 