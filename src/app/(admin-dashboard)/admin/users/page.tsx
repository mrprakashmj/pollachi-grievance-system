'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    UserCheck,
    ShieldCheck,
    Search,
    RefreshCw,
    Loader2,
    Inbox,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import styles from './AdminUsers.module.css';

interface UserData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    department?: string;
    createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
    citizen: 'Citizen',
    department_head: 'Department Head',
    admin: 'Administrator',
};

const ROLE_STYLES: Record<string, { bg: string; text: string }> = {
    citizen: { bg: '#eff6ff', text: '#2563eb' },
    department_head: { bg: '#f5f3ff', text: '#7c3aed' },
    admin: { bg: '#fef2f2', text: '#dc2626' },
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [overview, setOverview] = useState<{
        totalUsers: number;
        totalStaff: number;
        totalAdmins: number;
    }>({ totalUsers: 0, totalStaff: 0, totalAdmins: 0 });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setOverview({
                    totalUsers: data.overview?.totalUsers || 0,
                    totalStaff: data.overview?.totalStaff || 0,
                    totalAdmins: data.overview?.totalAdmins || 0,
                });
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const userCards = [
        {
            label: 'Total Citizens',
            value: overview.totalUsers,
            icon: Users,
            color: '#2563eb',
            bg: '#eff6ff',
            borderColor: '#bfdbfe',
        },
        {
            label: 'Department Staff',
            value: overview.totalStaff,
            icon: UserCheck,
            color: '#7c3aed',
            bg: '#f5f3ff',
            borderColor: '#ddd6fe',
        },
        {
            label: 'Administrators',
            value: overview.totalAdmins,
            icon: ShieldCheck,
            color: '#dc2626',
            bg: '#fef2f2',
            borderColor: '#fecaca',
        },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        <span className={styles.titleAccent}>Users</span> Management
                    </h1>
                    <p className={styles.subtitle}>
                        <span className={styles.liveDot} />
                        User Registry • Admin Panel
                    </p>
                </div>
                <button className={styles.refreshBtn} onClick={fetchData}>
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className={styles.statsGrid}>
                {userCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            className={styles.statCard}
                            style={{ borderColor: stat.borderColor }}
                        >
                            <div className={styles.statHeader}>
                                <span className={styles.statLabel}>{stat.label}</span>
                                <div className={styles.iconBox} style={{ backgroundColor: stat.bg }}>
                                    <Icon size={18} style={{ color: stat.color }} />
                                </div>
                            </div>
                            <p className={styles.statValue}>{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Info Card */}
            <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                    <Users size={24} style={{ color: 'var(--tn-navy)' }} />
                </div>
                <div>
                    <h3 className={styles.infoTitle}>User Overview</h3>
                    <p className={styles.infoText}>
                        The system currently has <strong>{overview.totalUsers}</strong> registered citizens,{' '}
                        <strong>{overview.totalStaff}</strong> department staff members, and{' '}
                        <strong>{overview.totalAdmins}</strong> administrators managing the Pollachi Municipal
                        Corporation grievance portal.
                    </p>
                </div>
            </div>

            {/* Role Breakdown */}
            <div className={styles.breakdownCard}>
                <h3 className={styles.sectionTitle}>
                    <ShieldCheck size={14} />
                    Role Distribution
                </h3>
                <div className={styles.roleGrid}>
                    {userCards.map((card, idx) => {
                        const Icon = card.icon;
                        const total = overview.totalUsers + overview.totalStaff + overview.totalAdmins;
                        const pct = total > 0 ? Math.round((card.value / total) * 100) : 0;
                        return (
                            <div key={idx} className={styles.roleItem}>
                                <div className={styles.roleHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div
                                            className={styles.roleIconBox}
                                            style={{ backgroundColor: card.bg }}
                                        >
                                            <Icon size={16} style={{ color: card.color }} />
                                        </div>
                                        <span className={styles.roleLabel}>{card.label}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className={styles.roleValue}>{card.value}</span>
                                        <span className={styles.rolePct}>({pct}%)</span>
                                    </div>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div
                                        className={styles.progressBar}
                                        style={{ width: `${pct}%`, backgroundColor: card.color }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
