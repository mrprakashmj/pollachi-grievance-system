'use client';

import { useState, useEffect } from 'react';
import {
    Building2,
    Users,
    FileText,
    TrendingUp,
    RefreshCw,
    Loader2,
    Inbox,
} from 'lucide-react';
import { DEPARTMENTS } from '@/constants/departments';
import styles from './AdminDepartments.module.css';

interface DeptStat {
    id: string;
    label: string;
    color: string;
    total: number;
    pending: number;
    resolved: number;
    rejected: number;
    resolutionRate: number;
}

export default function AdminDepartmentsPage() {
    const [deptStats, setDeptStats] = useState<DeptStat[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setDeptStats(data.departmentStats || []);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        <span className={styles.titleAccent}>Departments</span>
                    </h1>
                    <p className={styles.subtitle}>
                        <span className={styles.liveDot} />
                        Department Management • Admin Panel
                    </p>
                </div>
                <button className={styles.refreshBtn} onClick={fetchStats}>
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* Stats Overview */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#eff6ff' }}>
                        <Building2 size={20} style={{ color: '#2563eb' }} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Total Departments</p>
                        <p className={styles.statValue}>{DEPARTMENTS.length}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#f0fdf4' }}>
                        <Users size={20} style={{ color: '#16a34a' }} />
                    </div>
                    <div>
                        <p className={styles.statLabel}>Active Departments</p>
                        <p className={styles.statValue}>{DEPARTMENTS.length}</p>
                    </div>
                </div>
            </div>

            {/* Departments Grid */}
            {loading ? (
                <div className={styles.loadingState}>
                    <Loader2 size={32} className={styles.spinner} />
                    <p>Loading department data...</p>
                </div>
            ) : (
                <div className={styles.deptGrid}>
                    {DEPARTMENTS.map((dept) => {
                        const stat = deptStats.find(s => s.id === dept.id);
                        return (
                            <div key={dept.id} className={styles.deptCard}>
                                <div className={styles.deptHeader}>
                                    <div
                                        className={styles.deptIconBox}
                                        style={{ backgroundColor: dept.color + '15' }}
                                    >
                                        <Building2 size={20} style={{ color: dept.color }} />
                                    </div>
                                    <div>
                                        <h3 className={styles.deptName}>{dept.label}</h3>
                                        <p className={styles.deptSub}>
                                            {dept.subCategories.length} categories
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.deptStats}>
                                    <div className={styles.deptStatItem}>
                                        <span className={styles.deptStatLabel}>Total</span>
                                        <span className={styles.deptStatValue}>{stat?.total || 0}</span>
                                    </div>
                                    <div className={styles.deptStatItem}>
                                        <span className={styles.deptStatLabel}>Pending</span>
                                        <span className={styles.deptStatValue} style={{ color: '#d97706' }}>
                                            {stat?.pending || 0}
                                        </span>
                                    </div>
                                    <div className={styles.deptStatItem}>
                                        <span className={styles.deptStatLabel}>Resolved</span>
                                        <span className={styles.deptStatValue} style={{ color: '#16a34a' }}>
                                            {stat?.resolved || 0}
                                        </span>
                                    </div>
                                    <div className={styles.deptStatItem}>
                                        <span className={styles.deptStatLabel}>Rejected</span>
                                        <span className={styles.deptStatValue} style={{ color: '#dc2626' }}>
                                            {stat?.rejected || 0}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.resolutionBar}>
                                    <div className={styles.resolutionHeader}>
                                        <span>Resolution Rate</span>
                                        <span className={styles.resolutionPct}>
                                            {stat?.resolutionRate || 0}%
                                        </span>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <div
                                            className={styles.progressBar}
                                            style={{
                                                width: `${stat?.resolutionRate || 0}%`,
                                                backgroundColor: dept.color,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Sub-categories */}
                                <div className={styles.categories}>
                                    <p className={styles.catLabel}>Categories</p>
                                    <div className={styles.catList}>
                                        {dept.subCategories.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className={styles.catBadge}
                                                style={{
                                                    backgroundColor: dept.color + '10',
                                                    color: dept.color,
                                                    borderColor: dept.color + '30',
                                                }}
                                            >
                                                {cat.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
