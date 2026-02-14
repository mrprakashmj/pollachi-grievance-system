'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Search,
    RefreshCw,
    X,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    FileText,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Eye,
    ArrowRight,
    Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DEPARTMENTS } from '@/constants/departments';
import { format } from 'date-fns';
import styles from './AdminComplaints.module.css';

interface Complaint {
    _id: string;
    complaintId: string;
    title: string;
    description: string;
    category: string;
    urgency: string;
    status: string;
    location: string;
    userName: string;
    userId: string;
    department: string;
    images: string[];
    timeline: Array<{
        status: string;
        timestamp: string;
        note?: string;
        updatedBy?: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface DeptCount {
    id: string;
    label: string;
    count: number;
}

const STATUS_LABELS: Record<string, string> = {
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
    closed: 'Closed',
};

const URGENCY_LABELS: Record<string, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    emergency: 'Emergency',
};

const DEPT_COLORS: Record<string, { bg: string; text: string }> = {
    water_supply: { bg: '#eff6ff', text: '#2563eb' },
    electricity: { bg: '#fffbeb', text: '#d97706' },
    sanitation: { bg: '#f0fdf4', text: '#16a34a' },
    roads: { bg: '#faf5ff', text: '#8b5cf6' },
    health: { bg: '#fef2f2', text: '#dc2626' },
    education: { bg: '#fdf2f8', text: '#db2777' },
};

export default function AdminComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [deptCounts, setDeptCounts] = useState<DeptCount[]>([]);
    const [statusCounts, setStatusCounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDept, setActiveDept] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [urgencyFilter, setUrgencyFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const fetchComplaints = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: '20',
                department: activeDept,
                status: statusFilter,
                urgency: urgencyFilter,
            });
            if (searchQuery.trim()) params.set('search', searchQuery.trim());

            const res = await fetch(`/api/admin/complaints?${params}`);

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Server Error (${res.status}): ${errorText.substring(0, 200)}`);
            }

            const data = await res.json();
            setComplaints(data.complaints || []);
            setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
            setDeptCounts(data.departmentCounts || []);
            setStatusCounts(data.statusCounts || []);
        } catch (error: any) {
            console.error('Failed to fetch complaints:', error);
            alert(`Error fetching complaints: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [activeDept, statusFilter, urgencyFilter, searchQuery]);

    useEffect(() => {
        fetchComplaints(1);
    }, [fetchComplaints]);

    const handleStatusUpdate = async (status: string, note?: string) => {
        if (!selectedComplaint) return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/admin/complaints/${selectedComplaint.complaintId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    note: note || '',
                    department: selectedComplaint.department,
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Server returned ${res.status}`);
            }

            const data = await res.json();
            // Update the complaint in the list
            setComplaints(prev =>
                prev.map(c => c.complaintId === selectedComplaint.complaintId
                    ? { ...c, ...data.complaint }
                    : c
                )
            );
            setSelectedComplaint({ ...selectedComplaint, ...data.complaint });
            setShowRejectModal(false);
            setRejectReason('');
            // Refresh counts
            fetchComplaints(pagination.page);
            alert(`Complaint status updated to "${status}" successfully!`);
        } catch (error: any) {
            console.error('Failed to update status:', error);
            alert(`Failed to update status: ${error.message}`);
        } finally {
            setActionLoading(false);
        }
    };


    const getStatusStyle = (status: string) => {
        const map: Record<string, string> = {
            submitted: styles.statusSubmitted,
            acknowledged: styles.statusAcknowledged,
            in_progress: styles.statusInProgress,
            resolved: styles.statusResolved,
            rejected: styles.statusRejected,
            closed: styles.statusClosed,
        };
        return map[status] || styles.statusSubmitted;
    };

    const getUrgencyStyle = (urgency: string) => {
        const map: Record<string, string> = {
            low: styles.urgencyLow,
            medium: styles.urgencyMedium,
            high: styles.urgencyHigh,
            emergency: styles.urgencyEmergency,
        };
        return map[urgency] || styles.urgencyLow;
    };

    const getDeptLabel = (id: string) => {
        const dept = DEPARTMENTS.find(d => d.id === id);
        return dept?.label || id;
    };

    const totalAll = deptCounts.reduce((sum, d) => sum + d.count, 0);
    const totalPending = statusCounts
        .filter(s => ['submitted', 'acknowledged', 'in_progress'].includes(s.status))
        .reduce((sum, s) => sum + s.count, 0);
    const totalResolved = statusCounts.find(s => s.status === 'resolved')?.count || 0;
    const totalRejected = statusCounts.find(s => s.status === 'rejected')?.count || 0;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        All <span className={styles.titleAccent}>Complaints</span>
                    </h1>
                    <p className={styles.subtitle}>
                        <span className={styles.liveDot} />
                        Complaint Management • Admin Panel
                    </p>
                </div>
                <button className={styles.refreshBtn} onClick={() => fetchComplaints(pagination.page)}>
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* Stats row */}
            <div className={styles.statsRow}>
                <div className={styles.statMini}>
                    <div className={styles.statMiniLabel}>Total</div>
                    <div className={styles.statMiniValue}>{totalAll}</div>
                </div>
                <div className={styles.statMini}>
                    <div className={styles.statMiniLabel}>Pending</div>
                    <div className={styles.statMiniValue}>{totalPending}</div>
                </div>
                <div className={styles.statMini}>
                    <div className={styles.statMiniLabel}>Resolved</div>
                    <div className={styles.statMiniValue}>{totalResolved}</div>
                </div>
                <div className={styles.statMini}>
                    <div className={styles.statMiniLabel}>Rejected</div>
                    <div className={styles.statMiniValue}>{totalRejected}</div>
                </div>
            </div>

            {/* Department Tabs */}
            <div className={styles.tabsWrapper}>
                <div className={styles.tabs}>
                    <button
                        className={cn(styles.tab, activeDept === 'all' && styles.tabActive)}
                        onClick={() => setActiveDept('all')}
                    >
                        All
                        <span className={styles.tabCount}>{totalAll}</span>
                    </button>
                    {deptCounts.map(dept => (
                        <button
                            key={dept.id}
                            className={cn(styles.tab, activeDept === dept.id && styles.tabActive)}
                            onClick={() => setActiveDept(dept.id)}
                        >
                            {dept.label}
                            <span className={styles.tabCount}>{dept.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filtersBar}>
                <div className={styles.searchWrapper}>
                    <Search size={14} className={styles.searchIcon} />
                    <input
                        className={styles.searchInput}
                        placeholder="Search by ID, title, user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchComplaints(1)}
                    />
                </div>
                <select
                    className={styles.filterSelect}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                    ))}
                </select>
                <select
                    className={styles.filterSelect}
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value)}
                >
                    <option value="all">All Urgency</option>
                    {Object.entries(URGENCY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
                {loading ? (
                    <div>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className={styles.skeletonRow}>
                                <div className={cn(styles.skeleton, styles.skeletonCell)} style={{ width: '120px', height: '14px' }} />
                                <div className={cn(styles.skeleton, styles.skeletonCell)} style={{ width: '200px', height: '14px' }} />
                                <div className={cn(styles.skeleton, styles.skeletonCell)} style={{ width: '100px', height: '14px' }} />
                                <div className={cn(styles.skeleton, styles.skeletonCell)} style={{ width: '80px', height: '14px' }} />
                                <div className={cn(styles.skeleton, styles.skeletonCell)} style={{ width: '80px', height: '14px' }} />
                                <div className={cn(styles.skeleton, styles.skeletonCell)} style={{ width: '100px', height: '14px' }} />
                            </div>
                        ))}
                    </div>
                ) : complaints.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Inbox size={48} className={styles.emptyIcon} />
                        <p className={styles.emptyTitle}>No complaints found</p>
                        <p className={styles.emptySubtitle}>Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    <>
                        <table className={styles.table}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th className={styles.th}>ID</th>
                                    <th className={styles.th}>Title</th>
                                    <th className={styles.th}>Department</th>
                                    <th className={styles.th}>Urgency</th>
                                    <th className={styles.th}>Status</th>
                                    <th className={styles.th}>Submitted By</th>
                                    <th className={styles.th}>Date</th>
                                    <th className={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((complaint) => (
                                    <tr
                                        key={complaint.complaintId}
                                        className={styles.tr}
                                        onClick={() => setSelectedComplaint(complaint)}
                                    >
                                        <td className={cn(styles.td, styles.complaintIdCell)}>
                                            {complaint.complaintId}
                                        </td>
                                        <td className={cn(styles.td, styles.titleCell)}>
                                            {complaint.title}
                                        </td>
                                        <td className={styles.td}>
                                            <span
                                                className={styles.deptBadge}
                                                style={{
                                                    backgroundColor: DEPT_COLORS[complaint.department]?.bg || '#f1f5f9',
                                                    color: DEPT_COLORS[complaint.department]?.text || '#475569',
                                                }}
                                            >
                                                {getDeptLabel(complaint.department)}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={cn(styles.urgencyBadge, getUrgencyStyle(complaint.urgency))}>
                                                {URGENCY_LABELS[complaint.urgency] || complaint.urgency}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            <span className={cn(styles.statusBadge, getStatusStyle(complaint.status))}>
                                                <span className={styles.statusDot} />
                                                {STATUS_LABELS[complaint.status] || complaint.status}
                                            </span>
                                        </td>
                                        <td className={styles.td}>
                                            {complaint.userName}
                                        </td>
                                        <td className={cn(styles.td, styles.dateCell)}>
                                            {format(new Date(complaint.createdAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className={styles.td}>
                                            <button
                                                className={styles.refreshBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedComplaint(complaint);
                                                }}
                                                style={{ padding: '0.375rem 0.5rem' }}
                                            >
                                                <Eye size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className={styles.pagination}>
                            <span className={styles.pageInfo}>
                                Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                            </span>
                            <div className={styles.pageButtons}>
                                <button
                                    className={styles.pageBtn}
                                    disabled={pagination.page <= 1}
                                    onClick={() => fetchComplaints(pagination.page - 1)}
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <button
                                    className={styles.pageBtn}
                                    disabled={pagination.page >= pagination.totalPages}
                                    onClick={() => fetchComplaints(pagination.page + 1)}
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Detail Panel */}
            {selectedComplaint && (
                <>
                    <div className={styles.panelOverlay} onClick={() => setSelectedComplaint(null)} />
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div>
                                <p className={styles.panelTitle}>Complaint Details</p>
                                <p style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)', fontFamily: 'monospace', marginTop: '0.25rem' }}>
                                    {selectedComplaint.complaintId}
                                </p>
                            </div>
                            <button className={styles.panelCloseBtn} onClick={() => setSelectedComplaint(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className={styles.panelBody}>
                            {/* Basic Info */}
                            <div className={styles.panelSection}>
                                <h4 className={styles.panelSectionTitle}>Complaint Information</h4>
                                <div className={styles.detailGrid}>
                                    <div className={cn(styles.detailItem, styles.detailItemFull)}>
                                        <span className={styles.detailLabel}>Title</span>
                                        <span className={styles.detailValue}>{selectedComplaint.title}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Department</span>
                                        <span className={styles.detailValue}>{getDeptLabel(selectedComplaint.department)}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Category</span>
                                        <span className={styles.detailValue}>{selectedComplaint.category}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Status</span>
                                        <span className={cn(styles.statusBadge, getStatusStyle(selectedComplaint.status))}>
                                            <span className={styles.statusDot} />
                                            {STATUS_LABELS[selectedComplaint.status]}
                                        </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Urgency</span>
                                        <span className={cn(styles.urgencyBadge, getUrgencyStyle(selectedComplaint.urgency))}>
                                            {URGENCY_LABELS[selectedComplaint.urgency]}
                                        </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Location</span>
                                        <span className={styles.detailValue}>{selectedComplaint.location}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Created</span>
                                        <span className={styles.detailValue}>
                                            {format(new Date(selectedComplaint.createdAt), 'dd MMM yyyy, hh:mm a')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className={styles.panelSection}>
                                <h4 className={styles.panelSectionTitle}>Description</h4>
                                <p className={styles.descriptionText}>{selectedComplaint.description}</p>
                            </div>

                            {/* User Info */}
                            <div className={styles.panelSection}>
                                <h4 className={styles.panelSectionTitle}>Submitted By</h4>
                                <div className={styles.detailGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Name</span>
                                        <span className={styles.detailValue}>{selectedComplaint.userName}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>User ID</span>
                                        <span className={styles.detailValue} style={{ fontFamily: 'monospace', fontSize: '0.6875rem' }}>
                                            {selectedComplaint.userId}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            {selectedComplaint.timeline && selectedComplaint.timeline.length > 0 && (
                                <div className={styles.panelSection}>
                                    <h4 className={styles.panelSectionTitle}>Timeline</h4>
                                    <div className={styles.timeline}>
                                        {selectedComplaint.timeline.map((entry, idx) => (
                                            <div key={idx} className={styles.timelineItem}>
                                                <div className={styles.timelineDot} />
                                                <div className={styles.timelineStatus}>
                                                    {STATUS_LABELS[entry.status] || entry.status}
                                                </div>
                                                <div className={styles.timelineDate}>
                                                    {format(new Date(entry.timestamp), 'dd MMM yyyy, hh:mm a')}
                                                </div>
                                                {entry.note && (
                                                    <div className={styles.timelineNote}>{entry.note}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reject reason input */}
                            {showRejectModal && (
                                <div className={styles.rejectModal}>
                                    <textarea
                                        className={styles.rejectTextarea}
                                        placeholder="Enter rejection reason..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                    />
                                    <div className={styles.rejectActions}>
                                        <button
                                            className={cn(styles.actionBtn, styles.btnClose)}
                                            onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className={cn(styles.actionBtn, styles.btnReject)}
                                            disabled={actionLoading || !rejectReason.trim()}
                                            onClick={() => handleStatusUpdate('rejected', rejectReason)}
                                        >
                                            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                            Confirm Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Bar */}
                        <div className={styles.panelActions}>
                            {selectedComplaint.status === 'submitted' && (
                                <>
                                    <button
                                        className={cn(styles.actionBtn, styles.btnAcknowledge)}
                                        disabled={actionLoading}
                                        onClick={() => handleStatusUpdate('acknowledged')}
                                    >
                                        {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                        Acknowledge
                                    </button>
                                    <button
                                        className={cn(styles.actionBtn, styles.btnReject)}
                                        disabled={actionLoading}
                                        onClick={() => setShowRejectModal(true)}
                                    >
                                        <XCircle size={14} />
                                        Reject
                                    </button>
                                </>
                            )}
                            {selectedComplaint.status === 'acknowledged' && (
                                <>
                                    <button
                                        className={cn(styles.actionBtn, styles.btnInProgress)}
                                        disabled={actionLoading}
                                        onClick={() => handleStatusUpdate('in_progress')}
                                    >
                                        {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
                                        Mark In Progress
                                    </button>
                                    <button
                                        className={cn(styles.actionBtn, styles.btnReject)}
                                        disabled={actionLoading}
                                        onClick={() => setShowRejectModal(true)}
                                    >
                                        <XCircle size={14} />
                                        Reject
                                    </button>
                                </>
                            )}
                            {selectedComplaint.status === 'in_progress' && (
                                <button
                                    className={cn(styles.actionBtn, styles.btnResolve)}
                                    disabled={actionLoading}
                                    onClick={() => handleStatusUpdate('resolved')}
                                >
                                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                    Mark Resolved
                                </button>
                            )}
                            {selectedComplaint.status === 'resolved' && (
                                <button
                                    className={cn(styles.actionBtn, styles.btnClose)}
                                    disabled={actionLoading}
                                    onClick={() => handleStatusUpdate('closed')}
                                >
                                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                                    Close Complaint
                                </button>
                            )}
                            {['rejected', 'closed'].includes(selectedComplaint.status) && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                                    This complaint has been {selectedComplaint.status}. No further actions available.
                                </span>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
