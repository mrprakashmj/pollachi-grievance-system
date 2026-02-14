'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { UserRole } from '@/types/user';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { userData, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!userData) {
                router.push('/login');
                return;
            }
            // @ts-ignore - Create a proper type definition later
            if (userData && !allowedRoles.includes(userData.role)) {
                // Redirect to appropriate dashboard
                switch (userData.role) {
                    case 'admin':
                        router.push('/admin/dashboard');
                        break;
                    case 'department_staff': // Changed from 'department_head' to match model
                        router.push('/department/dashboard');
                        break;
                    default:
                        router.push('/dashboard');
                }
            }
        }
    }, [loading, userData, allowedRoles, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // @ts-ignore
    if (!userData || !allowedRoles.includes(userData.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return <>{children}</>;
}
