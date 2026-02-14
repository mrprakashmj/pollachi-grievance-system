'use client';

import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Search, X, CheckCheck, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
    const { userData } = useAuth();
    const { notifications, unreadCount, loading, markAsRead, refresh } = useNotifications();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Close panel on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        }
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications]);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'status_change':
                return <RefreshCw size={14} />;
            case 'alert':
                return <AlertTriangle size={14} />;
            default:
                return <Info size={14} />;
        }
    };

    const formatTime = (date: string | Date) => {
        const now = new Date();
        const d = new Date(date);
        const diff = now.getTime() - d.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <header className={styles.header}>
            {/* Search bar */}
            <div className={styles.searchContainer}>
                <div className={styles.searchWrapper}>
                    <Search
                        size={18}
                        className={styles.searchIcon}
                    />
                    <input
                        type="text"
                        placeholder="Search complaints..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* Right side */}
            <div className={styles.rightSection}>
                {/* Notifications */}
                <div className={styles.notificationWrapper} ref={panelRef}>
                    <button
                        className={styles.notificationBtn}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={18} className="text-muted-foreground" />
                        {unreadCount > 0 && (
                            <span className={styles.indicator}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown Panel */}
                    {showNotifications && (
                        <div className={styles.notifPanel}>
                            <div className={styles.notifHeader}>
                                <h3 className={styles.notifTitle}>Notifications</h3>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className={styles.notifClose}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className={styles.notifBody}>
                                {loading ? (
                                    <div className={styles.notifEmpty}>
                                        <RefreshCw size={20} className={styles.spinning} />
                                        <p>Loading notifications...</p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className={styles.notifEmpty}>
                                        <CheckCheck size={24} />
                                        <p>You&apos;re all caught up!</p>
                                        <span>No new notifications</span>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={styles.notifItem}
                                        >
                                            <div className={styles.notifIconWrapper}>
                                                {getNotificationIcon(notif.type)}
                                            </div>
                                            <div className={styles.notifContent}>
                                                <p className={styles.notifItemTitle}>{notif.title}</p>
                                                <p className={styles.notifMessage}>{notif.message}</p>
                                                <span className={styles.notifTime}>{formatTime(notif.createdAt)}</span>
                                            </div>
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className={styles.notifDismiss}
                                                title="Mark as read"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <div className={styles.notifFooter}>
                                    <button onClick={refresh} className={styles.notifRefresh}>
                                        <RefreshCw size={14} />
                                        Refresh
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* User info */}
                <div className={styles.userInfo}>
                    <div className={styles.userDetails}>
                        <p className={styles.userName}>
                            {userData?.name || 'Guest'}
                        </p>
                        <p className={styles.userEmail}>
                            {userData?.email || ''}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
