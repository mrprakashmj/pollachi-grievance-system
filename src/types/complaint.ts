export type ComplaintStatus =
    | 'submitted'
    | 'acknowledged'
    | 'assigned'
    | 'in_progress'
    | 'pending_information'
    | 'resolved'
    | 'closed'
    | 'rejected';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';

export type DepartmentId =
    | 'water_supply'
    | 'electricity'
    | 'sanitation'
    | 'roads'
    | 'health'
    | 'education';

export interface Complaint {
    id: string;
    complaintId: string; // POL-DEPT-YYYYMMDD-XXXX
    department: DepartmentId;
    subCategory: string;
    title: string;
    description: string;
    location: string;
    pinCode: string;
    urgency: UrgencyLevel;
    status: ComplaintStatus;
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    userAddress: string;
    attachments: string[];
    assignedTo?: string;
    assignedToName?: string;
    createdAt: Date;
    updatedAt: Date;
    acknowledgedAt?: Date;
    assignedAt?: Date;
    resolvedAt?: Date;
    closedAt?: Date;
    resolutionNotes?: string;
    resolutionImages?: string[];
    rejectionReason?: string;
    rating?: number;
    feedback?: string;
    viewCount: number;
    geoLocation?: {
        lat: number;
        lng: number;
    };
}

export interface StatusTimelineEntry {
    status: ComplaintStatus;
    timestamp: Date;
    updatedBy: string;
    updatedByName: string;
    notes?: string;
}

export interface ComplaintFilters {
    status?: ComplaintStatus;
    department?: DepartmentId;
    urgency?: UrgencyLevel;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
    page?: number;
    limit?: number;
}
