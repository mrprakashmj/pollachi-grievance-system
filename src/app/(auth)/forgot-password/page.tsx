'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await forgotPassword(email);
            setSent(true);
        } catch {
            setError('Failed to send reset email. Please check your email address.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto fade-in">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl bg-tn-navy shadow-lg">
                    <img src="/tn-emblem.png" alt="TN Govt" className="w-10 h-10 object-contain brightness-0 invert" />
                </div>
                <h1 className="text-2xl font-bold text-tn-navy">Reset Password</h1>
                <p className="text-sm mt-1 text-muted-foreground">
                    We&apos;ll send you a reset link
                </p>
            </div>

            <div className="rounded-2xl p-8 bg-white border border-border shadow-govt">
                {sent ? (
                    <div className="text-center py-4">
                        <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
                        <h2 className="text-lg font-semibold text-tn-navy mb-2">Email Sent!</h2>
                        <p className="text-sm mb-6 text-muted-foreground">
                            Check your inbox for a password reset link.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-tn-navy hover:underline"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-xl mb-6 text-sm bg-destructive/10 text-destructive">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-tn-navy/20 focus:border-tn-navy transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 bg-tn-navy hover:bg-tn-navy/90 shadow-md hover:shadow-lg"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-tn-navy hover:underline">
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
