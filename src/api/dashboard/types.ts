export interface DashboardStat {
  total: number;
  avgPrice: number;
  avgPercent: number;
  occupyRate: number;
}

export interface DashboardPoint {
  label: string;
  value: number;
}

export interface DashboardData {
  stats: DashboardStat;
  trend: DashboardPoint[];
  types: DashboardPoint[];
}
