'use client';

import { ComplaintStatus } from '@/types/complaint';
import { STATUSES } from '@/constants/statuses';
import { formatDateTime } from '@/lib/utils/date-formatter';
import { CheckCircle2, Clock, User, MessageCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import styles from './StatusTimeline.module.css';

interface StatusTimelineProps {
    currentStatus: ComplaintStatus;
    timeline: {
        status: ComplaintStatus;
        timestamp: Date;
        notes?: string;
        updatedBy?: string;
    }[];
}

export default function StatusTimeline({ currentStatus, timeline }: StatusTimelineProps) {
    // We want to show the full potential flow and highlight achieved steps
    // For simplicity, we'll show the actual achievements from the timeline data

    return (
        <div className={styles.timeline}>
            {timeline.map((item, idx) => {
                const isLast = idx === 0;
                const statusConfig = STATUSES.find(s => s.id === item.status);

                return (
                    <div key={idx} className={styles.item}>
                        {/* Timeline Icon */}
                        <div className={cn(
                            styles.iconWrapper,
                            isLast ? styles.iconActive : styles.iconInactive
                        )}>
                            {item.status === 'resolved' ? <CheckCircle2 size={16} /> :
                                item.status === 'in_progress' ? <Clock size={16} /> :
                                    item.status === 'assigned' ? <User size={16} /> :
                                        <AlertCircle size={16} />}
                        </div>

                        <div className={styles.content}>
                            <div className={styles.header}>
                                <h4 className={cn(
                                    styles.title,
                                    isLast ? styles.titleActive : styles.titleInactive
                                )}>
                                    {statusConfig?.label || item.status.replace('_', ' ')}
                                </h4>
                                <time className={styles.time}>
                                    {formatDateTime(item.timestamp)}
                                </time>
                            </div>

                            {item.notes && (
                                <div className={styles.notes}>
                                    <p className={styles.notesText}>
                                        &ldquo;{item.notes}&rdquo;
                                    </p>
                                </div>
                            )}

                            {item.updatedBy && (
                                <div className={styles.updatedBy}>
                                    <User size={12} />
                                    Updated by {item.updatedBy}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
