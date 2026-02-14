import { ComplaintStatus } from '@/types/complaint';

export interface StatusConfig {
    id: ComplaintStatus;
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
    icon: string;
    description: string;
}

export const STATUSES: StatusConfig[] = [
    {
        id: 'submitted',
        label: 'Submitted',
        color: 'hsl(var(--muted-foreground))',
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        icon: 'FileText',
        description: 'Complaint filed by citizen',
    },
    {
        id: 'acknowledged',
        label: 'Acknowledged',
        color: 'hsl(var(--info))',
        bgColor: 'bg-info/10',
        textColor: 'text-info',
        icon: 'Eye',
        description: 'Department head has seen it',
    },
    {
        id: 'assigned',
        label: 'Assigned',
        color: 'hsl(var(--primary))',
        bgColor: 'bg-primary/10',
        textColor: 'text-primary',
        icon: 'UserCheck',
        description: 'Assigned to staff member',
    },
    {
        id: 'in_progress',
        label: 'In Progress',
        color: 'hsl(var(--warning))',
        bgColor: 'bg-warning/10',
        textColor: 'text-warning',
        icon: 'Loader',
        description: 'Work has started',
    },
    {
        id: 'pending_information',
        label: 'Pending Information',
        color: 'hsl(var(--accent))',
        bgColor: 'bg-accent/10',
        textColor: 'text-accent',
        icon: 'HelpCircle',
        description: 'Awaiting user clarification',
    },
    {
        id: 'resolved',
        label: 'Resolved',
        color: 'hsl(var(--success))',
        bgColor: 'bg-success/10',
        textColor: 'text-success',
        icon: 'CheckCircle',
        description: 'Issue fixed',
    },
    {
        id: 'closed',
        label: 'Closed',
        color: 'hsl(var(--muted-foreground))',
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        icon: 'XCircle',
        description: 'User confirmed or auto-closed',
    },
    {
        id: 'rejected',
        label: 'Rejected',
        color: 'hsl(var(--destructive))',
        bgColor: 'bg-destructive/10',
        textColor: 'text-destructive',
        icon: 'Ban',
        description: 'Invalid or duplicate complaint',
    },
];

export const getStatusConfig = (status: ComplaintStatus): StatusConfig => {
    return STATUSES.find((s) => s.id === status) || STATUSES[0];
};

export const STATUS_FLOW: Record<ComplaintStatus, ComplaintStatus[]> = {
    submitted: ['acknowledged', 'rejected'],
    acknowledged: ['assigned', 'rejected'],
    assigned: ['in_progress', 'pending_information'],
    in_progress: ['resolved', 'pending_information'],
    pending_information: ['in_progress', 'closed'],
    resolved: ['closed'],
    closed: [],
    rejected: [],
};
