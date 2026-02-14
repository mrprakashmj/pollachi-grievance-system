'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File as FileIcon, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import { APP_CONFIG } from '@/constants/config';
import { validateFile } from '@/lib/utils/file-validator';
import styles from './FileUpload.module.css';

interface FileUploadProps {
    files: File[];
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
}

export default function FileUpload({
    files,
    onFilesChange,
    maxFiles = APP_CONFIG.maxFiles,
}: FileUploadProps) {
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setError(null);

            if (files.length + acceptedFiles.length > maxFiles) {
                setError(`You can only upload up to ${maxFiles} files.`);
                return;
            }

            const validFiles: File[] = [];
            const errors: string[] = [];

            acceptedFiles.forEach((file) => {
                const validation = validateFile(file);
                if (validation.valid) {
                    validFiles.push(file);
                } else {
                    errors.push(validation.error || 'Invalid file');
                }
            });

            if (errors.length > 0) {
                setError(errors[0]);
            }

            if (validFiles.length > 0) {
                onFilesChange([...files, ...validFiles]);
            }
        },
        [files, onFilesChange, maxFiles]
    );

    const removeFile = (index: number) => {
        onFilesChange(files.filter((_, i) => i !== index));
        setError(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
            'video/*': ['.mp4', '.mov'],
        },
        maxFiles: maxFiles - files.length,
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`${styles.uploadArea} ${isDragActive ? styles.uploadAreaActive : ''}`}
            >
                <input {...getInputProps()} />
                <div className={styles.uploadIcon}>
                    <Upload size={24} />
                </div>
                <div className={styles.uploadText}>
                    <p className={styles.uploadTitle}>
                        {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
                    </p>
                    <p className={styles.uploadSubtitle}>
                        PNG, JPG, MP4 or MOV (max 10MB each)
                    </p>
                </div>
            </div>

            {error && (
                <div className={styles.errorBox}>
                    <AlertCircle size={14} />
                    {error}
                </div>
            )}

            {files.length > 0 && (
                <div className={styles.fileGrid}>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className={styles.fileItem}
                        >
                            <div className={styles.fileIcon}>
                                {file.type.startsWith('image/') ? (
                                    <ImageIcon size={20} />
                                ) : (
                                    <Video size={20} />
                                )}
                            </div>
                            <div className={styles.fileInfo}>
                                <p className={styles.fileName}>{file.name}</p>
                                <p className={styles.fileSize}>
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(index);
                                }}
                                className={styles.removeBtn}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
