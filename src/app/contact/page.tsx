'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';
import styles from './ContactPage.module.css';

export default function ContactPage() {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <div className={styles.card}>
                    <h1 className={styles.title}>Contact Us</h1>

                    <div className={styles.grid}>
                        <div className={styles.infoItem}>
                            <MapPin className={styles.icon} />
                            <div>
                                <span className={styles.label}>Address</span>
                                <p className={styles.value}>
                                    Pollachi Municipal Corporation<br />
                                    Coimbatore Road, Pollachi - 642001<br />
                                    Tamil Nadu, India
                                </p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <Phone className={styles.icon} />
                            <div>
                                <span className={styles.label}>Phone</span>
                                <p className={styles.value}>+91 4259 220263</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <Mail className={styles.icon} />
                            <div>
                                <span className={styles.label}>Email</span>
                                <p className={styles.value}>commr.pollachi@tn.gov.in</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
