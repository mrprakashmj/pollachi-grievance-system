
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
    userId: string;
    type: 'status_change' | 'status_update' | 'complaint_rejected' | 'assignment' | 'system' | 'alert' | 'general';
    title: string;
    message: string;
    complaintId?: string;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
    {
        userId: { type: String, required: true },
        type: {
            type: String,
            enum: ['status_change', 'status_update', 'complaint_rejected', 'assignment', 'system', 'alert', 'general'],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        complaintId: { type: String },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

// Delete cached model in dev to pick up schema changes, then re-register
if (mongoose.models.Notification) {
    delete mongoose.models.Notification;
}
const Notification: Model<INotification> = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
