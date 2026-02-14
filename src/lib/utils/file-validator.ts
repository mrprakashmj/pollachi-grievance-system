import { APP_CONFIG } from '@/constants/config';

export const validateFileType = (file: File): boolean => {
    return (APP_CONFIG.allowedFileTypes as readonly string[]).includes(file.type);
};

export const validateFileSize = (file: File): boolean => {
    return file.size <= APP_CONFIG.maxFileSize;
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!validateFileType(file)) {
        return {
            valid: false,
            error: `File type not allowed. Accepted: ${APP_CONFIG.allowedExtensions.join(', ')}`,
        };
    }
    if (!validateFileSize(file)) {
        return {
            valid: false,
            error: `File too large. Maximum size: ${APP_CONFIG.maxFileSize / (1024 * 1024)}MB`,
        };
    }
    return { valid: true };
};

export const validateFiles = (files: File[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    if (files.length > APP_CONFIG.maxFiles) {
        errors.push(`Maximum ${APP_CONFIG.maxFiles} files allowed`);
    }
    files.forEach((file, index) => {
        const result = validateFile(file);
        if (!result.valid) {
            errors.push(`File ${index + 1} (${file.name}): ${result.error}`);
        }
    });
    return { valid: errors.length === 0, errors };
};
