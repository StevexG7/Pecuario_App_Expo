import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';
import { apiClient, ApiError } from './api.client';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    nombre: string;
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    name?: string;
    nombre?: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: AuthUser;
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<any>(
            API_CONFIG.ENDPOINTS.AUTH.LOGIN,
            credentials
        );

        const user = response.user || (response.usuario && {
            id: response.usuario.id,
            name: response.usuario.nombre,
            email: response.usuario.email
        });

        if (!response.token || !response.refreshToken || !user) {
            throw new ApiError(400, 'Respuesta de autenticación inválida');
        }

        await this.setTokens(response.token, response.refreshToken);
        return { token: response.token, refreshToken: response.refreshToken, user };
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            const response: any = await apiClient.post(
                API_CONFIG.ENDPOINTS.AUTH.REGISTER,
                data
            );
            
            const user = response.user || (response.usuario && {
                id: response.usuario.id,
                name: response.usuario.nombre,
                email: response.usuario.email
            });

            if (!response.token || !response.refreshToken || !user) {
                throw new ApiError(400, 'Respuesta de registro inválida');
            }

            await this.setTokens(response.token, response.refreshToken);
            return { token: response.token, refreshToken: response.refreshToken, user };
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