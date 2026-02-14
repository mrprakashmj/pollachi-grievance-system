
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import Notification from '@/lib/db/models/Notification';

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token) as any;
        if (!decoded) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        await dbConnect();

        // Fetch unread notifications, sorted by newest first
        const rawNotifications = await Notification.find({
            userId: decoded.userId,
            isRead: false
        }).sort({ createdAt: -1 }).limit(20).lean();

        // Map _id to id for frontend compatibility
        const notifications = rawNotifications.map((n: any) => ({
            id: n._id.toString(),
            type: n.type,
            title: n.title,
            message: n.message,
            complaintId: n.complaintId,
            isRead: n.isRead,
            createdAt: n.createdAt,
        }));

        return NextResponse.json({ notifications }, { status: 200 });

    } catch (error) {
        console.error('Fetch Notifications Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// Internal API to create notifications (can be called by other API routes)
export async function POST(req: Request) {
    try {
        const { userId, type, title, message, complaintId } = await req.json();

        if (!userId || !type || !title || !message) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const notification = await Notification.create({
            userId,
            type,
            title,
            message,
            complaintId,
        });

        return NextResponse.json({ notification }, { status: 201 });

    } catch (error) {
        console.error('Create Notification Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
