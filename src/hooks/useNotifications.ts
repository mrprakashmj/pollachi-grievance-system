'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface Notification {
    id: string;
    type: 'status_change' | 'status_update' | 'complaint_rejected' | 'assignment' | 'system' | 'alert' | 'general';
    title: string;
    message: string;
    complaintId?: string;
    isRead: boolean;
    createdAt: any;
}

export function useNotifications() {
    const { userData } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!userData?.uid) return;
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userData?.uid) return;

        setLoading(true);
        fetchNotifications();

        // Poll every 30 seconds
        const intervalId = setInterval(fetchNotifications, 30000);

        return () => clearInterval(intervalId);
    }, [userData?.uid]);

    const markAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.filter(n => n.id !== id));
            setUnreadCount(prev => Math.max(0, prev - 1));

            await fetch(`/api/notifications/${id}/read`, {
                method: 'PUT',
            });
        } catch (error) {
            console.error('Failed to mark notification as read', error);
            // Revert on failure (optional, but good practice)
            fetchNotifications();
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        refresh: fetchNotifications
    };
}
