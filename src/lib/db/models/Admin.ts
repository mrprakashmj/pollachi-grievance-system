
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema: Schema<IAdmin> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            enum: ['admin'],
            default: 'admin',
        },
    },
    { timestamps: true }
);

// Check if the model is already defined
const Admin: Model<IAdmin> =
    mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
