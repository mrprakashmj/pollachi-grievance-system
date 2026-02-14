
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // MOCK: Log the request instead of sending a real email
        console.log('------------------------------------------------');
        console.log(`[MOCK EMAIL SERVICE] Password reset requested for: ${email}`);
        console.log(`[MOCK EMAIL SERVICE] Reset Link: http://localhost:3000/reset-password?token=mock_token_12345`);
        console.log('------------------------------------------------');

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return NextResponse.json(
            { message: 'If an account exists with this email, a password reset link has been sent.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot Password Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
