import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/mongodb';
import Admin from '@/lib/db/models/Admin';
import { signToken } from '@/lib/auth/jwt';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        await dbConnect();

        const user = await Admin.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 });
        }

        // Implicitly admin role, but keeping check for consistency
        if (user.role !== 'admin') {
            return NextResponse.json(
                { message: 'Access denied. This login is for administrators only.' },
                { status: 403 }
            );
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 });
        }

        const token = await signToken({ userId: user._id.toString(), email: user.email, role: user.role });

        const cookieStore = await cookies();
        cookieStore.delete('auth_token');
        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
            sameSite: 'lax',
        });

        return NextResponse.json({
            user: {
                uid: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        }, { status: 200 });

    } catch (error: any) {
        console.error('Admin login error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
