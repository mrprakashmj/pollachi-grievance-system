export interface DailyStats {
    date: string;
    totalComplaints: number;
    byDepartment: Record<string, number>;
    byStatus: Record<string, number>;
    averageResolutionTime: number;
}

export interface DepartmentPerformance {
    department: string;
    departmentLabel: string;
    totalComplaints: number;
    resolved: number;
    pending: number;
    inProgress: number;
    averageResolutionTime: number;
    satisfactionRating: number;
    slaCompliance: number;
}

export interface SystemAnalytics {
    totalComplaints: number;
    totalResolved: number;
    totalPending: number;
    totalInProgress: number;
    averageResolutionTime: number;
    overallSatisfaction: number;
    departmentPerformance: DepartmentPerformance[];
    dailyTrend: DailyStats[];
    topCategories: { category: string; count: number }[];
}
