'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    Calendar,
    Edit3,
    Key,
    Save,
    X,
    Check,
    Eye,
    EyeOff,
    Lock
} from 'lucide-react';
import styles from './Profile.module.css';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { cn } from '@/lib/utils/cn';

export default function ProfilePage() {
    const { userData, loading, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        pinCode: '',
        aadhaar: ''
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Change Password State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                address: userData.address || '',
                pinCode: userData.pinCode || '',
                aadhaar: userData.aadhaar || ''
            });
        }
    }, [userData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className={styles.container}>
                <div className="text-center py-20">
                    <p className="text-slate-500">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    const initials = userData.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'U';

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return 'Not available';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                await refreshUser();
                setIsEditing(false);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Update failed');
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordMessage(null);

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setIsChangingPassword(true);
        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    setShowPasswordModal(false);
                    setPasswordMessage(null);
                }, 2000);
            } else {
                throw new Error(data.message || 'Failed to change password');
            }
        } catch (error: any) {
            setPasswordMessage({ type: 'error', text: error.message });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordMessage(null);
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Account Profile</h1>
                    <p className={styles.subtitle}>Manage your identity and contact information</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-premium flex items-center gap-2"
                    >
                        <Edit3 size={16} />
                        Update Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className={cn(styles.actionBtn, styles.btnSecondary, "flex items-center gap-2")}
                            disabled={isSaving}
                        >
                            <X size={16} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-premium flex items-center gap-2"
                            disabled={isSaving}
                        >
                            {isSaving ? <LoadingSpinner size="sm" /> : <Save size={16} />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            {message && (
                <div className={cn(
                    "mb-6 p-4 rounded-lg flex items-center gap-3 animate-slide-in",
                    message.type === 'success' ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                )}>
                    {message.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="text-sm font-semibold">{message.text}</span>
                </div>
            )}

            <div className={styles.grid}>
                {/* Left Column: Summary */}
                <div className={styles.summaryCard}>
                    <div className={styles.avatarWrapper}>
                        {initials}
                    </div>
                    {isEditing ? (
                        <div className="mb-4">
                            <label className={styles.infoLabel}>Display Name</label>
                            <input
                                type="text"
                                className={styles.input}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{ textAlign: 'center', marginTop: '0.5rem' }}
                            />
                        </div>
                    ) : (
                        <h2 className={styles.userName}>{userData.name}</h2>
                    )}
                    <span className={styles.userRoleLabel}>Citizen Portal User</span>

                    <div className={styles.memberSince}>
                        <Calendar size={14} />
                        <span>Registered {formatDate(userData.createdAt)}</span>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className={styles.detailsCol}>
                    {/* Basic Information */}
                    <div className={styles.detailCard}>
                        <div className={styles.cardHeader}>
                            <h3><User size={18} /> Basic Information</h3>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Full Name</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{userData.name}</span>
                                    )}
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Account Status</span>
                                    <div className="flex items-center">
                                        <span className={styles.infoValue}>Active</span>
                                        <span className={styles.verifiedBadge}>
                                            <ShieldCheck size={10} /> Verified
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Email Address</span>
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-slate-400" />
                                        <span className={styles.infoValue}>{userData.email}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Phone Number</span>
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-slate-400" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        ) : (
                                            <span className={styles.infoValue}>{userData.phone || 'Not provided'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address & Identity */}
                    <div className={styles.detailCard}>
                        <div className={styles.cardHeader}>
                            <h3><MapPin size={18} /> Residential & Identity</h3>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Full Address</span>
                                    {isEditing ? (
                                        <textarea
                                            className={styles.textarea}
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={3}
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>
                                            {userData.address || <span className={styles.infoValueEmpty}>No address recorded</span>}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Ward / PIN Code</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={formData.pinCode}
                                            onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{userData.pinCode || '642xxx'}</span>
                                    )}
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Aadhaar Number</span>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-slate-400" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={formData.aadhaar}
                                                onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                                                placeholder="XXXX XXXX XXXX"
                                            />
                                        ) : (
                                            <span className={cn(styles.infoValue, styles.aadhaarValue)}>
                                                {userData.aadhaar ? `XXXX-XXXX-${userData.aadhaar.slice(-4)}` : 'Not linked'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security & System */}
                    <div className={styles.detailCard}>
                        <div className={styles.cardHeader}>
                            <h3><Key size={18} /> System Security</h3>
                            <button
                                className={styles.editBtn}
                                onClick={() => setShowPasswordModal(true)}
                            >
                                Change Password
                            </button>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>User ID (System)</span>
                                    <span className={styles.infoValue} style={{ fontSize: '10px', opacity: 0.6 }}>{userData.uid}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Last Login Access</span>
                                    <span className={styles.infoValue}>{new Date().toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className={styles.modalOverlay} onClick={closePasswordModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className="flex items-center gap-3">
                                <div className={styles.modalIcon}>
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h3 className={styles.modalTitle}>Change Password</h3>
                                    <p className={styles.modalSubtitle}>Update your account password</p>
                                </div>
                            </div>
                            <button onClick={closePasswordModal} className={styles.modalClose}>
                                <X size={18} />
                            </button>
                        </div>

                        {passwordMessage && (
                            <div className={cn(
                                styles.modalAlert,
                                passwordMessage.type === 'success' ? styles.modalAlertSuccess : styles.modalAlertError
                            )}>
                                {passwordMessage.type === 'success' ? <Check size={16} /> : <X size={16} />}
                                <span>{passwordMessage.text}</span>
                            </div>
                        )}

                        <div className={styles.modalBody}>
                            <div className={styles.passwordField}>
                                <label className={styles.infoLabel}>Current Password</label>
                                <div className={styles.passwordInputWrapper}>
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        className={styles.input}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.passwordField}>
                                <label className={styles.infoLabel}>New Password</label>
                                <div className={styles.passwordInputWrapper}>
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        className={styles.input}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Enter new password (min 6 chars)"
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.passwordField}>
                                <label className={styles.infoLabel}>Confirm New Password</label>
                                <div className={styles.passwordInputWrapper}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className={styles.input}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Re-enter new password"
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                onClick={closePasswordModal}
                                className={cn(styles.actionBtn, styles.btnSecondary)}
                                disabled={isChangingPassword}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangePassword}
                                className="btn-premium flex items-center gap-2"
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? <LoadingSpinner size="sm" /> : <Key size={16} />}
                                {isChangingPassword ? 'Changing...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

