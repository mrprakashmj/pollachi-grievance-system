import { DepartmentId } from '@/types/complaint';

export interface SubCategory {
    id: string;
    label: string;
}

export interface Department {
    id: DepartmentId;
    label: string;
    icon: string;
    color: string;
    collectionName: string;
    subCategories: SubCategory[];
}

export const DEPARTMENTS: Department[] = [
    {
        id: 'water_supply',
        label: 'Water Supply',
        icon: 'Droplets',
        color: '#3B82F6',
        collectionName: 'complaints_water_supply',
        subCategories: [
            { id: 'water_leakage', label: 'Water Leakage' },
            { id: 'no_water_supply', label: 'No Water Supply' },
            { id: 'low_pressure', label: 'Low Pressure Issues' },
            { id: 'water_quality', label: 'Water Quality Problems' },
            { id: 'pipe_burst', label: 'Pipe Burst' },
            { id: 'new_connection', label: 'New Connection Requests' },
            { id: 'billing_issues', label: 'Billing Issues' },
        ],
    },
    {
        id: 'electricity',
        label: 'Electricity / Power',
        icon: 'Zap',
        color: '#F59E0B',
        collectionName: 'complaints_electricity',
        subCategories: [
            { id: 'power_outage', label: 'Power Outage' },
            { id: 'street_light', label: 'Street Light Malfunction' },
            { id: 'voltage_fluctuation', label: 'Voltage Fluctuation' },
            { id: 'meter_problems', label: 'Meter Problems' },
            { id: 'new_connection', label: 'New Connection' },
            { id: 'billing_disputes', label: 'Billing Disputes' },
            { id: 'transformer_issues', label: 'Transformer Issues' },
        ],
    },
    {
        id: 'sanitation',
        label: 'Sanitation / Waste Management',
        icon: 'Trash2',
        color: '#10B981',
        collectionName: 'complaints_sanitation',
        subCategories: [
            { id: 'garbage_not_collected', label: 'Garbage Not Collected' },
            { id: 'overflowing_bins', label: 'Overflowing Bins' },
            { id: 'street_cleaning', label: 'Street Cleaning Issues' },
            { id: 'drain_blockage', label: 'Drain Blockage' },
            { id: 'sewer_problems', label: 'Sewer Problems' },
            { id: 'illegal_dumping', label: 'Illegal Dumping' },
            { id: 'public_toilet', label: 'Public Toilet Maintenance' },
        ],
    },
    {
        id: 'roads',
        label: 'Roads & Transportation',
        icon: 'Route',
        color: '#8B5CF6',
        collectionName: 'complaints_roads',
        subCategories: [
            { id: 'potholes', label: 'Potholes' },
            { id: 'road_damage', label: 'Road Damage / Cracks' },
            { id: 'traffic_signal', label: 'Traffic Signal Malfunction' },
            { id: 'construction_delays', label: 'Road Construction Delays' },
            { id: 'street_name_boards', label: 'Missing Street Name Boards' },
            { id: 'bus_stop', label: 'Bus Stop Maintenance' },
            { id: 'pedestrian_crossing', label: 'Pedestrian Crossing Issues' },
        ],
    },
    {
        id: 'health',
        label: 'Health Services',
        icon: 'Heart',
        color: '#EF4444',
        collectionName: 'complaints_health',
        subCategories: [
            { id: 'public_toilet', label: 'Public Toilet Maintenance' },
            { id: 'disease_outbreak', label: 'Disease Outbreak Reports' },
            { id: 'vaccination', label: 'Vaccination Drive Requests' },
            { id: 'sanitation_inspection', label: 'Sanitation Inspection' },
            { id: 'pest_control', label: 'Pest Control Requests' },
            { id: 'food_safety', label: 'Food Safety Complaints' },
            { id: 'hospital_facility', label: 'Hospital Facility Issues' },
        ],
    },
    {
        id: 'education',
        label: 'Education',
        icon: 'GraduationCap',
        color: '#EC4899',
        collectionName: 'complaints_education',
        subCategories: [
            { id: 'school_infrastructure', label: 'School Infrastructure Problems' },
            { id: 'teacher_shortage', label: 'Teacher Shortage / Issues' },
            { id: 'midday_meal', label: 'Mid-day Meal Quality' },
            { id: 'school_maintenance', label: 'School Maintenance' },
            { id: 'facility_upgrades', label: 'Facility Upgrades Needed' },
            { id: 'safety_concerns', label: 'Safety Concerns' },
            { id: 'educational_material', label: 'Educational Material Shortage' },
        ],
    },
];

export const getDepartmentById = (id: DepartmentId): Department | undefined => {
    return DEPARTMENTS.find((dept) => dept.id === id);
};

export const getCollectionName = (departmentId: DepartmentId): string => {
    const dept = getDepartmentById(departmentId);
    return dept?.collectionName || 'complaints_water_supply';
};

export const getDepartmentLabel = (id: DepartmentId): string => {
    return getDepartmentById(id)?.label || id;
};
