import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(encodedSecret);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, encodedSecret);
        return payload;
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return null;
    }
}
