import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token) as any;
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { message: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: 'New password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        if (currentPassword === newPassword) {
            return NextResponse.json(
                { message: 'New password must be different from current password' },
                { status: 400 }
            );
        }

        await dbConnect();

        const userId = typeof decoded.userId === 'string'
            ? decoded.userId
            : String(decoded.userId);

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Verify current password
        const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentValid) {
            return NextResponse.json(
                { message: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Hash and save new password
        const newHash = await bcrypt.hash(newPassword, 10);
        user.passwordHash = newHash;
        await user.save();

        return NextResponse.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change Password Error:', error);
        return NextResponse.json(
            { message: 'Failed to change password' },
            { status: 500 }
        );
    }
}
