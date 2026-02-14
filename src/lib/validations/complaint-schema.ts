import { z } from 'zod';

export const complaintSchema = z.object({
    department: z.enum(['water_supply', 'electricity', 'sanitation', 'roads', 'health', 'education'] as const, {
        message: 'Please select a department',
    }),
    subCategory: z.string().min(1, 'Please select a sub-category'),
    title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long'),
    description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description too long'),
    location: z.string().min(5, 'Please provide a specific location'),
    pinCode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
    urgency: z.enum(['low', 'medium', 'high', 'emergency'] as const, {
        message: 'Please select urgency level',
    }),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
