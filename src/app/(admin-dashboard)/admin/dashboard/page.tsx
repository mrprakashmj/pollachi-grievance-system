'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Building2,
    Users,
    ShieldCheck,
    AlertCircle,
    TrendingUp,
    BarChart3,
    Activity,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    ArrowRight,
    AlertTriangle,
    RefreshCw,
    Loader2,
    ChevronRight,
    UserCheck,
    Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';
import { ROUTES } from '@/constants/routes';
import styles from './AdminDashboard.module.css';

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
    icon: string;
    total: number;
    pending: number;
    resolved: number;
    rejected: number;
    resolutionRate: number;
    statusBreakdown: Record<string, number>;
}

interface RecentComplaint {
    _id: string;
    complaintId: string;
    title: string;
    status: string;
    urgency: string;
    userName: string;
    department: string;
    departmentLabel: string;
    createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    submitted: { bg: '#f1f5f9', text: '#475569', dot: '#64748b' },
    acknowledged: { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
    in_progress: { bg: '#fffbeb', text: '#d97706', dot: '#f59e0b' },
    resolved: { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
    rejected: { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
    closed: { bg: '#f1f5f9', text: '#64748b', dot: '#94a3b8' },
};

const STATUS_LABELS: Record<string, string> = {
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
    closed: 'Closed',
};

const URGENCY_COLORS: Record<string, { bg: string; text: string }> = {
    low: { bg: '#f0fdf4', text: '#16a34a' },
    medium: { bg: '#fffbeb', text: '#d97706' },
    high: { bg: '#fef2f2', text: '#dc2626' },
    emergency: { bg: '#dc2626', text: '#ffffff' },
};

const AdminDashboard = () => {
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [statusBreakdown, setStatusBreakdown] = useState<Record<string, number>>({});
    const [urgencyBreakdown, setUrgencyBreakdown] = useState<Record<string, number>>({});
    const [deptStats, setDeptStats] = useState<DeptStat[]>([]);
    const [recentComplaints, setRecentComplaints] = useState<RecentComplaint[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setOverview(data.overview);
                setStatusBreakdown(data.statusBreakdown);
                setUrgencyBreakdown(data.urgencyBreakdown);
                setDeptStats(data.departmentStats);
                setRecentComplaints(data.recentComplaints);
            }
        } catch (error) {
            console.error('Failed to fetch admin stats', error);
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
                <div className={styles.header}>
                    <div className={styles.loadingSkeleton} style={{ width: '200px', height: '40px' }} />
                </div>
                <div className={styles.gridStatCards}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className={styles.loadingSkeleton} style={{ height: '120px' }} />
                    ))}
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Complaints',
            value: overview?.totalComplaints || 0,
            icon: FileText,
            color: '#2563eb', // blue-600
            bg: '#eff6ff', // blue-50
            borderColor: '#bfdbfe', // blue-200
        },
        {
            label: 'Pending',
            value: overview?.pendingComplaints || 0,
            icon: Clock,
            color: '#d97706', // amber-600
            bg: '#fffbeb', // amber-50
            borderColor: '#fde68a', // amber-200
        },
        {
            label: 'Resolved',
            value: overview?.resolvedComplaints || 0,
            icon: CheckCircle,
            color: '#059669', // emerald-600
            bg: '#ecfdf5', // emerald-50
            borderColor: '#a7f3d0', // emerald-200
        },
        {
            label: 'Resolution Rate',
            value: `${overview?.overallResolutionRate || 0}%`,
            icon: TrendingUp,
            color: '#7c3aed', // purple-600
            bg: '#f5f3ff', // purple-50
            borderColor: '#ddd6fe', // purple-200
        },
    ];

    const userCards = [
        { label: 'Citizens', value: overview?.totalUsers || 0, icon: Users, color: '#3b82f6' },
        { label: 'Staff', value: overview?.totalStaff || 0, icon: UserCheck, color: '#8b5cf6' },
        { label: 'Admins', value: overview?.totalAdmins || 0, icon: ShieldCheck, color: '#0ea5e9' },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>
                        Command <span className={styles.highlight}>Center</span>
                    </h1>
                    <p className={styles.subtitle}>
                        <span className={styles.liveIndicator} />
                        System Overview • Pollachi MC
                    </p>
                </div>
                <div className={styles.actions}>
                    <button onClick={fetchStats} className={styles.btnRefresh}>
                        <RefreshCw size={14} />
                        Refresh Data
                    </button>
                    <Link href={ROUTES.ADMIN_COMPLAINTS} className={styles.linkPrimary}>
                        <FileText size={14} />
                        All Complaints
                    </Link>
                </div>
            </div>

            {/* Primary Stats Grid */}
            <div className={styles.gridStatCards}>
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={idx}
                            className={styles.card}
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

            {/* User counts + Status Breakdown row */}
            <div className={styles.gridContent}>
                {/* User Counts */}
                <div className={styles.card}>
                    <h3 className={styles.cardHeaderSmall}>
                        <Users size={14} />
                        Registered Users
                    </h3>
                    <div>
                        {userCards.map((u, idx) => {
                            const Icon = u.icon;
                            return (
                                <div key={idx} className={styles.listItem}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div
                                            className={styles.listItemIcon}
                                            style={{ backgroundColor: u.color + '15' }}
                                        >
                                            <Icon size={16} style={{ color: u.color }} />
                                        </div>
                                        <span className={styles.listItemText}>{u.label}</span>
                                    </div>
                                    <span className={styles.listItemValue}>{u.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className={styles.card}>
                    <h3 className={styles.cardHeaderSmall}>
                        <Activity size={14} />
                        Status Breakdown
                    </h3>
                    <div>
                        {Object.entries(statusBreakdown).map(([status, count]) => {
                            const colors = STATUS_COLORS[status] || STATUS_COLORS.submitted;
                            const total = overview?.totalComplaints || 1;
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                                <div key={status} className={styles.breakdownItem}>
                                    <div className={styles.breakdownHeader}>
                                        <div className={styles.breakdownLabel}>
                                            <span
                                                className={styles.dot}
                                                style={{ backgroundColor: colors.dot }}
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
                                            style={{ width: `${pct}%`, backgroundColor: colors.dot }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Urgency Breakdown */}
                <div className={styles.card}>
                    <h3 className={styles.cardHeaderSmall}>
                        <AlertTriangle size={14} />
                        Urgency Breakdown
                    </h3>
                    <div>
                        {Object.entries(urgencyBreakdown).map(([urgency, count]) => {
                            const colors = URGENCY_COLORS[urgency] || URGENCY_COLORS.low;
                            const total = overview?.totalComplaints || 1;
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                                <div
                                    key={urgency}
                                    className={styles.urgencyItem}
                                    style={{ backgroundColor: colors.bg }}
                                >
                                    <span
                                        className={styles.breakdownLabel}
                                        style={{ color: colors.text, margin: 0 }}
                                    >
                                        {urgency}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: 700, color: colors.text }}>{count}</span>
                                        <span style={{ fontSize: '0.625rem', fontWeight: 600, color: colors.text, opacity: 0.7 }}>
                                            ({pct}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Department Performance + Recent Complaints */}
            <div className={styles.gridSplit}>
                {/* Department Performance Table */}
                <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                    <div className={styles.cardHeaderTable}>
                        <div>
                            <h3 className={styles.tableTitle}>Department Performance</h3>
                            <p className={styles.tableSubtitle}>Real-time resolution metrics</p>
                        </div>
                        <Link href={ROUTES.ADMIN_COMPLAINTS} style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', color: 'var(--tn-navy)' }}>
                            View All <ChevronRight size={12} />
                        </Link>
                    </div>

                    {deptStats.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Inbox size={36} style={{ color: 'var(--muted-foreground)', opacity: 0.5, marginBottom: '0.75rem' }} />
                            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>No department data</p>
                        </div>
                    ) : (
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
                                                    <div
                                                        className={styles.dot}
                                                        style={{ backgroundColor: dept.color }}
                                                    />
                                                    {dept.label}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--tn-navy)' }}>{dept.total}</td>
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
                                                <span
                                                    className={styles.badge}
                                                    style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}
                                                >
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
                    )}
                </div>

                {/* Recent Complaints */}
                <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
                    <div className={styles.cardHeaderTable}>
                        <span className={styles.tableSubtitle}>Recent Complaints</span>
                        <Link href={ROUTES.ADMIN_COMPLAINTS} style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', color: 'var(--tn-navy)' }}>
                            All <ChevronRight size={10} />
                        </Link>
                    </div>
                    <div>
                        {recentComplaints.length === 0 ? (
                            <div style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Inbox size={28} style={{ color: 'var(--muted-foreground)', opacity: 0.5, marginBottom: '0.5rem' }} />
                                <p style={{ fontSize: '0.75rem', fontWeight: 600 }}>No recent complaints</p>
                            </div>
                        ) : (
                            recentComplaints.map((complaint) => {
                                const statusColor = STATUS_COLORS[complaint.status] || STATUS_COLORS.submitted;
                                return (
                                    <div key={complaint.complaintId} className={styles.recentItem}>
                                        <div className={styles.recentHeader}>
                                            <span className={styles.complaintId}>{complaint.complaintId}</span>
                                            <span
                                                className={styles.statusTag}
                                                style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                                            >
                                                <span
                                                    className={styles.dot}
                                                    style={{ width: '0.375rem', height: '0.375rem', backgroundColor: statusColor.dot }}
                                                />
                                                {STATUS_LABELS[complaint.status]}
                                            </span>
                                        </div>
                                        <p className={styles.complaintTitle}>{complaint.title}</p>
                                        <div className={styles.complaintMeta}>
                                            <div className={styles.metaInfo}>
                                                <span>{complaint.departmentLabel}</span>
                                                <span>•</span>
                                                <span>{complaint.userName}</span>
                                            </div>
                                            <span className={styles.metaInfo}>
                                                {format(new Date(complaint.createdAt), 'dd MMM')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions Footer */}
            <div className={styles.gridActions}>
                <Link href={ROUTES.ADMIN_COMPLAINTS} className={styles.actionCard}>
                    <div className={styles.actionIcon} style={{ backgroundColor: '#eff6ff' }}>
                        <FileText size={18} style={{ color: '#2563eb' }} />
                    </div>
                    <div className={styles.actionText}>
                        <h3>Manage Complaints</h3>
                        <p>View, approve, or reject</p>
                    </div>
                    <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--muted-foreground)' }} />
                </Link>
                <Link href={ROUTES.ADMIN_DEPARTMENTS} className={styles.actionCard}>
                    <div className={styles.actionIcon} style={{ backgroundColor: '#f5f3ff' }}>
                        <Building2 size={18} style={{ color: '#7c3aed' }} />
                    </div>
                    <div className={styles.actionText}>
                        <h3>Departments</h3>
                        <p>View details</p>
                    </div>
                    <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--muted-foreground)' }} />
                </Link>
                <Link href={ROUTES.ADMIN_USERS} className={styles.actionCard}>
                    <div className={styles.actionIcon} style={{ backgroundColor: '#ecfdf5' }}>
                        <Users size={18} style={{ color: '#059669' }} />
                    </div>
                    <div className={styles.actionText}>
                        <h3>Users</h3>
                        <p>Manage accounts</p>
                    </div>
                    <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--muted-foreground)' }} />
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
