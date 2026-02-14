'use client';

import { useAuth } from '@/hooks/useAuth';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Calendar, ChevronRight, FileText, AlertTriangle, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import StatusBadge from '@/components/complaints/StatusBadge';
import { formatRelativeDate } from '@/lib/utils/date-formatter';
import { getDepartmentLabel } from '@/constants/departments';
import { Complaint } from '@/types/complaint';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import styles from './Complaints.module.css';

const STATUS_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'acknowledged', label: 'Acknowledged' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'rejected', label: 'Rejected' },
];

export default function ComplaintsListPage() {
    const { userData } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            if (!userData) return;
            try {
                const res = await fetch('/api/complaints');
                if (res.ok) {
                    const data = await res.json();
                    setComplaints(data.complaints);
                }
            } catch (error) {
                console.error('Failed to fetch complaints', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [userData]);

    const filteredComplaints = useMemo(() => {
        return complaints.filter((c) => {
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.complaintId.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, complaints]);

    // Count complaints per status for filter badges
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = { all: complaints.length };
        complaints.forEach((c) => {
            counts[c.status] = (counts[c.status] || 0) + 1;
        });
        return counts;
    }, [complaints]);

    const getUrgencyClass = (urgency: string) => {
        switch (urgency) {
            case 'emergency': return styles.urgencyEmergency;
            case 'high': return styles.urgencyHigh;
            case 'medium': return styles.urgencyMedium;
            default: return styles.urgencyLow;
        }
    };

    const getUrgencyTagClass = (urgency: string) => {
        switch (urgency) {
            case 'emergency':
            case 'high': return styles.urgencyTagHigh;
            case 'medium': return styles.urgencyTagMedium;
            default: return styles.urgencyTagLow;
        }
    };

    if (loading) {
        return <div className={styles.loadingContainer}><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.pageTitle}>My Complaints</h1>
                    <p className={styles.pageSubtitle}>
                        Track and manage all your submitted grievances
                    </p>
                </div>
                <Link href="/new-complaint" className={styles.newComplaintBtn}>
                    <FilePlus size={16} />
                    File New Complaint
                </Link>
            </div>

            {/* Main Grid */}
            <div className={styles.mainGrid}>
                {/* Filter Sidebar */}
                <div className={styles.filterCard}>
                    <h3 className={styles.filterTitle}>
                        <Filter size={16} />
                        Filters
                    </h3>

                    <span className={styles.filterLabel}>Status</span>
                    <div className={styles.filterList}>
                        {STATUS_FILTERS.map((s) => (
                            <button
                                key={s.key}
                                onClick={() => setStatusFilter(s.key)}
                                className={cn(
                                    styles.filterBtn,
                                    statusFilter === s.key && styles.filterBtnActive
                                )}
                            >
                                <span>{s.label}</span>
                                {(statusCounts[s.key] ?? 0) > 0 && (
                                    <span className={styles.filterCount}>
                                        {statusCounts[s.key]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Complaints Content */}
                <div className={styles.contentArea}>
                    {/* Search */}
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by ID or title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    {/* Results Summary */}
                    <p className={styles.resultsSummary}>
                        Showing <strong>{filteredComplaints.length}</strong> of{' '}
                        <strong>{complaints.length}</strong> complaints
                    </p>

                    {/* Complaints List */}
                    <div className={styles.complaintsList}>
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map((complaint: any) => (
                                <Link
                                    key={complaint._id || complaint.id}
                                    href={`/complaints/${complaint.complaintId}`}
                                    className={styles.complaintCard}
                                >
                                    <div className={styles.complaintCardInner}>
                                        {/* Urgency Color Bar */}
                                        <div className={cn(
                                            styles.urgencyBar,
                                            getUrgencyClass(complaint.urgency)
                                        )} />

                                        {/* Card Body */}
                                        <div className={styles.cardBody}>
                                            <div className={styles.cardTopRow}>
                                                <div>
                                                    <div className={styles.cardMeta}>
                                                        <span className={styles.complaintId}>
                                                            {complaint.complaintId}
                                                        </span>
                                                        <span className={styles.metaDot}>•</span>
                                                        <span className={styles.deptLabel}>
                                                            {getDepartmentLabel(complaint.department)}
                                                        </span>
                                                    </div>
                                                    <h3 className={styles.complaintTitle}>
                                                        {complaint.title}
                                                    </h3>
                                                </div>
                                                <StatusBadge status={complaint.status as any} />
                                            </div>

                                            <div className={styles.cardFooter}>
                                                <div className={styles.footerItem}>
                                                    <Calendar size={14} />
                                                    <span>Filed {formatRelativeDate(new Date(complaint.createdAt))}</span>
                                                </div>
                                                <div className={cn(styles.footerItem, styles.urgencyTag, getUrgencyTagClass(complaint.urgency))}>
                                                    <AlertTriangle size={14} />
                                                    <span>{complaint.urgency.charAt(0).toUpperCase() + complaint.urgency.slice(1)} Urgency</span>
                                                </div>
                                                <div className={styles.viewDetails}>
                                                    View Details
                                                    <ChevronRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <FileText size={28} />
                                </div>
                                <h3 className={styles.emptyTitle}>No complaints found</h3>
                                <p className={styles.emptyText}>
                                    We couldn&apos;t find any complaints matching your search or filters.
                                </p>
                                <button
                                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                    className={styles.clearBtn}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
