import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import mongoose from 'mongoose';

// Helper to create a response that clears the bad auth cookie
function clearAuthCookieResponse() {
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0, // expire immediately
    });
    return response;
}

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const decoded = await verifyToken(token) as any;
        if (!decoded || !decoded.userId) {
            console.log('[Me API] Invalid/expired token, clearing cookie');
            return clearAuthCookieResponse();
        }

        // Ensure userId is always a plain string
        const userId = typeof decoded.userId === 'string'
            ? decoded.userId
            : String(decoded.userId);

        // Validate that userId is a proper MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log(`[Me API] Invalid userId format: "${userId}", clearing cookie`);
            return clearAuthCookieResponse();
        }

        await dbConnect();

        let user;
        if (decoded.role === 'admin') {
            // Import Admin model dynamically or ensure it's imported efficiently
            const Admin = (await import('@/lib/db/models/Admin')).default;
            user = await Admin.findById(userId).select('-passwordHash');

            // Fallback: Check User collection if not found in Admin collection
            if (!user) {
                user = await User.findById(userId).select('-passwordHash');
            }
        } else {
            user = await User.findById(userId).select('-passwordHash');
        }

        if (!user) {
            console.log('[Me API] User not found in DB, clearing cookie');
            return clearAuthCookieResponse();
        }

        return NextResponse.json({
            user: {
                uid: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                // Only include extra fields if they exist (User model)
                phone: (user as any).phone,
                address: (user as any).address,
                pinCode: (user as any).pinCode,
                aadhaar: (user as any).aadhaar,
            },
        });
    } catch (error) {
        console.error('Me API error:', error);
        // On any error (e.g., CastError), clear the bad cookie
        return clearAuthCookieResponse();
    }
}

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token) as any;
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, address, pinCode, aadhaar } = body;

        await dbConnect();
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (pinCode) user.pinCode = pinCode;
        if (aadhaar) user.aadhaar = aadhaar;

        await user.save();

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                uid: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                address: user.address,
                pinCode: user.pinCode,
                aadhaar: user.aadhaar,
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
