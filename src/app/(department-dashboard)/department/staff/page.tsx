'use client';

import { useAuth } from '@/hooks/useAuth';
import {
    Users,
    UserPlus,
    Search,
    MoreVertical,
    Mail,
    Phone,
    Shield,
    Activity,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const mockStaff = [
    { id: '1', name: 'Ramesh Kumar', role: 'Field Supervisor', status: 'On Site', complaints: 8, performance: 94 },
    { id: '2', name: 'Meena Selvam', role: 'Department Operator', status: 'Online', complaints: 14, performance: 98 },
    { id: '3', name: 'Arun Prakash', role: 'Technician', status: 'Offline', complaints: 0, performance: 88 },
    { id: '4', name: 'Suresh Raina', role: 'Field Agent', status: 'In Break', complaints: 3, performance: 91 },
];

export default function StaffManagement() {
    const { userData } = useAuth();

    return (
        <div className="space-y-8 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and monitor {userData?.department?.replace('_', ' ')} staff</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-all flex items-center gap-2">
                    <UserPlus size={16} /> Add Team Member
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, role or ID..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <button className="px-4 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2">
                    <Filter size={18} /> Filters
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockStaff.map((staff) => (
                    <div key={staff.id} className="glass-card p-6 flex flex-col items-center text-center group">
                        <div className="relative mb-4">
                            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">
                                {staff.name.charAt(0)}
                            </div>
                            <div className={cn(
                                'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white',
                                staff.status === 'Online' || staff.status === 'On Site' ? 'bg-green-500' :
                                    staff.status === 'In Break' ? 'bg-amber-500' : 'bg-slate-300'
                            )} />
                        </div>

                        <h3 className="font-bold text-slate-900">{staff.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{staff.role}</p>

                        <div className="mt-6 w-full grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Cases</p>
                                <p className="text-lg font-bold text-slate-800">{staff.complaints}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
                                <p className="text-lg font-bold text-blue-600">{staff.performance}%</p>
                            </div>
                        </div>

                        <div className="mt-6 w-full flex gap-2">
                            <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-100 transition-all">Actions</button>
                            <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-100 transition-all">Assign</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
