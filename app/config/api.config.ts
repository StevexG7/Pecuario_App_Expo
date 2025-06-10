// Environment configuration
const ENV = {
    dev: {
        BASE_URL: 'https://fec1-191-111-11-85.ngrok-free.app/api',
    },
    prod: {
        BASE_URL: 'https://fec1-191-111-11-85.ngrok-free.app/api',
    }
};

// Get current environment
const getEnv = () => {
    // You can change this based on your build process
    return process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
};

export const API_CONFIG = {
    BASE_URL: ENV[getEnv()].BASE_URL,
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