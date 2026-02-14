'use client';

import { useState } from 'react';
import {
    Settings,
    Building2,
    Bell,
    Shield,
    Save,
    RefreshCw,
    CheckCircle,
    Info,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import styles from './AdminSettings.module.css';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        Admin <span className={styles.titleAccent}>Settings</span>
                    </h1>
                    <p className={styles.subtitle}>
                        <span className={styles.liveDot} />
                        System Configuration • Admin Panel
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsWrapper}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={cn(styles.tab, activeTab === tab.id && styles.tabActive)}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon size={14} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className={styles.content}>
                {activeTab === 'general' && (
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>General Settings</h3>
                        <p className={styles.sectionDesc}>
                            Configure the basic settings for the Pollachi Municipal Corporation Grievance Portal.
                        </p>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Portal Name</label>
                            <input
                                className={styles.input}
                                type="text"
                                defaultValue="Pollachi Municipal Corporation - Grievance Portal"
                                readOnly
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Contact Email</label>
                            <input
                                className={styles.input}
                                type="email"
                                defaultValue="grievance@pollachi.gov.in"
                                readOnly
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Contact Phone</label>
                            <input
                                className={styles.input}
                                type="text"
                                defaultValue="+91 4259 222 333"
                                readOnly
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Address</label>
                            <input
                                className={styles.input}
                                type="text"
                                defaultValue="Municipal Office, Bazaar Street, Pollachi, Tamil Nadu - 642001"
                                readOnly
                            />
                        </div>

                        <div className={styles.infoBox}>
                            <Info size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                            <p>These settings are read-only and managed by the system administrator. Contact the IT department for changes.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'departments' && (
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>Department Configuration</h3>
                        <p className={styles.sectionDesc}>
                            Overview of all registered departments in the system.
                        </p>

                        <div className={styles.deptList}>
                            {['Water Supply', 'Electricity / Power', 'Sanitation / Waste Management', 'Roads & Transportation', 'Health Services', 'Education'].map((dept, idx) => (
                                <div key={idx} className={styles.deptItem}>
                                    <div className={styles.deptInfo}>
                                        <Building2 size={16} style={{ color: 'var(--tn-navy)' }} />
                                        <span>{dept}</span>
                                    </div>
                                    <span className={styles.statusActive}>Active</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>Notification Settings</h3>
                        <p className={styles.sectionDesc}>
                            Configure how notifications are sent to users and department heads.
                        </p>

                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingLabel}>Email Notifications</p>
                                <p className={styles.settingDesc}>Send email alerts for complaint status updates</p>
                            </div>
                            <div className={styles.toggleOn}>Enabled</div>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingLabel}>New Complaint Alerts</p>
                                <p className={styles.settingDesc}>Notify department heads when new complaints are submitted</p>
                            </div>
                            <div className={styles.toggleOn}>Enabled</div>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingLabel}>Escalation Alerts</p>
                                <p className={styles.settingDesc}>Alert admins when complaints remain unresolved beyond SLA</p>
                            </div>
                            <div className={styles.toggleOn}>Enabled</div>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingLabel}>SMS Notifications</p>
                                <p className={styles.settingDesc}>Send SMS notifications to citizens</p>
                            </div>
                            <div className={styles.toggleOff}>Disabled</div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>Security Settings</h3>
                        <p className={styles.sectionDesc}>
                            Security configuration for the grievance portal.
                        </p>

                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingLabel}>Two-Factor Authentication</p>
                                <p className={styles.settingDesc}>Require 2FA for admin accounts</p>
                            </div>
                            <div className={styles.toggleOff}>Disabled</div>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingLabel}>Session Timeout</p>
                                <p className={styles.settingDesc}>Auto-logout after inactivity</p>
                            </div>
                            <div className={styles.toggleOn}>24 Hours</div>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <p className={styles.settingLabel}>Password Policy</p>
                                <p className={styles.settingDesc}>Minimum password requirements</p>
                            </div>
                            <div className={styles.toggleOn}>Strong</div>
                        </div>

                        <div className={styles.infoBox}>
                            <Shield size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                            <p>Security settings are managed at the infrastructure level. Contact the IT security team for policy changes.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Status */}
            {saved && (
                <div className={styles.saveToast}>
                    <CheckCircle size={16} />
                    Settings saved successfully
                </div>
            )}
        </div>
    );
}
