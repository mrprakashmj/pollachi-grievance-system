import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    address: z.string().min(10, 'Please provide complete address'),
    pinCode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
    aadhaar: z.string().regex(/^\d{12}$/, 'Enter a valid 12-digit Aadhaar number').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
