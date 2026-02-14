import styles from './layout.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.container}>
            {/* Background decoration */}
            <div className={styles.bgDecoration} />

            {/* Top Pattern */}
            <div className={styles.topPattern} />

            <div className={styles.content}>{children}</div>
        </div>
    );
}
