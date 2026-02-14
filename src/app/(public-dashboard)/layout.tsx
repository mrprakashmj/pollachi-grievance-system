'use client';

import Sidebar from '@/components/shared/Sidebar';
import Header from '@/components/shared/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import styles from './DashboardLayout.module.css';

export default function PublicDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['public']}>
            <div className={styles.container}>
                <Sidebar />
                <div className={styles.contentWrapper}>
                    <Header />
                    <main className={styles.mainContent}>{children}</main>
                </div>
            </div>
        </RoleGuard>
    );
}
