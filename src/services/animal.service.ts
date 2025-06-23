import { API_CONFIG } from '../config/api.config';
import { apiClient } from './api.client';

export interface Animal {
  nombre_lote: string;
  genero: string;
  proposito: string;
  raza: string;
  cantidad: number;
}

export interface FichaAnimal {
  id: number;
  nombre_lote: string;
  genero: string;
  raza: string;
  cantidad: number;
  proposito?: string;
  peso_general_lote?: number;
  peso_individual_estimado?: number;
}

// Interfaz para la respuesta del backend (estructura real)
export interface FichaBackend {
  lote_id: number;
  nombre_lote: string;
  cantidad_animales: number;
  peso_total: number;
  sexo: string;
  especie: string;
  raza?: string;
  proposito?: string;
  fecha_creacion?: string;
}

// Interfaz para el detalle de un lote específico
export interface DetalleLote {
  lote_id: number;
  nombre_lote: string;
  genero: string;
  proposito: string;
  raza: string;
  cantidad: number;
  peso_promedio_individual: number;
  peso_total_lote: number;
}

// Interfaz para la respuesta del cálculo de peso
export interface PesoLote {
  lote_id: number;
  nombre_lote: string;
  peso_general_lote: number;
  cantidad_animales: number;
  peso_individual_estimado: number;
}

export const registrarAnimal = async (data: Animal) => {
  return await apiClient.post(API_CONFIG.ENDPOINTS.ANIMAL.REGISTRAR, data);
};

export const obtenerMisFichas = async (): Promise<FichaAnimal[]> => {
  try {
    console.log('🚀 Iniciando llamada a obtenerMisFichas...');
    const response = await apiClient.get<FichaBackend[]>(API_CONFIG.ENDPOINTS.ANIMAL.MIS_FICHAS);
    
    // Log para debug: mostrar la estructura real del JSON recibido
    console.log('🔍 Respuesta del backend (obtenerMisFichas):', JSON.stringify(response, null, 2));
    console.log('📊 Tipo de respuesta:', typeof response);
    console.log('📊 Es array?', Array.isArray(response));
    console.log('📊 Longitud:', response ? (Array.isArray(response) ? response.length : 'No es array') : 'Response es null/undefined');
    
    if (response && Array.isArray(response)) {
      console.log('✅ Response es un array válido, procesando...');
      const fichasMapeadas = response.map((ficha, index) => {
        console.log(`📋 Procesando ficha ${index + 1}:`, ficha);
        
        const fichaMapeada = {
          id: ficha.lote_id,
          nombre_lote: ficha.nombre_lote || 'Sin nombre',
          genero: ficha.sexo || 'No especificado',
          raza: ficha.raza || ficha.especie || 'No especificada',
          cantidad: ficha.cantidad_animales || 0,
          proposito: ficha.proposito,
          peso_general_lote: ficha.peso_total,
          peso_individual_estimado: ficha.peso_total ? ficha.peso_total / ficha.cantidad_animales : undefined,
        };
        
        // Log para debug: mostrar cada ficha mapeada
        console.log('📋 Ficha mapeada:', fichaMapeada);
        
        return fichaMapeada;
      });
      
      console.log('🎉 Total de fichas mapeadas:', fichasMapeadas.length);
      return fichasMapeadas;
    } else {
      console.log('❌ Response no es un array válido');
      console.log('🔍 Intentando buscar estructura alternativa...');
      
      // Intentar diferentes estructuras posibles
      if (response && typeof response === 'object') {
        console.log('🔍 Keys disponibles en response:', Object.keys(response));
        
        // Buscar arrays en el objeto
        for (const key in response as any) {
          if (Array.isArray((response as any)[key])) {
            console.log(`🔍 Encontrado array en key "${key}":`, (response as any)[key]);
            return (response as any)[key].map((ficha: any) => ({
              id: ficha.lote_id || ficha.id,
              nombre_lote: ficha.nombre_lote || 'Sin nombre',
              genero: ficha.sexo || ficha.genero || 'No especificado',
              raza: ficha.raza || ficha.especie || 'No especificada',
              cantidad: ficha.cantidad_animales || ficha.cantidad || 0,
              proposito: ficha.proposito,
              peso_general_lote: ficha.peso_total || ficha.peso_total_lote || ficha.peso_general_lote,
              peso_individual_estimado: ficha.peso_promedio_individual || ficha.peso_individual_estimado,
            }));
          }
        }
      }
      
      return [];
    }
    
  } catch (error) {
    console.error('❌ Error al obtener fichas:', error);
    throw new Error('No se pudieron cargar las fichas de ganado');
  }
};

export const obtenerPesosLote = async (loteId: number): Promise<PesoLote | null> => {
  try {
    if (!loteId || isNaN(loteId)) {
      console.warn('⚠️ ID de lote inválido:', loteId);
      return null;
    }
    
    console.log(`🚀 Iniciando llamada a obtenerPesosLote para lote ${loteId}...`);
    console.log(`🔗 URL del endpoint: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANIMAL.OBTENER_PESOS}/${loteId}/pesos`);
    
    const response = await apiClient.get<PesoLote>(`${API_CONFIG.ENDPOINTS.ANIMAL.OBTENER_PESOS}/${loteId}/pesos`);
    
    console.log(`✅ Respuesta del endpoint de pesos para lote ${loteId}:`, JSON.stringify(response, null, 2));
    console.log(`📊 Tipo de respuesta:`, typeof response);
    console.log(`📊 Es objeto?`, typeof response === 'object');
    
    if (response) {
      console.log(`🎯 Datos de peso obtenidos para lote ${loteId}:`, {
        lote_id: response.lote_id,
        nombre_lote: response.nombre_lote,
        peso_general_lote: response.peso_general_lote,
        cantidad_animales: response.cantidad_animales,
        peso_individual_estimado: response.peso_individual_estimado
      });
    }
    
    return response;
  } catch (error: any) {
    // Si hay un error (ej. 404), no detenemos todo, solo devolvemos null.
    console.error(`❌ Error al obtener peso para lote ${loteId}:`, error);
    console.error(`❌ Detalles del error:`, {
      message: error?.message,
      status: error?.status,
      data: error?.data,
      response: error?.response?.data
    });
    return null;
  }
};

export const obtenerFicha = async (loteId: number): Promise<DetalleLote> => {
  try {
    console.log(`🔍 Obteniendo detalle del lote ${loteId}...`);
    const response = await apiClient.get<DetalleLote>(`${API_CONFIG.ENDPOINTS.ANIMAL.FICHA}/${loteId}`);
    console.log(`✅ Detalle del lote ${loteId}:`, response);
    return response;
  } catch (error: any) {
    console.error(`❌ Error al obtener detalle del lote ${loteId}:`, error);
    throw error;
  }
};

// Función para registrar peso de un animal individual
export const registrarPesoAnimal = async (animalId: number, peso: number) => {
  try {
    console.log(`🐄 Registrando peso ${peso}kg para animal ${animalId}...`);
    const response = await apiClient.post(`/animal/${animalId}/peso`, { peso });
    console.log('✅ Peso registrado exitosamente:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Error al registrar peso:', error);
    throw error;
  }
};

// Función para recalcular pesos de un lote
export const recalcularPesosLote = async (loteId: number) => {
  try {
    console.log(`🔄 Recalculando pesos para lote ${loteId}...`);
    const response = await apiClient.post(`/animal/lote/${loteId}/recalcular-pesos`);
    console.log('✅ Pesos recalculados:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Error al recalcular pesos:', error);
    throw error;
  }
};

// Función de prueba para verificar el endpoint de pesos
export const probarEndpointPesos = async (loteId: number) => {
  try {
    console.log(`🧪 Probando endpoint de pesos para lote ${loteId}...`);
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANIMAL.OBTENER_PESOS}/${loteId}/pesos`;
    console.log(`🔗 URL completa: ${url}`);
    
    const response = await apiClient.get(url);
    console.log(`✅ Prueba exitosa para lote ${loteId}:`, response);
    return response;
  } catch (error: any) {
    console.error(`❌ Prueba fallida para lote ${loteId}:`, error);
    return null;
  }
};

// Función para obtener el detalle completo de un lote con pesos
export const obtenerDetalleLoteConPesos = async (loteId: number): Promise<DetalleLote | null> => {
  try {
    console.log(`🔍 Obteniendo detalle completo del lote ${loteId}...`);
    const detalle = await obtenerFicha(loteId);
    
    console.log(`✅ Detalle completo del lote ${loteId}:`, {
      lote_id: detalle.lote_id,
      nombre_lote: detalle.nombre_lote,
      genero: detalle.genero,
      proposito: detalle.proposito,
      raza: detalle.raza,
      cantidad: detalle.cantidad,
      peso_promedio_individual: detalle.peso_promedio_individual,
      peso_total_lote: detalle.peso_total_lote
    });
    
    return detalle;
  } catch (error: any) {
    console.error(`❌ Error al obtener detalle completo del lote ${loteId}:`, error);
    return null;
  }
}; 