'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ComplaintForm from '@/components/complaints/ComplaintForm';
import { ComplaintFormData } from '@/lib/validations/complaint-schema';
import { CheckCircle2 } from 'lucide-react';
import styles from './NewComplaint.module.css';

export default function NewComplaintPage() {
    const { userData } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: ComplaintFormData, files: File[]) => {
        if (!userData) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Append all form data
            Object.entries(data).forEach(([key, value]) => formData.append(key, value));

            // Append User Info
            formData.append('userId', userData.uid);
            formData.append('userName', userData.name);
            formData.append('userEmail', userData.email);
            formData.append('userPhone', userData.phone || '');
            formData.append('userAddress', userData.address || '');

            // Append Files directly
            files.forEach((file) => {
                formData.append('attachments', file);
            });

            const response = await fetch('/api/complaints/create', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create complaint');
            }

        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit complaint. Please try again.');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>File a New Grievance</h1>
                <p className={styles.subtitle}>
                    Submit your concern to the Pollachi Municipal Corporation. Our automated system will route it to the relevant department for swift resolution.
                </p>
            </div>

            <div className={styles.formCard}>
                <div className={styles.formHeader}>
                    <div className={styles.iconWrapper}>
                        <CheckCircle2 size={28} />
                    </div>
                    <div className={styles.headerContent}>
                        <h2>Public Redressal Form</h2>
                        <p>Pollachi Municipal Corporation</p>
                    </div>
                </div>

                <div className={styles.formBody}>
                    <ComplaintForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
    );
}
