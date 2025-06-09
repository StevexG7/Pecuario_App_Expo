import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';
import { apiClient } from './api.client';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    name: string;
    // Add any other registration fields needed
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        
        await this.setTokens(response.token, response.refreshToken);
        return response;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(
            API_CONFIG.ENDPOINTS.AUTH.REGISTER,
            data
        );
        
        await this.setTokens(response.token, response.refreshToken);
        return response;
    }

    async logout(): Promise<void> {
        try {
            await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
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
            return null;
        }
    }

    private async setTokens(token: string, refreshToken: string): Promise<void> {
        await AsyncStorage.multiSet([
            ['auth_token', token],
            ['refresh_token', refreshToken],
        ]);
    }

    private async clearTokens(): Promise<void> {
        await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await AsyncStorage.getItem('auth_token');
        return !!token;
    }
}

export const authService = new AuthService(); 