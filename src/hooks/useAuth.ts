import { useEffect, useState } from 'react';
import { ApiError } from '../services/api.client';
import { AuthResponse, authService } from '../services/auth.service';

export interface AuthState {
    user: AuthResponse['user'] | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

export const useAuth = () => {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
        isAuthenticated: false,
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const isAuthenticated = await authService.isAuthenticated();
            if (isAuthenticated) {
                const userData = await authService.getCurrentUser();
                setState(prev => ({
                    ...prev,
                    user: userData,
                    isAuthenticated: !!userData,
                    loading: false,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    loading: false,
                }));
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err instanceof ApiError ? err.message : 'Error checking authentication status',
                loading: false,
            }));
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await authService.login({ email, password });
            setState(prev => ({
                ...prev,
                user: response.user,
                isAuthenticated: true,
                loading: false,
            }));
            return response;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Invalid credentials';
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false,
            }));
            throw err;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            const response = await authService.register({ name, email, password });
            setState(prev => ({
                ...prev,
                user: response.user,
                isAuthenticated: true,
                loading: false,
            }));
            return response;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Registration failed';
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false,
            }));
            throw err;
        }
    };

    const logout = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            await authService.logout();
            setState({
                user: null,
                loading: false,
                error: null,
                isAuthenticated: false,
            });
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Error during logout';
            setState(prev => ({
                ...prev,
                error: errorMessage,
                loading: false,
            }));
            throw err;
        }
    };

    const clearError = () => {
        setState(prev => ({ ...prev, error: null }));
    };

    return {
        ...state,
        login,
        register,
        logout,
        clearError,
    };
}; 