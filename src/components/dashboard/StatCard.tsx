'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import styles from './StatCard.module.css';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
    bgColor?: string;
    className?: string;
}

export default function StatCard({
    label,
    value,
    icon: Icon,
    subValue,
    trend,
    color = 'text-tn-navy',
    bgColor = 'bg-tn-navy/10',
    className,
}: StatCardProps) {
    return (
        <div className={cn(styles.card, className)}>
            <div className={styles.header}>
                <div className={cn(styles.iconWrapper, bgColor, color)}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={cn(
                        styles.trendBadge,
                        trend === 'up' ? styles.trendUp :
                            trend === 'down' ? styles.trendDown : styles.trendNeutral
                    )}>
                        {trend === 'up' ? '↑ Increasing' : trend === 'down' ? '↓ Decreasing' : '→ Stable'}
                    </div>
                )}
            </div>
            <div>
                <p className={styles.value}>{value}</p>
                <div className={styles.footer}>
                    <p className={styles.label}>{label}</p>
                    {subValue && <span className={styles.subValue}>{subValue}</span>}
                </div>
            </div>
        </div>
    );
}
