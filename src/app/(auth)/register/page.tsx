'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth-schema';
import {
    UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, User, Phone, MapPin, Hash, CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import styles from '../Auth.module.css';

export default function RegisterPage() {
    const { register: registerUser } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const handleNext = async () => {
        const valid = await trigger(['name', 'email', 'phone']);
        if (valid) setStep(2);
    };

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError('');
        try {
            await registerUser(data.email, data.password, data.name, data.phone, data.address, data.pinCode, data.aadhaar);
            // Use window.location to force a full page reload and ensure cookies are recognized by middleware
            window.location.href = '/dashboard';
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            if (errorMessage.includes('email-already-in-use')) {
                setError('An account with this email already exists');
            } else {
                setError('Registration failed. Please try again.');
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
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>
                    Register as a citizen of Pollachi
                </p>
            </div>

            {/* Progress steps */}
            <div className={styles.stepsContainer}>
                {[1, 2].map((s) => (
                    <div key={s} className={styles.stepWrapper}>
                        <div
                            className={cn(styles.stepCircle, step >= s ? styles.stepActive : styles.stepInactive)}
                        >
                            {step > s ? <CheckCircle size={16} /> : s}
                        </div>
                        {s < 2 && (
                            <div
                                className={cn(styles.stepLine, step > 1 ? styles.lineActive : styles.lineInactive)}
                            />
                        )}
                    </div>
                ))}
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
                    {step === 1 && (
                        <>
                            {/* Name */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Full Name</label>
                                <div className={styles.inputWrapper}>
                                    <User size={18} className={styles.inputIcon} />
                                    <input {...register('name')} placeholder="Enter your full name" className={styles.input} />
                                </div>
                                {errors.name && <p className={styles.inputError}>{errors.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <Mail size={18} className={styles.inputIcon} />
                                    <input {...register('email')} type="email" placeholder="Enter your email" className={styles.input} />
                                </div>
                                {errors.email && <p className={styles.inputError}>{errors.email.message}</p>}
                            </div>

                            {/* Phone */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Mobile Number</label>
                                <div className={styles.inputWrapper}>
                                    <Phone size={18} className={styles.inputIcon} />
                                    <input {...register('phone')} placeholder="10-digit mobile number" className={styles.input} />
                                </div>
                                {errors.phone && <p className={styles.inputError}>{errors.phone.message}</p>}
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                className={styles.submitBtn}
                            >
                                Continue
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {/* Password */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Password</label>
                                <div className={styles.inputWrapper}>
                                    <Lock size={18} className={styles.inputIcon} />
                                    <input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min 6 characters"
                                        className={styles.input}
                                        style={{ paddingRight: '3rem' }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.passwordToggle}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className={styles.inputError}>{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Confirm Password</label>
                                <div className={styles.inputWrapper}>
                                    <Lock size={18} className={styles.inputIcon} />
                                    <input {...register('confirmPassword')} type="password" placeholder="Re-enter password" className={styles.input} />
                                </div>
                                {errors.confirmPassword && <p className={styles.inputError}>{errors.confirmPassword.message}</p>}
                            </div>

                            {/* Address */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Address</label>
                                <div className={styles.inputWrapper}>
                                    <MapPin size={18} className={styles.inputIcon} style={{ top: '1rem', transform: 'none' }} />
                                    <textarea {...register('address')} placeholder="Full address" rows={2} className={cn(styles.input, styles.textArea)} />
                                </div>
                                {errors.address && <p className={styles.inputError}>{errors.address.message}</p>}
                            </div>

                            {/* PIN Code */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>PIN Code</label>
                                <div className={styles.inputWrapper}>
                                    <Hash size={18} className={styles.inputIcon} />
                                    <input {...register('pinCode')} placeholder="6-digit PIN code" className={styles.input} />
                                </div>
                                {errors.pinCode && <p className={styles.inputError}>{errors.pinCode.message}</p>}
                            </div>

                            {/* Aadhaar (optional) */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Aadhaar Number <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                                </label>
                                <input {...register('aadhaar')} placeholder="12-digit Aadhaar number" className={styles.input} style={{ paddingLeft: '1rem' }} />
                                {errors.aadhaar && <p className={styles.inputError}>{errors.aadhaar.message}</p>}
                            </div>

                            <div className={styles.buttonGroup}>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className={styles.backBtn}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={cn(styles.submitBtn, styles.flexOne)}
                                >
                                    {loading ? (
                                        <div className={styles.spinner} />
                                    ) : (
                                        <>
                                            <UserPlus size={18} />
                                            Register
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>

                <p className={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.footerLink}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
