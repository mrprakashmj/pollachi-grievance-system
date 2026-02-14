'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations/auth-schema';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import styles from '../Auth.module.css';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError('');
        try {
            await login(data.email, data.password);
            // Use window.location to force a full page reload and ensure cookies are recognized by middleware
            window.location.href = '/dashboard';
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            console.error('Login error:', errorMessage);

            if (errorMessage.includes('user-not-found') || errorMessage.toLowerCase().includes('invalid email')) {
                setError('Invalid email or password');
            } else if (errorMessage.includes('wrong-password') || errorMessage.includes('invalid-credential') || errorMessage.toLowerCase().includes('password')) {
                setError('Invalid email or password');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Logo */}
            <div className={styles.logoSection}>
                <div className={styles.logoWrapper}>
                    <img src="/tn-emblem.png" alt="TN Govt" className={styles.logoImg} />
                </div>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>
                    Sign in to Pollachi Municipal Grievance System
                </p>
            </div>

            {/* Form */}
            <div className={styles.card}>
                {error && (
                    <div className={styles.errorAlert}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* Email */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Email Address
                        </label>
                        <div className={styles.inputWrapper}>
                            <Mail
                                size={18}
                                className={styles.inputIcon}
                            />
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="Enter your email"
                                className={styles.input}
                            />
                        </div>
                        {errors.email && (
                            <p className={styles.inputError}>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Password
                        </label>
                        <div className={styles.inputWrapper}>
                            <Lock
                                size={18}
                                className={styles.inputIcon}
                            />
                            <input
                                {...register('password')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className={styles.input}
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.passwordToggle}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className={styles.inputError}>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Forgot password link */}
                    <div className={styles.forgotPasswordLink}>
                        <Link
                            href="/forgot-password"
                            className={styles.link}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? (
                            <div className={styles.spinner} />
                        ) : (
                            <>
                                <LogIn size={18} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                {/* Register link */}
                <p className={styles.footer}>
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className={styles.footerLink}>
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}
