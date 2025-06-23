import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api.config';

interface ErrorResponse {
    message?: string;
    [key: string]: any;
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

class ApiClient {
    private static instance: ApiClient;
    private axiosInstance: AxiosInstance;
    private isRefreshing = false;
    private failedQueue: {
        resolve: (value?: any) => void;
        reject: (reason?: any) => void;
        config: AxiosRequestConfig;
    }[] = [];

    private constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    const token = await AsyncStorage.getItem('auth_token');
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                } catch (error) {
                    console.error('Request interceptor error:', error);
                    return Promise.reject(error);
                }
            },
            (error) => {
                console.error('Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                // Log the error for debugging
                if (error.response?.data) {
                    console.error('Response error:', error.response.data);
                } else {
                    console.error('Response error:', error.message);
                }
                
                const originalRequest = error.config;
                if (!originalRequest) {
                    return Promise.reject(new ApiError(500, 'No request configuration available'));
                }

                // Handle network errors (no response)
                if (!error.response) {
                    return Promise.reject(new ApiError(0, 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'));
                }

                // Handle HTML responses (like ngrok error pages)
                if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
                    return Promise.reject(new ApiError(503, 'El servidor no está disponible en este momento. Inténtalo más tarde.'));
                }

                if (error.response.status === 401 && !this.isRefreshing) {
                    this.isRefreshing = true;
                    console.log('🔄 Intentando renovar token...');

                    try {
                        const refreshToken = await AsyncStorage.getItem('refresh_token');
                        if (!refreshToken) {
                            console.log('❌ No hay refresh token disponible');
                            throw new Error('No refresh token available');
                        }

                        console.log('🔄 Enviando solicitud de renovación...');
                        const response = await this.axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {
                            refreshToken,
                        });
                        
                        console.log('✅ Token renovado exitosamente');
                        const { token } = response.data;
                        await AsyncStorage.setItem('auth_token', token);
                        
                        // Retry all queued requests
                        this.failedQueue.forEach(({ resolve, reject, config }) => {
                            if (config.headers) {
                                config.headers.Authorization = `Bearer ${token}`;
                            }
                            this.axiosInstance(config)
                                .then(resolve)
                                .catch(reject);
                        });

                        this.failedQueue = [];
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return this.axiosInstance(originalRequest);
                    } catch (refreshError) {
                        console.error('❌ Error al renovar token:', refreshError);
                        // Clear tokens and queue
                        await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
                        this.failedQueue = [];
                        return Promise.reject(new ApiError(401, 'Sesión expirada. Por favor, inicia sesión nuevamente.'));
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                // Queue the request if we're already refreshing
                if (error.response.status === 401 && this.isRefreshing) {
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject, config: originalRequest });
                    });
                }

                // Handle other errors
                const status = error.response.status;
                const errorData = error.response.data as ErrorResponse;
                const message = errorData?.message || errorData?.error || this.getDefaultErrorMessage(status);
                
                // Si es un error de token expirado y no estamos refrescando, limpiar tokens
                if (status === 401 && !this.isRefreshing) {
                    console.log('🔒 Limpiando tokens por error de autenticación');
                    AsyncStorage.multiRemove(['auth_token', 'refresh_token']).catch(console.error);
                }
                
                return Promise.reject(new ApiError(status, message, errorData));
            }
        );
    }

    private getDefaultErrorMessage(status: number): string {
        switch (status) {
            case 400:
                return 'Solicitud inválida';
            case 401:
                return 'No autorizado';
            case 403:
                return 'Acceso denegado';
            case 404:
                return 'Recurso no encontrado';
            case 500:
                return 'Error interno del servidor';
            default:
                return 'Ha ocurrido un error inesperado';
        }
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.axiosInstance.delete<T>(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    private handleError(error: any): void {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || this.getDefaultErrorMessage(status);
            throw new ApiError(status, message, error.response?.data);
        }
        throw error;
    }
}

export const apiClient = ApiClient.getInstance(); 