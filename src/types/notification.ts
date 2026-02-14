export type NotificationType =
    | 'status_change'
    | 'assignment'
    | 'resolution'
    | 'feedback_request'
    | 'system_alert'
    | 'chat_message'
    | 'sla_breach';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    complaintId?: string;
    isRead: boolean;
    createdAt: Date;
}
