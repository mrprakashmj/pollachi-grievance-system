
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import { getComplaintModel } from '@/lib/db/models/Complaint';
import User from '@/lib/db/models/User';
import { DepartmentId } from '@/types/complaint';

export async function GET(req: Request) {
    try {
        // 1. Verify Staff Auth
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token) as any;
        if (!decoded || decoded.role !== 'department_staff') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await dbConnect();

        // Get user to find their department
        const user = await User.findById(decoded.userId);
        if (!user || !user.department) {
            return NextResponse.json({ message: 'User department not found' }, { status: 400 });
        }

        const department = user.department as DepartmentId;
        const DeptComplaint = getComplaintModel(department);

        // 2. Fetch Department Stats
        const totalAssigned = await DeptComplaint.countDocuments({ department });

        const pendingAction = await DeptComplaint.countDocuments({
            department,
            status: { $in: ['submitted', 'acknowledged', 'in_progress'] }
        });

        // Resolved in current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const resolvedMonth = await DeptComplaint.countDocuments({
            department,
            status: { $in: ['resolved', 'closed'] },
            updatedAt: { $gte: startOfMonth }
        });

        // SLA Breaches (Mock logic: complaints older than 7 days that are not resolved)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const slaBreaches = await DeptComplaint.countDocuments({
            department,
            status: { $in: ['submitted', 'acknowledged', 'in_progress'] },
            createdAt: { $lt: sevenDaysAgo }
        });

        // Fetch Urgent/Critical Complaints (High Priority)
        const urgentComplaints = await DeptComplaint.find({
            department,
            status: { $ne: 'closed' },
            urgency: { $in: ['high', 'emergency'] }
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('complaintId title userName status urgency createdAt');

        return NextResponse.json({
            stats: [
                { label: 'Total Assigned', value: totalAssigned, trend: 'up' },
                { label: 'Pending Action', value: pendingAction, trend: 'neutral' },
                { label: 'Resolved (Month)', value: resolvedMonth, trend: 'up' },
                { label: 'SLA Breaches', value: slaBreaches, trend: 'down' },
            ],
            urgentComplaints,
            departmentName: department
        });

    } catch (error) {
        console.error('Department Stats API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
