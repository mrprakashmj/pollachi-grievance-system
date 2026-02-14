import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd MMM yyyy');
};

export const formatDateTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, 'dd MMM yyyy, hh:mm a');
};

export const formatRelativeDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isToday(d)) return `Today, ${format(d, 'hh:mm a')}`;
    if (isYesterday(d)) return `Yesterday, ${format(d, 'hh:mm a')}`;
    return formatDateTime(d);
};

export const formatTimeAgo = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
};

export const calculateResolutionTime = (createdAt: Date, resolvedAt: Date): string => {
    const diff = resolvedAt.getTime() - createdAt.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
};
