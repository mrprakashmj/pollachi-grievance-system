import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db/mongodb';
import { getComplaintModel } from '@/lib/db/models/Complaint';
import { DEPARTMENTS } from '@/constants/departments';
import { DEPARTMENT_CODES } from '@/constants/config';
import { DepartmentId } from '@/types/complaint';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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

        // 1. Try to determine department from ID prefix
        let departmentalComplaint = null;
        const parts = id.split('-');

        if (parts.length >= 2 && parts[0] === 'POL') {
            const deptCode = parts[1];
            const deptId = Object.keys(DEPARTMENT_CODES).find(
                key => DEPARTMENT_CODES[key] === deptCode
            ) as DepartmentId;

            if (deptId) {
                const Model = getComplaintModel(deptId);
                departmentalComplaint = await Model.findOne({ complaintId: id });
            }
        }

        // 2. If not found via prefix (or legacy ID), check all departmental collections
        if (!departmentalComplaint) {
            for (const dept of DEPARTMENTS) {
                const Model = getComplaintModel(dept.id);
                const found = await Model.findOne({
                    $or: [{ complaintId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : undefined }].filter(Boolean)
                });
                if (found) {
                    departmentalComplaint = found;
                    break;
                }
            }
        }

        if (!departmentalComplaint) {
            return NextResponse.json({ message: 'Complaint not found' }, { status: 404 });
        }

        const complaint = departmentalComplaint;

        // Access control:
        // User can see their own.
        // Admin/Staff can see any (logic simplified here).
        if (decoded.role === 'public' && complaint.userId !== decoded.userId) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ complaint });
    } catch (error: any) {
        console.error('Fetch complaint error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
