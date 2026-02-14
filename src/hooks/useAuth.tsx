'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';

interface AuthContextType {
    userData: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        name: string,
        phone: string,
        address: string,
        pinCode: string,
        aadhaar?: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        console.log('[useAuth] checkAuth started');
        const timeout = setTimeout(() => {
            console.warn('[useAuth] checkAuth hitting timeout (5s)');
            setLoading(false);
        }, 5000);

        try {
            const res = await fetch('/api/auth/me');
            console.log('[useAuth] Me API response status:', res.status);
            if (res.ok) {
                const data = await res.json();
                console.log('[useAuth] Me API data received:', !!data.user);
                setUserData(data.user);
            } else {
                console.log('[useAuth] Me API not ok');
                setUserData(null);
            }
        } catch (error) {
            console.error('[useAuth] Failed to check auth status', error);
            setUserData(null);
        } finally {
            clearTimeout(timeout);
            console.log('[useAuth] checkAuth finished');
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            let errorMessage = 'Login failed';
            try {
                const error = await res.json();
                errorMessage = error.message || errorMessage;
            } catch (e) {
                console.error('Failed to parse error response', e);
            }
            throw new Error(errorMessage);
        }

        const data = await res.json();
        setUserData(data.user);
    };

    const register = async (
        email: string,
        password: string,
        name: string,
        phone: string,
        address: string,
        pinCode: string,
        aadhaar?: string
    ) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                name,
                phone,
                address,
                pinCode,
                aadhaar,
            }),
        });

        if (!res.ok) {
            let errorMessage = 'Registration failed';
            try {
                const error = await res.json();
                errorMessage = error.message || errorMessage;
            } catch (e) {
                console.error('Failed to parse error response', e);
            }
            throw new Error(errorMessage);
        }

        const data = await res.json();
        setUserData(data.user);
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUserData(null);
        router.push('/login');
    };

    const forgotPassword = async (email: string) => {
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to send reset email');
            }
        } catch (error) {
            console.error('Forgot Password Error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userData,
                loading,
                login,
                register,
                logout,
                forgotPassword,
                refreshUser: checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
