export const APP_CONFIG = {
    name: 'PMC Grievance Redressal System',
    shortName: 'PMC GRS',
    description: 'Grievance Redressal System for Pollachi Municipal Corporation',
    organization: 'Pollachi Municipal Corporation',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov'],
    complaintIdPrefix: 'POL',
    autoCloseAfterDays: 7,
    sessionTimeoutMinutes: 30,
    slaDefaultDays: 7,
    paginationLimit: 10,
} as const;

export const DEPARTMENT_CODES: Record<string, string> = {
    water_supply: 'WATER',
    electricity: 'ELEC',
    sanitation: 'SANI',
    roads: 'ROAD',
    health: 'HLTH',
    education: 'EDUC',
};
