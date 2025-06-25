import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';
import { apiClient, ApiError } from './api.client';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: AuthUser;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH.LOGIN,
            credentials
        );

        if (!response.token || !response.refreshToken || !response.user) {
            throw new ApiError(400, 'Respuesta de autenticación inválida del servidor.');
        }

        await this.setTokens(response.token, response.refreshToken);
        return response;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            await apiClient.post(
                API_CONFIG.ENDPOINTS.AUTH.REGISTER,
                {
                    nombre: data.name,
                    email: data.email,
                    password: data.password,
                }
            );
            
            const loginResponse = await this.login({
                email: data.email,
                password: data.password,
            });

            return loginResponse;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Error al intentar registrar usuario');
        }
    }

    async logout(): Promise<void> {
        try {
            await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            await this.clearTokens();
        }
    }

    async getCurrentUser(): Promise<AuthResponse['user'] | null> {
        try {
            const response = await apiClient.get<AuthResponse['user']>(
                API_CONFIG.ENDPOINTS.USER.PROFILE
            );
            return response;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    private async setTokens(token: string, refreshToken: string): Promise<void> {
        try {
            await AsyncStorage.multiSet([
                ['auth_token', token],
                ['refresh_token', refreshToken],
            ]);
        } catch (error) {
            console.error('Error setting tokens:', error);
            throw new ApiError(500, 'Error al guardar las credenciales');
        }
    }

    private async clearTokens(): Promise<void> {
        try {
            await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
        } catch (error) {
            console.error('Error clearing tokens:', error);
        }
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            return !!token;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }
}

export const authService = new AuthService(); 