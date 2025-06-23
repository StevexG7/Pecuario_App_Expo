
export interface DailyActivity {
    id: string;
    type: 'completed' | 'reviews' | 'inventory';
    label: string;
    value: string;
    total: string;
}

export interface CattleStatus {
    total: number;
    healthy: number;
    sick: number;
}

export interface UpcomingTask {
    id: string;
    title: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
}

export interface EnergySavings {
    currentMonth: number;
    previousMonth: number;
    percentage: number;
}

export interface ActivityStats {
    cattleStatus: CattleStatus;
    upcomingTasks: UpcomingTask[];
    energySavings: EnergySavings;
}

// Servicio temporalmente deshabilitado - las rutas no existen en el backend actual
/*
class ActivitiesService {
    async getDailyActivities(): Promise<DailyActivity[]> {
        try {
            return await apiClient.get<DailyActivity[]>(API_CONFIG.ENDPOINTS.ACTIVITIES.DAILY);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to fetch daily activities');
        }
    }

    async getActivityStats(): Promise<ActivityStats> {
        try {
            return await apiClient.get<ActivityStats>(API_CONFIG.ENDPOINTS.ACTIVITIES.STATS);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to fetch activity stats');
        }
    }

    async getCattleStatus(): Promise<CattleStatus> {
        try {
            return await apiClient.get<CattleStatus>(API_CONFIG.ENDPOINTS.CATTLE.STATUS);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to fetch cattle status');
        }
    }

    async getUpcomingTasks(): Promise<UpcomingTask[]> {
        try {
            return await apiClient.get<UpcomingTask[]>(API_CONFIG.ENDPOINTS.CATTLE.UPCOMING);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to fetch upcoming tasks');
        }
    }

    async getEnergySavings(): Promise<EnergySavings> {
        try {
            return await apiClient.get<EnergySavings>(API_CONFIG.ENDPOINTS.ENERGY.SAVINGS);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to fetch energy savings');
        }
    }
}

export const activitiesService = new ActivitiesService();
*/ 