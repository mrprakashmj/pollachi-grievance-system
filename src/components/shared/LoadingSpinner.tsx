import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeMap = { sm: 24, md: 40, lg: 56 };
    const s = sizeMap[size];

    return (
        <div className={styles.container}>
            <div
                className={styles.spinner}
                style={{ width: s, height: s }}
            />
        </div>
    );
}
