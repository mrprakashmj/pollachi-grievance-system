import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db/mongodb';
import { getComplaintModel } from '@/lib/db/models/Complaint';
import { DEPARTMENTS } from '@/constants/departments';

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token) as any;
        if (!decoded) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');

        let query: any = {};

        // If public user, only show their own complaints
        if (decoded.role === 'public') {
            query.userId = decoded.userId;
        }

        // Aggregate complaints from all departmental collections
        const departmentalPromises = DEPARTMENTS.map(async (dept) => {
            const Model = getComplaintModel(dept.id);
            return Model.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
        });

        const results = await Promise.all(departmentalPromises);

        // Merge and sort them
        const complaints = results.flat()
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);

        return NextResponse.json({ complaints });
    } catch (error: any) {
        console.error('Fetch complaints error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
