'use client';

import { ComplaintStatus } from '@/types/complaint';
import { getStatusConfig } from '@/constants/statuses';
import { cn } from '@/lib/utils/cn';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
    status: ComplaintStatus;
    className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = getStatusConfig(status);

    return (
        <span
            className={cn(
                styles.badge,
                styles[status],
                className
            )}
        >
            <span className={styles.dot} />
            {config.label}
        </span>
    );
}
