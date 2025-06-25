export const API_CONFIG = {
    BASE_URL: 'https://719b-191-109-191-6.ngrok-free.app/api',
    TIMEOUT: 30000, // estos son 30 segundos de espera para la api
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            REFRESH_TOKEN: '/auth/refresh',
            REQUEST_RESET_CODE: '/auth/request-reset-code',
            VERIFY_RESET_CODE: '/auth/verify-reset-code',
            RESET_PASSWORD_WITH_CODE: '/auth/reset-password-with-code',
        },
        USER: {
            PROFILE: '/user/profile',
        },
        ANIMAL: {
            REGISTRAR: '/animal/registrar',
            MIS_FICHAS: '/animal/mis-fichas',
            FICHA: '/animal/ficha', 
            OBTENER_PESOS: '/animal/lote', 
            REGISTRAR_PESO_ANIMAL: '/animal', 
            RECALCULAR_PESOS_LOTE: '/animal/lote', 
        },
        LOTE: {
            REGISTRAR: '/lote/registrar',
            MIS_LOTES: '/lote/mis-lotes',
            DIETA: '/animal/lote',
            ELIMINAR: '/lote',
        },
    },
}; 