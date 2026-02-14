import mongoose, { Schema, Document, Model } from 'mongoose';
import { getCollectionName } from '@/constants/departments';
import { DepartmentId } from '@/types/complaint';

export interface IComplaint extends Document {
    complaintId: string;
    userId: string;
    userName: string;
    title: string;
    description: string;
    category: string;
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    status:
    | 'submitted'
    | 'acknowledged'
    | 'in_progress'
    | 'resolved'
    | 'rejected'
    | 'closed';
    location: string;
    images: string[];
    department?: string;
    assignedTo?: string; // Staff ID
    timeline: Array<{
        status: string;
        timestamp: Date;
        note?: string;
        updatedBy?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const ComplaintSchema: Schema<IComplaint> = new Schema(
    {
        complaintId: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        urgency: {
            type: String,
            enum: ['low', 'medium', 'high', 'emergency'],
            default: 'low',
        },
        status: {
            type: String,
            enum: [
                'submitted',
                'acknowledged',
                'in_progress',
                'resolved',
                'rejected',
                'closed',
            ],
            default: 'submitted',
        },
        location: { type: String, required: true },
        images: { type: [String], default: [] },
        department: { type: String },
        assignedTo: { type: String },
        timeline: [
            {
                status: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
                note: { type: String },
                updatedBy: { type: String },
            },
        ],
    },
    { timestamps: true }
);

// Function to get or create a model for a specific department's collection
export const getComplaintModel = (departmentId: DepartmentId): Model<IComplaint> => {
    const collectionName = getCollectionName(departmentId);

    // Check if the model already exists in Mongoose to avoid OverwriteModelError
    const modelName = `Complaint_${departmentId}`;
    if (mongoose.models[modelName]) {
        return mongoose.models[modelName] as Model<IComplaint>;
    }

    return mongoose.model<IComplaint>(modelName, ComplaintSchema, collectionName);
};

// Default export for backward compatibility (pointing to water_supply or a generic collection)
const Complaint: Model<IComplaint> = mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema, 'complaints');

export default Complaint;
