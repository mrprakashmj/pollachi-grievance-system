'use client';

import { useAuth } from '@/hooks/useAuth';
import {
    Settings,
    MapPin,
    Clock,
    Bell,
    ShieldCheck,
    Building2,
    Save,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function DepartmentSettings() {
    const { userData } = useAuth();

    return (
        <div className="max-w-4xl space-y-8 fade-in pb-20">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Department Configuration</h1>
                <p className="text-sm text-slate-500 mt-1">Manage rules, SLA targets and department profile</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    {[
                        { label: 'General Info', icon: Building2, active: true },
                        { label: 'SLA & Targets', icon: Clock },
                        { label: 'Notifications', icon: Bell },
                        { label: 'Geofencing', icon: MapPin },
                        { label: 'Security', icon: ShieldCheck },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={cn(
                                'w-full flex items-center justify-between p-4 rounded-xl text-sm font-bold transition-all',
                                item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 hover:bg-slate-50'
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} />
                                {item.label}
                            </div>
                            <ChevronRight size={14} className={item.active ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass-card p-8">
                        <h3 className="font-bold text-lg text-slate-900 mb-8 border-b border-slate-50 pb-4">General Information</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Department Name</label>
                                <input
                                    type="text"
                                    defaultValue={userData?.department?.replace('_', ' ').toUpperCase()}
                                    disabled
                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-400 cursor-not-allowed"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Default SLA (Hours)</label>
                                    <input
                                        type="number"
                                        defaultValue="48"
                                        className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Urgency Multiplier</label>
                                    <select className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium">
                                        <option>1.5x speed</option>
                                        <option>2.0x speed</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Coverage Areas</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Pollachi East', 'Market Road', 'Court Area', 'New Colony'].map((area, i) => (
                                        <span key={i} className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-full flex items-center gap-2">
                                            {area}
                                            <button className="hover:text-blue-800">×</button>
                                        </span>
                                    ))}
                                    <button className="px-4 py-2 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-[10px] rounded-full hover:border-blue-400 hover:text-blue-400 transition-all">
                                        + Add Area
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-end">
                            <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl text-sm hover:bg-slate-800 transition-all flex items-center gap-2">
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
