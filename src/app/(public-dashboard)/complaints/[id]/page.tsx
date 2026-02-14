'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Building2,
    Image as ImageIcon,
    Download,
    MessageSquare,
    Clock,
    Share2,
    AlertTriangle
} from 'lucide-react';
import StatusBadge from '@/components/complaints/StatusBadge';
import StatusTimeline from '@/components/complaints/StatusTimeline';
import { formatDateTime } from '@/lib/utils/date-formatter';
import { getDepartmentLabel } from '@/constants/departments';
import { cn } from '@/lib/utils/cn';
import { generateComplaintPDF } from '@/lib/utils/pdf-generator';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import styles from './ComplaintDetails.module.css';

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { userData } = useAuth();
    const [complaint, setComplaint] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await fetch(`/api/complaints/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setComplaint(data.complaint);
                } else {
                    router.push('/complaints');
                }
            } catch (error) {
                console.error('Failed to fetch complaint', error);
                router.push('/complaints');
            } finally {
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!complaint) return null;

    const handleDownloadPDF = () => {
        generateComplaintPDF({
            complaintId: complaint.complaintId,
            userName: complaint.userName || userData?.name || 'Citizen Name',
            department: getDepartmentLabel(complaint.department),
            title: complaint.title,
            description: complaint.description,
            status: complaint.status,
            createdAt: formatDateTime(new Date(complaint.createdAt)),
            location: complaint.location,
        });
    };

    return (
        <div className={styles.container}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.headerLeft}>
                    <button onClick={() => router.back()} className={styles.backBtn}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className={styles.titleWrapper}>
                        <h1>{complaint.title}</h1>
                        <div className={styles.idMeta}>
                            <span className={styles.idBadge}>{complaint.complaintId}</span>
                            <span className={styles.deptLabel}>{getDepartmentLabel(complaint.department)}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleDownloadPDF} className={cn(styles.actionBtn, styles.btnSecondary)}>
                        <Download size={16} /> Export PDF
                    </button>
                    <button className={cn(styles.actionBtn, styles.btnPrimary)}>
                        <MessageSquare size={16} /> AI Assistant
                    </button>
                </div>
            </div>

            <div className={styles.mainGrid}>
                {/* Main Content Column */}
                <div className={styles.contentCol}>
                    {/* Status Summary Card */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.statusArea}>
                                <StatusBadge status={complaint.status} />
                                <h2 className="text-xl font-bold text-slate-900">{complaint.title}</h2>
                            </div>
                            <div className={styles.metaArea}>
                                <span className={cn(
                                    styles.urgencyBadge,
                                    complaint.urgency === 'high' || complaint.urgency === 'emergency'
                                        ? styles.urgencyHigh
                                        : styles.urgencyNormal
                                )}>
                                    {complaint.urgency} Priority
                                </span>
                                <span className={styles.filedDate}>
                                    Filed {formatDateTime(new Date(complaint.createdAt))}
                                </span>
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <h3 className={styles.sectionTitle}>Description</h3>
                            <div className={styles.descriptionBox}>
                                {complaint.description}
                            </div>

                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <div className={cn(styles.infoIcon, styles.iconBlue)}>
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <span className={styles.infoLabel}>Location</span>
                                        <p className={styles.infoValue}>{complaint.location}</p>
                                        <p className={styles.infoSubValue}>PIN: {complaint.pinCode}</p>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <div className={cn(styles.infoIcon, styles.iconPurple)}>
                                        <Building2 size={18} />
                                    </div>
                                    <div>
                                        <span className={styles.infoLabel}>Category</span>
                                        <p className={styles.infoValue}>{getDepartmentLabel(complaint.department)}</p>
                                        <p className={styles.infoSubValue}>
                                            {complaint.subCategory ? complaint.subCategory.replace(/_/g, ' ') : complaint.category}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media/Attachments */}
                    {(complaint.attachments?.length > 0 || complaint.images?.length > 0) && (
                        <div className={styles.card}>
                            <div className={styles.cardBody}>
                                <h3 className={styles.sectionTitle}>Evidence & Attachments</h3>
                                <div className={styles.attachmentGrid}>
                                    {(complaint.attachments || complaint.images).map((url: string, i: number) => (
                                        <div key={i} className={styles.attachmentItem}>
                                            <img src={url} alt={`Evidence ${i + 1}`} />
                                            <div className={styles.overlay}>
                                                <a href={url} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
                                                    <Download size={18} />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resolved Banner */}
                    {complaint.status === 'resolved' && (
                        <div className={styles.resolvedBanner}>
                            <div className={styles.bannerText}>
                                <h3>Grievance Resolved</h3>
                                <p>We hope the resolution provided by the department is satisfactory. Please provide your feedback.</p>
                            </div>
                            <div className={styles.bannerActions}>
                                <button className={styles.whiteBtn}>Rate Service</button>
                                <button className={styles.outlineBtn}>Close Ticket</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className={styles.sidebarCol}>
                    <div className={styles.sidebarCard}>
                        <h3 className={styles.sidebarTitle}>
                            <Clock size={18} /> Tracking Timeline
                        </h3>
                        <StatusTimeline
                            currentStatus={complaint.status}
                            timeline={complaint.timeline || []}
                        />
                    </div>

                    <div className={styles.supportBox}>
                        <div className={styles.supportHeader}>
                            <div className={styles.supportIcon}>
                                <MessageSquare size={18} />
                            </div>
                            <h4 className={styles.supportTitle}>Department Helpdesk</h4>
                        </div>
                        <p className={styles.supportText}>
                            Connect with the department staff directly regarding this petition for faster assistance.
                        </p>
                        <button className={styles.contactBtn}>Contact Desk</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
