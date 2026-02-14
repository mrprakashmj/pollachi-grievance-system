
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import Notification from '@/lib/db/models/Notification';

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
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

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: decoded.userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, notification }, { status: 200 });

    } catch (error) {
        console.error('Mark Read Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
