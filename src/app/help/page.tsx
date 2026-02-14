'use client';

import Link from 'next/link';
import { ArrowLeft, Book, MessageCircle, Phone } from 'lucide-react';
import styles from './HelpPage.module.css';

export default function HelpPage() {
    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <h1 className={styles.title}>Help Center</h1>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <Book className={`${styles.cardIcon} ${styles.cardIconBlue}`} />
                        <h2 className={styles.cardTitle}>User Guide</h2>
                        <p className={styles.cardText}>Learn how to register complaints, track status, and manage your profile.</p>
                        <ul className={styles.list}>
                            <li>• How to create a new complaint</li>
                            <li>• Tracking your grievance status</li>
                            <li>• Understanding SLA timelines</li>
                        </ul>
                    </div>

                    <div className={styles.card}>
                        <MessageCircle className={`${styles.cardIcon} ${styles.cardIconGreen}`} />
                        <h2 className={styles.cardTitle}>FAQ</h2>
                        <p className={styles.cardText}>Common questions about the Pollachi Grievance System.</p>
                        <ul className={styles.list}>
                            <li>• What happens after I submit?</li>
                            <li>• Can I submit anonymously?</li>
                            <li>• How to contact department heads?</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.contactSection}>
                    <h3 className={styles.contactTitle}>Need direct assistance?</h3>
                    <p className={styles.contactText}>Our support team is available Mon-Fri, 9AM - 5PM.</p>
                    <a href="mailto:support@pollachi.tn.gov.in" className={styles.contactLink}>
                        <Phone size={16} className="mr-2" /> Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
