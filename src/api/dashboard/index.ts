import { http } from '@/utils/request';
import type { DashboardData } from './types';

export * from './types';

export const getDashboard = () => http.get<DashboardData>('/dashboard');
