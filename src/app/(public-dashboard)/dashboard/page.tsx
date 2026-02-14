'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import {
    FileText, FilePlus, Clock, CheckCircle, XCircle, AlertTriangle,
    ArrowRight, TrendingUp, Calendar, BarChart3,
} from 'lucide-react';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { cn } from '@/lib/utils/cn';
import styles from './Dashboard.module.css';
import { useState, useEffect } from 'react';
import { Complaint } from '@/types/complaint';

const statusStyles: Record<string, { card: string; dot: string }> = {
    submitted: { card: styles.status_submitted, dot: styles.dot_submitted },
    acknowledged: { card: styles.status_acknowledged, dot: styles.dot_acknowledged },
    assigned: { card: styles.status_assigned, dot: styles.dot_assigned },
    in_progress: { card: styles.status_in_progress, dot: styles.dot_in_progress },
    resolved: { card: styles.status_resolved, dot: styles.dot_resolved },
    rejected: { card: styles.status_rejected, dot: styles.dot_rejected },
    closed: { card: styles.status_closed, dot: styles.dot_closed },
};

export default function PublicDashboard() {
    const { userData } = useAuth();
    const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentComplaints = async () => {
            if (!userData) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch('/api/complaints?limit=5');
                if (res.ok) {
                    const data = await res.json();
                    setRecentComplaints(data.complaints);
                }
            } catch (error) {
                console.error('Failed to fetch recent complaints', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentComplaints();
    }, [userData]);

    const statCards = [
        { label: 'Total Complaints', value: '12', icon: FileText, color: styles.textBlue, bg: styles.bgBlue },
        { label: 'Pending Action', value: '4', icon: Clock, color: styles.textAmber, bg: styles.bgAmber },
        { label: 'Resolved', value: '7', icon: CheckCircle, color: styles.textGreen, bg: styles.bgGreen },
        { label: 'Needs Attention', value: '1', icon: XCircle, color: styles.textRed, bg: styles.bgRed },
    ];

    return (
        <div className={styles.container}>
            {/* Header / Welcome */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.welcomeTitle}>
                        Welcome, <span className={styles.userName}>{userData?.name?.split(' ')[0] || 'Citizen'}</span>
                    </h1>
                    <p className={styles.welcomeSubtitle}>
                        CWP Dashboard • Live Updates
                    </p>
                </div>
                <Link
                    href="/new-complaint"
                    className={styles.newComplaintBtn}
                >
                    <FilePlus size={16} />
                    File New Complaint
                </Link>
            </div>

            {/* Stat Cards */}
            <div className={styles.statsGrid}>
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className={styles.statCard}
                        >
                            <div className={styles.statHeader}>
                                <div
                                    className={cn(styles.statIconWrapper, stat.bg, stat.color)}
                                >
                                    <Icon size={20} />
                                </div>
                                <div className={styles.liveBadge}>
                                    Live
                                </div>
                            </div>
                            <p className={styles.statValue}>
                                {stat.value}
                            </p>
                            <p className={styles.statLabel}>
                                {stat.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Main Visual Content */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <div>
                            <h3 className={styles.chartTitle}>
                                <TrendingUp size={18} className="text-blue-600" />
                                Growth Trends
                            </h3>
                            <p className={styles.chartSubtitle}>Resolution velocity overview</p>
                        </div>
                        <select className={styles.timeSelect}>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className={styles.chartArea}>
                        <AnalyticsChart
                            type="area"
                            data={[
                                { name: 'Mon', value: 12 },
                                { name: 'Tue', value: 18 },
                                { name: 'Wed', value: 15 },
                                { name: 'Thu', value: 25 },
                                { name: 'Fri', value: 22 },
                                { name: 'Sat', value: 30 },
                                { name: 'Sun', value: 20 },
                            ]}
                        />
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={cn(styles.chartTitle, "mb-8")}>
                        <BarChart3 size={18} className="text-purple-600" />
                        Distribution
                    </h3>
                    <div className={styles.pieChartArea}>
                        <AnalyticsChart
                            type="pie"
                            data={[
                                { name: 'Water', value: 40 },
                                { name: 'Roads', value: 25 },
                                { name: 'Sanitation', value: 35 },
                            ]}
                        />
                    </div>
                    <div className={styles.legend}>
                        {[
                            { label: 'Water Supply', value: '40%', color: 'bg-blue-500' },
                            { label: 'Sanitation', value: '35%', color: 'bg-emerald-500' },
                            { label: 'Road Transport', value: '25%', color: 'bg-purple-500' },
                        ].map((item, i) => (
                            <div key={i} className={styles.legendItem}>
                                <div className={styles.legendLabel}>
                                    <div className={cn(styles.legendDot, item.color)} />
                                    {item.label}
                                </div>
                                <span className={styles.legendValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className={styles.listCard}>
                <div className={styles.listHeader}>
                    <div>
                        <h2 className={styles.listTitle}>Recent Activity</h2>
                        <p className={styles.listSubtitle}>Track your active submissions</p>
                    </div>
                    <Link
                        href="/complaints"
                        className={styles.viewAllLink}
                    >
                        See Full History <ArrowRight size={14} />
                    </Link>
                </div>

                <div className={styles.complaintList}>
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading recent activity...</div>
                    ) : recentComplaints.length > 0 ? (
                        recentComplaints.map((complaint: any) => {
                            const styleConfig = statusStyles[complaint.status] || statusStyles.submitted;
                            return (
                                <div
                                    key={complaint._id || complaint.id}
                                    className={styles.complaintItem}
                                >
                                    <Link href={`/complaints/${complaint.complaintId}`} className={styles.complaintLinkOverlay} />

                                    <div
                                        className={styles.urgencyIndicator}
                                        style={{
                                            background:
                                                complaint.urgency === 'high' || complaint.urgency === 'emergency'
                                                    ? '#ef4444'
                                                    : complaint.urgency === 'medium'
                                                        ? '#f59e0b'
                                                        : '#10b981',
                                        }}
                                    />

                                    <div className={styles.complaintContent}>
                                        <p className={styles.complaintTitle}>
                                            {complaint.title}
                                        </p>
                                        <div className={styles.complaintMeta}>
                                            <span className={styles.metaId}>
                                                {complaint.complaintId}
                                            </span>
                                            <span className={styles.metaSeparator}>
                                                •
                                            </span>
                                            <span className={styles.metaDept}>
                                                {complaint.department}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.complaintActions}>
                                        <span
                                            className={cn(styles.statusTag, styleConfig.card)}
                                        >
                                            <span
                                                className={cn(styles.statusDot, styleConfig.dot)}
                                            />
                                            {complaint.status.replace('_', ' ')}
                                        </span>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                            className={styles.viewBtn}
                                        >
                                            <FileText size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-slate-500">No recent activity found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
