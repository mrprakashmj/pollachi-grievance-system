export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',

    // Public user routes
    DASHBOARD: '/dashboard',
    COMPLAINTS: '/complaints',
    COMPLAINT_DETAIL: (id: string) => `/complaints/${id}`,
    NEW_COMPLAINT: '/new-complaint',
    PROFILE: '/profile',

    // Department head routes
    DEPT_DASHBOARD: '/department/dashboard',
    DEPT_COMPLAINTS: '/department/complaints',
    DEPT_COMPLAINT_DETAIL: (id: string) => `/department/complaints/${id}`,
    DEPT_ANALYTICS: '/department/analytics',
    DEPT_TEAM: '/department/team',

    // Admin routes
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_DEPARTMENTS: '/admin/departments',
    ADMIN_USERS: '/admin/users',
    ADMIN_COMPLAINTS: '/admin/complaints',
    ADMIN_REPORTS: '/admin/reports',
    ADMIN_SETTINGS: '/admin/settings',
} as const;
