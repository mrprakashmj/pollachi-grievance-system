'use client';

import { useState, useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import StatCard from '@/components/dashboard/StatCard';
import {
    ClipboardList,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ArrowUpRight,
    TrendingUp,
    Users,
    Calendar,
    MoreVertical,
    Search
} from 'lucide-react';
import Link from 'next/link';
import StatusBadge from '@/components/complaints/StatusBadge';
import { formatRelativeDate } from '@/lib/utils/date-formatter';
import { cn } from '@/lib/utils/cn';

// Mock department data
const deptStats = [
    { label: 'Total Assigned', value: 84, icon: ClipboardList, color: 'text-tn-navy', bg: 'bg-blue-50', trend: 'up' },
    { label: 'Pending Action', value: 26, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'neutral' },
    { label: 'Resolved (Month)', value: 58, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', trend: 'up' },
    { label: 'SLA Breaches', value: 3, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-red-50', trend: 'down' },
];

const urgentComplaints = [
    {
        id: '1',
        complaintId: 'POL-WATER-20250211-1234',
        title: 'Major main burst at Court Street',
        userName: 'Officer Kumar',
        status: 'acknowledged',
        urgency: 'emergency',
        createdAt: new Date('2025-02-11T16:00:00'),
    },
    {
        id: '2',
        complaintId: 'POL-WATER-20250211-9988',
        title: 'Quality issues near hospital area',
        userName: 'Meena S.',
        status: 'assigned',
        urgency: 'high',
        createdAt: new Date('2025-02-11T13:45:00'),
    }
];

const DepartmentDashboard = () => {
    const { userData } = useAuth();
    const [stats, setStats] = useState<any[]>([]);
    const [urgentComplaints, setUrgentComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/department/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                    setUrgentComplaints(data.urgentComplaints);
                }
            } catch (error) {
                console.error('Failed to fetch department stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getIcon = (label: string) => {
        switch (label) {
            case 'Total Assigned': return ClipboardList;
            case 'Pending Action': return Clock;
            case 'Resolved (Month)': return CheckCircle2;
            case 'SLA Breaches': return AlertTriangle;
            default: return ClipboardList;
        }
    };

    const getColor = (label: string) => {
        switch (label) {
            case 'Total Assigned': return { color: 'text-tn-navy', bg: 'bg-blue-50' };
            case 'Pending Action': return { color: 'text-amber-600', bg: 'bg-amber-50' };
            case 'Resolved (Month)': return { color: 'text-green-600', bg: 'bg-green-50' };
            case 'SLA Breaches': return { color: 'text-destructive', bg: 'bg-red-50' };
            default: return { color: 'text-gray-600', bg: 'bg-gray-50' };
        }
    };

    return (
        <div className="space-y-8 fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-tn-navy">
                        {userData?.department?.replace('_', ' ').toUpperCase()} Department
                    </h1>
                    <p className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-tn-green" />
                        Tamil Nadu Government • Pollachi East
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-border rounded-md shadow-sm flex items-center gap-3">
                        <Calendar size={16} className="text-tn-navy" />
                        <div className="text-left border-l border-border pl-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Active Cycle</p>
                            <p className="text-xs font-bold uppercase tracking-tight text-foreground">
                                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-lg" />
                    ))
                ) : (
                    stats.map((stat, idx) => {
                        const style = getColor(stat.label);
                        return (
                            <StatCard
                                key={idx}
                                label={stat.label}
                                value={stat.value}
                                icon={getIcon(stat.label)}
                                color={style.color}
                                bgColor={style.bg}
                                trend={stat.trend as any}
                            />
                        );
                    })
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Priority Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-border rounded-lg shadow-govt overflow-hidden">
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 text-foreground">
                                    <AlertTriangle size={18} className="text-destructive" />
                                    Critical Response Queue
                                </h3>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">High priority escalations</p>
                            </div>
                            <Link href="/department/complaints?filter=urgent" className="text-xs font-bold uppercase tracking-wide text-tn-navy hover:underline">
                                Open Queue
                            </Link>
                        </div>
                        <div className="divide-y divide-border">
                            {loading ? (
                                <div className="p-6 space-y-4">
                                    <div className="h-20 bg-slate-100 animate-pulse rounded" />
                                    <div className="h-20 bg-slate-100 animate-pulse rounded" />
                                </div>
                            ) : urgentComplaints.length === 0 ? (
                                <div className="p-6 text-center text-sm text-muted-foreground">
                                    No urgent complaints in queue.
                                </div>
                            ) : (
                                urgentComplaints.map((item) => (
                                    <div key={item.id} className="p-6 flex items-start justify-between gap-4 transition-colors hover:bg-slate-50">
                                        <div className="flex gap-4">
                                            <div className={cn(
                                                'w-1 rounded-full',
                                                item.urgency === 'emergency' ? 'bg-destructive' : 'bg-amber-500'
                                            )} />
                                            <div>
                                                <h4 className="font-bold text-base tracking-tight text-foreground mb-1">
                                                    {item.title}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="font-medium">{item.complaintId}</span>
                                                    <span>•</span>
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">{item.userName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <StatusBadge status={item.status as any} />
                                            <span className="text-[10px] font-medium uppercase text-muted-foreground">{formatRelativeDate(item.createdAt)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white border border-border rounded-lg shadow-govt p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wide mb-6 flex items-center gap-2 text-foreground">
                                <Users size={16} className="text-tn-navy" />
                                Team Status
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Ramesh K.', role: 'Field Lead', status: 'On Site', color: 'bg-green-500' },
                                    { name: 'Meena S.', role: 'Operator', status: 'Active', color: 'bg-green-500' },
                                    { name: 'Arun P.', role: 'Expert', status: 'Break', color: 'bg-amber-500' },
                                ].map((staff, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-tn-navy border border-slate-200">
                                                {staff.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-foreground">{staff.name}</p>
                                                <p className="text-[10px] font-medium text-muted-foreground uppercase">{staff.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn('w-1.5 h-1.5 rounded-full', staff.color)} />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{staff.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-tn-navy text-white rounded-lg shadow-govt p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                <TrendingUp size={24} className="text-tn-gold" />
                            </div>
                            <h4 className="text-sm font-bold uppercase tracking-wide mb-1">Efficiency Yield</h4>
                            <p className="text-xs text-slate-300 mb-6 font-medium">
                                Velocity <span className="text-green-400 font-bold">+12.4%</span> vs Baseline
                            </p>
                            <button className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-white text-tn-navy hover:bg-slate-100 rounded-md transition-colors">
                                Analytics Deck
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Activity & AI */}
                <div className="space-y-6">
                    <div className="p-6 rounded-lg bg-white border border-border shadow-govt">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">Cognitive Advisor</h3>
                                <p className="text-[10px] font-bold text-blue-600 uppercase">Optimization Active</p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                            Traffic pattern analysis recommends horizontal redistribution of <span className="text-foreground font-bold">2 staff members</span> to Gandhi Nagar.
                        </p>
                        <button className="w-full py-2.5 bg-slate-100 text-tn-navy font-bold rounded-md text-xs uppercase tracking-wide hover:bg-slate-200 transition-colors border border-slate-200">
                            Verify redistribution
                        </button>
                    </div>

                    <div className="bg-white border border-border rounded-lg shadow-govt overflow-hidden">
                        <div className="px-6 py-3 border-b border-border bg-slate-50/50 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
                            Activity Log
                        </div>
                        <div className="divide-y divide-border">
                            {[
                                { user: 'Ramesh K.', action: 'Resolved', id: 'POL-WATER-88', time: '10m ago' },
                                { user: 'System', action: 'New Intake', id: 'POL-WATER-12', time: '1h ago' },
                                { user: 'Admin', action: 'Dispatch', id: 'POL-WATER-05', time: '3h ago' },
                                { user: 'Meena S.', action: 'In-Transit', id: 'POL-WATER-92', time: '5h ago' },
                            ].map((log, idx) => (
                                <div key={idx} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground border border-slate-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground leading-snug">
                                            <span className="font-bold text-foreground">{log.user}</span> {log.action} <span className="text-tn-navy font-medium">{log.id}</span>
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepartmentDashboard;
