import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { signToken } from '@/lib/auth/jwt';
// import { serialize } from 'cookie'; // Unused now

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        await dbConnect();

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check password
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create JWT
        const token = await signToken({ userId: user._id.toString(), email: user.email, role: user.role });

        // Set cookie using next/headers
        const cookieStore = await cookies();

        // Clear any existing cookie first
        cookieStore.delete('auth_token');

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
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
