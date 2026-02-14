'use client';

import Sidebar from '@/components/shared/Sidebar';
import Header from '@/components/shared/Header';
import RoleGuard from '@/components/auth/RoleGuard';

export default function DepartmentDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['department_head']}>
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 lg:ml-[280px]">
                    <Header />
                    <main className="p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </RoleGuard>
    );
}
