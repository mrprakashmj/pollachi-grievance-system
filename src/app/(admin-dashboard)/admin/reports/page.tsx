'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Loader2,
    Building2,
    Activity,
} from 'lucide-react';
import { DEPARTMENTS } from '@/constants/departments';
import { cn } from '@/lib/utils/cn';
import styles from './AdminReports.module.css';

interface OverviewData {
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    rejectedComplaints: number;
    overallResolutionRate: number;
    totalUsers: number;
    totalStaff: number;
    totalAdmins: number;
}

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

export default function AdminReportsPage() {
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [deptStats, setDeptStats] = useState<DeptStat[]>([]);
    const [statusBreakdown, setStatusBreakdown] = useState<Record<string, number>>({});
    const [urgencyBreakdown, setUrgencyBreakdown] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    const STATUS_LABELS: Record<string, string> = {
        submitted: 'Submitted',
        acknowledged: 'Acknowledged',
        in_progress: 'In Progress',
        resolved: 'Resolved',
        rejected: 'Rejected',
        closed: 'Closed',
    };

    const STATUS_COLORS: Record<string, string> = {
        submitted: '#64748b',
        acknowledged: '#3b82f6',
        in_progress: '#f59e0b',
        resolved: '#22c55e',
        rejected: '#ef4444',
        closed: '#94a3b8',
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setOverview(data.overview);
                setDeptStats(data.departmentStats || []);
                setStatusBreakdown(data.statusBreakdown || {});
                setUrgencyBreakdown(data.urgencyBreakdown || {});
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

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <Loader2 size={32} className={styles.spinner} />
                    <p>Loading reports data...</p>
                </div>
            </div>
        );
    }

    const totalComplaints = overview?.totalComplaints || 0;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        System <span className={styles.titleAccent}>Reports</span>
                    </h1>
                    <p className={styles.subtitle}>
                        <span className={styles.liveDot} />
                        Analytics & Insights • Admin Panel
                    </p>
                </div>
                <button className={styles.refreshBtn} onClick={fetchStats}>
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* Summary Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard} style={{ borderColor: '#bfdbfe' }}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Total Complaints</span>
                        <div className={styles.iconBox} style={{ backgroundColor: '#eff6ff' }}>
                            <FileText size={18} style={{ color: '#2563eb' }} />
                        </div>
                    </div>
                    <p className={styles.statValue}>{overview?.totalComplaints || 0}</p>
                </div>
                <div className={styles.statCard} style={{ borderColor: '#fde68a' }}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Pending</span>
                        <div className={styles.iconBox} style={{ backgroundColor: '#fffbeb' }}>
                            <Clock size={18} style={{ color: '#d97706' }} />
                        </div>
                    </div>
                    <p className={styles.statValue}>{overview?.pendingComplaints || 0}</p>
                </div>
                <div className={styles.statCard} style={{ borderColor: '#a7f3d0' }}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Resolved</span>
                        <div className={styles.iconBox} style={{ backgroundColor: '#ecfdf5' }}>
                            <CheckCircle size={18} style={{ color: '#059669' }} />
                        </div>
                    </div>
                    <p className={styles.statValue}>{overview?.resolvedComplaints || 0}</p>
                </div>
                <div className={styles.statCard} style={{ borderColor: '#ddd6fe' }}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Resolution Rate</span>
                        <div className={styles.iconBox} style={{ backgroundColor: '#f5f3ff' }}>
                            <TrendingUp size={18} style={{ color: '#7c3aed' }} />
                        </div>
                    </div>
                    <p className={styles.statValue}>{overview?.overallResolutionRate || 0}%</p>
                </div>
            </div>

            {/* Two-column layout */}
            <div className={styles.gridSplit}>
                {/* Status Distribution */}
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>
                        <Activity size={14} />
                        Status Distribution
                    </h3>
                    <div>
                        {Object.entries(statusBreakdown).map(([status, count]) => {
                            const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
                            return (
                                <div key={status} className={styles.breakdownItem}>
                                    <div className={styles.breakdownHeader}>
                                        <div className={styles.breakdownLabel}>
                                            <span
                                                className={styles.dot}
                                                style={{ backgroundColor: STATUS_COLORS[status] || '#64748b' }}
                                            />
                                            {STATUS_LABELS[status] || status}
                                        </div>
                                        <div>
                                            <span className={styles.breakdownValue}>{count}</span>
                                            <span className={styles.breakdownPct}>({pct}%)</span>
                                        </div>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <div
                                            className={styles.progressBar}
                                            style={{
                                                width: `${pct}%`,
                                                backgroundColor: STATUS_COLORS[status] || '#64748b',
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Urgency Distribution */}
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>
                        <AlertTriangle size={14} />
                        Urgency Distribution
                    </h3>
                    <div>
                        {Object.entries(urgencyBreakdown).map(([urgency, count]) => {
                            const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
                            const colorMap: Record<string, string> = {
                                low: '#16a34a',
                                medium: '#d97706',
                                high: '#dc2626',
                                emergency: '#7c3aed',
                            };
                            const bgMap: Record<string, string> = {
                                low: '#f0fdf4',
                                medium: '#fffbeb',
                                high: '#fef2f2',
                                emergency: '#f5f3ff',
                            };
                            return (
                                <div
                                    key={urgency}
                                    className={styles.urgencyItem}
                                    style={{ backgroundColor: bgMap[urgency] || '#f1f5f9' }}
                                >
                                    <span style={{ color: colorMap[urgency] || '#475569', fontWeight: 700, fontSize: '0.75rem', textTransform: 'capitalize' }}>
                                        {urgency}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: 700, color: colorMap[urgency] || '#475569' }}>{count}</span>
                                        <span style={{ fontSize: '0.625rem', fontWeight: 600, color: colorMap[urgency] || '#475569', opacity: 0.7 }}>
                                            ({pct}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Department Performance Table */}
            <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                <div className={styles.tableHeader}>
                    <div>
                        <h3 className={styles.tableTitle}>Department Performance Report</h3>
                        <p className={styles.tableSubtitle}>Comparative metrics across all departments</p>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th style={{ textAlign: 'center' }}>Total</th>
                                <th style={{ textAlign: 'center' }}>Pending</th>
                                <th style={{ textAlign: 'center' }}>Resolved</th>
                                <th style={{ textAlign: 'center' }}>Rejected</th>
                                <th>Resolution Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deptStats.map((dept) => (
                                <tr key={dept.id}>
                                    <td>
                                        <div className={styles.deptName}>
                                            <span
                                                className={styles.dot}
                                                style={{ backgroundColor: dept.color }}
                                            />
                                            {dept.label}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--tn-navy)' }}>
                                        {dept.total}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span
                                            className={styles.badge}
                                            style={{
                                                backgroundColor: dept.pending > 0 ? '#fffbeb' : '#f1f5f9',
                                                color: dept.pending > 0 ? '#d97706' : '#64748b',
                                            }}
                                        >
                                            {dept.pending}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={styles.badge} style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                                            {dept.resolved}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span
                                            className={styles.badge}
                                            style={{
                                                backgroundColor: dept.rejected > 0 ? '#fef2f2' : '#f1f5f9',
                                                color: dept.rejected > 0 ? '#dc2626' : '#64748b',
                                            }}
                                        >
                                            {dept.rejected}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div className={styles.progressTrack} style={{ flex: 1 }}>
                                                <div
                                                    className={styles.progressBar}
                                                    style={{
                                                        width: `${dept.resolutionRate}%`,
                                                        backgroundColor: dept.color,
                                                    }}
                                                />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--tn-navy)', minWidth: '35px', textAlign: 'right' }}>
                                                {dept.resolutionRate}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
