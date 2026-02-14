import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { signToken } from '@/lib/auth/jwt';
// import { serialize } from 'cookie';

export async function POST(req: Request) {
    try {
        const { name, email, password, phone, address, pinCode, aadhaar } = await req.json();

        await dbConnect();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            passwordHash,
            phone,
            address,
            pinCode,
            aadhaar,
            role: 'public', // Default role
        });

        // Create JWT
        // Create JWT
        const token = await signToken({ userId: user._id.toString(), email: user.email, role: user.role });

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            sameSite: 'lax',
        });

        return NextResponse.json(
            {
                user: {
                    uid: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
