'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { complaintSchema, ComplaintFormData } from '@/lib/validations/complaint-schema';
import { DEPARTMENTS } from '@/constants/departments';
import FileUpload from './FileUpload';
import {
    MapPin,
    AlertTriangle,
    ChevronRight,
    ChevronLeft,
    Info,
    CheckCircle2,
    FileText,
    Building,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import styles from './ComplaintForm.module.css';

interface ComplaintFormProps {
    onSubmit: (data: ComplaintFormData, files: File[]) => Promise<void>;
    isSubmitting?: boolean;
}

const steps = [
    { id: 'category', title: 'Category', icon: Building },
    { id: 'details', title: 'Details', icon: FileText },
    { id: 'location', title: 'Location', icon: MapPin },
    { id: 'attachments', title: 'Media', icon: AlertTriangle },
];

export default function ComplaintForm({ onSubmit, isSubmitting }: ComplaintFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [files, setFiles] = useState<File[]>([]);
    const [success, setSuccess] = useState(false);
    const [isOkToSubmit, setIsOkToSubmit] = useState(false);

    // Submission guard: prevent accidental double-clicks from step 2 to 3
    useEffect(() => {
        if (currentStep === steps.length - 1) {
            const timer = setTimeout(() => setIsOkToSubmit(true), 400);
            return () => clearTimeout(timer);
        } else {
            setIsOkToSubmit(false);
        }
    }, [currentStep]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<ComplaintFormData>({
        resolver: zodResolver(complaintSchema),
        defaultValues: {
            urgency: 'medium',
        },
    });

    const selectedDeptId = watch('department');
    const selectedDept = useMemo(() =>
        DEPARTMENTS.find((d) => d.id === selectedDeptId),
        [selectedDeptId]
    );

    const nextStep = async () => {
        let fieldsToValidate: (keyof ComplaintFormData)[] = [];
        if (currentStep === 0) fieldsToValidate = ['department', 'subCategory'];
        if (currentStep === 1) fieldsToValidate = ['title', 'description', 'urgency'];
        if (currentStep === 2) fieldsToValidate = ['location', 'pinCode'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleFormSubmit = async (data: ComplaintFormData) => {
        // Safety check: Only submit if we are on the final step AND the guard delay has passed
        if (currentStep !== steps.length - 1 || !isOkToSubmit) return;

        try {
            await onSubmit(data, files);
            setSuccess(true);
        } catch (error) {
            console.error('Submission failed:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Prevent form submission On Enter key
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    if (success) {
        return (
            <div className={`glass-card fade-in ${styles.successCard}`}>
                <div className={styles.successIcon}>
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Complaint Submitted!</h2>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    Your grievance has been successfully recorded. You will receive updates via email and can track progress from your dashboard.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="btn-premium"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Progress Steps */}
            <div className={styles.progressSteps}>
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = currentStep === idx;
                    const isCompleted = currentStep > idx;

                    return (
                        <div key={step.id} className={styles.stepItem}>
                            <div
                                className={cn(
                                    styles.stepIcon,
                                    isActive && styles.stepIconActive,
                                    isCompleted && styles.stepIconCompleted
                                )}
                            >
                                {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                            </div>
                            <span className={cn(
                                styles.stepTitle,
                                isActive ? styles.stepTitleActive : ''
                            )}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                onKeyDown={handleKeyDown}
                className={styles.form}
            >
                {/* Step 0: Department & Subcategory */}
                {currentStep === 0 && (
                    <div className="space-y-6 slide-up">
                        <section className={styles.section}>
                            <label className={styles.label}>
                                Which department does your issue belong to?
                            </label>
                            <div className={styles.grid2}>
                                {DEPARTMENTS.map((dept) => (
                                    <label
                                        key={dept.id}
                                        className={cn(
                                            styles.deptCard,
                                            selectedDeptId === dept.id ? styles.deptCardSelected : ''
                                        )}
                                    >
                                        <input
                                            {...register('department')}
                                            type="radio"
                                            value={dept.id}
                                            className="hidden"
                                            onChange={(e) => {
                                                setValue('department', e.target.value as any);
                                                setValue('subCategory', '');
                                            }}
                                        />
                                        <div
                                            className={styles.deptIcon}
                                            style={{ background: dept.color }}
                                        >
                                            <Building size={20} />
                                        </div>
                                        <div>
                                            <p className={styles.deptName}>{dept.label}</p>
                                            <p className={styles.deptDesc}>Service assistance</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.department && <p className={styles.errorMessage}>{errors.department.message}</p>}
                        </section>

                        {selectedDept && (
                            <section className={`fade-in ${styles.section}`}>
                                <label className={styles.label}>Select Issue Category</label>
                                <select
                                    {...register('subCategory')}
                                    className={styles.select}
                                >
                                    <option value="">Choose a category...</option>
                                    {selectedDept.subCategories.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.label}</option>
                                    ))}
                                </select>
                                {errors.subCategory && <p className={styles.errorMessage}>{errors.subCategory.message}</p>}
                            </section>
                        )}
                    </div>
                )}

                {/* Step 1: Issue Details */}
                {currentStep === 1 && (
                    <div className="space-y-6 slide-up">
                        <section className={styles.section}>
                            <div>
                                <label className={styles.label}>Issue Title</label>
                                <input
                                    {...register('title')}
                                    placeholder="e.g. Broken water pipe in front of house"
                                    className={styles.input}
                                />
                                {errors.title && <p className={styles.errorMessage}>{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className={styles.label}>Detailed Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={5}
                                    placeholder="Please describe the issue in detail. What happened? For how long?"
                                    className={styles.textarea}
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.description ? (
                                        <p className={styles.errorMessage}>{errors.description.message}</p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground font-medium">Min. 50 characters</p>
                                    )}
                                    <p className="text-xs text-muted-foreground font-medium">{watch('description')?.length || 0}/2000</p>
                                </div>
                            </div>

                            <div>
                                <label className={styles.label}>Urgency Level</label>
                                <div className={styles.urgencyGrid}>
                                    {(['low', 'medium', 'high', 'emergency'] as const).map((level) => (
                                        <label
                                            key={level}
                                            className={cn(
                                                styles.urgencyLabel,
                                                watch('urgency') === level ? styles.urgencyLabelSelected : ''
                                            )}
                                        >
                                            <input {...register('urgency')} type="radio" value={level} className="hidden" />
                                            {level}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* Step 2: Location Information */}
                {currentStep === 2 && (
                    <div className="space-y-6 slide-up">
                        <div className={styles.infoBox}>
                            <div className={styles.infoIcon}>
                                <Info size={16} />
                            </div>
                            <p className={styles.infoText}>
                                Provide accurate location details to help our field officers reach the spot quickly. Mention nearby landmarks or house numbers.
                            </p>
                        </div>

                        <section className={styles.section}>
                            <div>
                                <label className={styles.label}>Exact Location / Landmark</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
                                    <textarea
                                        {...register('location')}
                                        rows={3}
                                        placeholder="Enter full address or landmark..."
                                        className={`${styles.textarea} pl-10`}
                                    />
                                </div>
                                {errors.location && <p className={styles.errorMessage}>{errors.location.message}</p>}
                            </div>

                            <div>
                                <label className={styles.label}>Area PIN Code</label>
                                <input
                                    {...register('pinCode')}
                                    placeholder="6-digit PIN code"
                                    className={styles.input}
                                    maxLength={6}
                                />
                                {errors.pinCode && <p className={styles.errorMessage}>{errors.pinCode.message}</p>}
                            </div>
                        </section>
                    </div>
                )}

                {/* Step 3: Attachments */}
                {currentStep === 3 && (
                    <div className="space-y-6 slide-up">
                        <section className={styles.section}>
                            <div>
                                <label className={styles.label}>Supporting Photos or Videos</label>
                                <FileUpload files={files} onFilesChange={setFiles} />
                            </div>

                            <div className={styles.warningBox}>
                                <div className={styles.warningIcon}>
                                    <AlertTriangle size={16} />
                                </div>
                                <div className={styles.warningText}>
                                    <p className="font-bold mb-1">Before you submit:</p>
                                    <ul className="list-disc ml-4 space-y-1">
                                        <li>Photos of the issue significantly speed up resolution.</li>
                                        <li>Ensure all details provided are accurate.</li>
                                        <li>Invalid complaints may be rejected by the department.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className={styles.navButtons}>
                    {currentStep > 0 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className={styles.backBtn}
                        >
                            <ChevronLeft size={16} />
                            Back
                        </button>
                    )}

                    {currentStep < steps.length - 1 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className={`btn-premium flex-1 ${styles.continueBtn}`}
                        >
                            Continue
                            <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`btn-premium flex-1 ${styles.continueBtn}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Complaint
                                    <CheckCircle2 size={16} />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
