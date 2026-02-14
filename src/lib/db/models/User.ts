import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    phone: string;
    role: 'public' | 'admin' | 'department_staff' | 'department_head';
    department?: string; // Only for staff
    address?: string;
    pinCode?: string;
    aadhaar?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        phone: { type: String, required: true },
        role: {
            type: String,
            enum: ['public', 'admin', 'department_staff', 'department_head'],
            default: 'public',
        },
        department: { type: String },
        address: { type: String },
        pinCode: { type: String },
        aadhaar: { type: String },
    },
    { timestamps: true }
);

// Check if the model is already defined to prevent compilation errors in dev mode
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
