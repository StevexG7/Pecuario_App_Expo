export const API_CONFIG = {
    BASE_URL: 'https://703f-179-1-226-179.ngrok-free.app/api',
    TIMEOUT: 30000, // estos son 30 segundos de espera para la api
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/usuarionuevo',
            LOGOUT: '/auth/logout',
            REFRESH_TOKEN: '/auth/refresh-token',
        },
        USER: {
            PROFILE: '/user/profile',
            UPDATE_PROFILE: '/user/profile',
        },
        ACTIVITIES: {
            DAILY: '/activities/daily',
            STATS: '/activities/stats',
        },
        CATTLE: {
            STATUS: '/cattle/status',
            UPCOMING: '/cattle/upcoming',
        },
        ENERGY: {
            SAVINGS: '/energy/savings',
        },
    },
}; 