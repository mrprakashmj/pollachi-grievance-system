'use client';

import Sidebar from '@/components/shared/Sidebar';
import Header from '@/components/shared/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import styles from './AdminLayout.module.css';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className={styles.container}>
                <Sidebar />
                <div className={styles.mainContent}>
                    <Header />
                    <main className={styles.pagePadding}>{children}</main>
                </div>
            </div>
        </RoleGuard>
    );
}
