'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';
import styles from './PrivacyPage.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <div className={styles.card}>
                    <div className={styles.header}>
                        <Shield className={styles.headerIcon} />
                        <h1 className={styles.title}>Privacy Policy</h1>
                    </div>

                    <div className={styles.content}>
                        <p className={styles.lastUpdated}>
                            Last updated: February 2026
                        </p>

                        <h2 className={styles.sectionTitle}>
                            <Lock size={20} /> Data Collection
                        </h2>
                        <p className={styles.text}>
                            We collect only necessary information to process your grievances effective, including name, contact details, and location data related to the complaint.
                        </p>

                        <h2 className={styles.sectionTitle}>
                            <Eye size={20} /> Data Usage
                        </h2>
                        <p className={styles.text}>
                            Your data is used solely for grievance redressal purposes. It is shared only with the relevant municipal departments and officials assigned to resolve your issue.
                        </p>

                        <h2 className={styles.sectionTitle}>Security</h2>
                        <p className={styles.text}>
                            All data is encrypted in transit and at rest. We adhere to Tamil Nadu Government cybersecurity standards (TNeGA) to protect citizen data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
