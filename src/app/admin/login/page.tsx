'use client';

import { useState } from 'react';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Login failed');
                return;
            }

            // Force full page reload to pick up the cookie
            window.location.href = '/admin/dashboard';
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            padding: '2rem',
        }}>
            {/* Background pattern */}
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
                pointerEvents: 'none',
            }} />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 1,
                animation: 'adminFadeIn 0.5s ease-out',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '4.5rem',
                        height: '4.5rem',
                        borderRadius: '1rem',
                        background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                        boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
                    }}>
                        <ShieldCheck size={28} color="white" />
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: 'white',
                        letterSpacing: '-0.025em',
                        marginBottom: '0.5rem',
                    }}>
                        Admin Portal
                    </h1>
                    <p style={{
                        fontSize: '0.8125rem',
                        color: '#94a3b8',
                        fontWeight: 500,
                    }}>
                        Pollachi Municipal Corporation — Authorized Personnel Only
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}>
                    {/* Error */}
                    {error && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#fca5a5',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Email */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: '#94a3b8',
                                marginBottom: '0.5rem',
                            }}>
                                Admin Email
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#64748b',
                                    pointerEvents: 'none',
                                }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@pollachi.gov.in"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        border: '1px solid rgba(148, 163, 184, 0.2)',
                                        color: 'white',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: '#94a3b8',
                                marginBottom: '0.5rem',
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{
                                    position: 'absolute',
                                    left: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#64748b',
                                    pointerEvents: 'none',
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                        background: 'rgba(15, 23, 42, 0.6)',
                                        border: '1px solid rgba(148, 163, 184, 0.2)',
                                        color: 'white',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: 'white',
                                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)',
                                marginTop: '0.5rem',
                            }}
                        >
                            {loading ? (
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Sign In as Administrator
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(59, 130, 246, 0.08)',
                        border: '1px solid rgba(59, 130, 246, 0.15)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                    }}>
                        <ShieldCheck size={14} style={{ color: '#60a5fa', marginTop: '0.125rem', flexShrink: 0 }} />
                        <p style={{
                            fontSize: '0.6875rem',
                            color: '#94a3b8',
                            lineHeight: 1.5,
                            margin: 0,
                        }}>
                            This is a restricted area for authorized administrators.
                            All login attempts are monitored and logged.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    fontSize: '0.6875rem',
                    color: '#475569',
                }}>
                    © {new Date().getFullYear()} Pollachi Municipal Corporation. All rights reserved.
                </p>
            </div>

            <style>{`
                @keyframes adminFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
