
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import { getComplaintModel } from '@/lib/db/models/Complaint';
import User from '@/lib/db/models/User';
import { DEPARTMENTS } from '@/constants/departments';

export async function GET(req: Request) {
    try {
        // 1. Verify Admin Auth
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token) as any;
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await dbConnect();

        // 2. Aggregate stats across all department collections
        let totalComplaints = 0;
        let resolvedComplaints = 0;
        let rejectedComplaints = 0;
        let statusBreakdown: Record<string, number> = {
            submitted: 0,
            acknowledged: 0,
            in_progress: 0,
            resolved: 0,
            rejected: 0,
            closed: 0,
        };
        let urgencyBreakdown: Record<string, number> = {
            low: 0,
            medium: 0,
            high: 0,
            emergency: 0,
        };

        // Department-level stats
        const departmentStats = [];
        const allRecentComplaints: any[] = [];

        for (const dept of DEPARTMENTS) {
            const Model = getComplaintModel(dept.id);

            const [total, submitted, acknowledged, inProgress, resolved, rejected, closed] = await Promise.all([
                Model.countDocuments(),
                Model.countDocuments({ status: 'submitted' }),
                Model.countDocuments({ status: 'acknowledged' }),
                Model.countDocuments({ status: 'in_progress' }),
                Model.countDocuments({ status: 'resolved' }),
                Model.countDocuments({ status: 'rejected' }),
                Model.countDocuments({ status: 'closed' }),
            ]);

            const [lowCount, mediumCount, highCount, emergencyCount] = await Promise.all([
                Model.countDocuments({ urgency: 'low' }),
                Model.countDocuments({ urgency: 'medium' }),
                Model.countDocuments({ urgency: 'high' }),
                Model.countDocuments({ urgency: 'emergency' }),
            ]);

            // Get recent complaints from this department
            const recent = await Model.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            allRecentComplaints.push(
                ...recent.map((c: any) => ({
                    ...c,
                    _id: c._id.toString(),
                    department: dept.id,
                    departmentLabel: dept.label,
                }))
            );

            const deptTotal = total;
            const deptResolved = resolved + closed;
            const resolutionRate = deptTotal > 0 ? Math.round((deptResolved / deptTotal) * 100) : 0;
            const pendingCount = submitted + acknowledged + inProgress;

            departmentStats.push({
                id: dept.id,
                label: dept.label,
                color: dept.color,
                icon: dept.icon,
                total: deptTotal,
                pending: pendingCount,
                resolved: deptResolved,
                rejected,
                resolutionRate,
                statusBreakdown: { submitted, acknowledged, in_progress: inProgress, resolved, rejected, closed },
            });

            // Accumulate totals
            totalComplaints += total;
            resolvedComplaints += resolved + closed;
            rejectedComplaints += rejected;
            statusBreakdown.submitted += submitted;
            statusBreakdown.acknowledged += acknowledged;
            statusBreakdown.in_progress += inProgress;
            statusBreakdown.resolved += resolved;
            statusBreakdown.rejected += rejected;
            statusBreakdown.closed += closed;
            urgencyBreakdown.low += lowCount;
            urgencyBreakdown.medium += mediumCount;
            urgencyBreakdown.high += highCount;
            urgencyBreakdown.emergency += emergencyCount;
        }

        // Sort recent complaints by date across all departments
        allRecentComplaints.sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // User counts
        const [totalUsers, totalStaff, totalAdmins] = await Promise.all([
            User.countDocuments({ role: 'public' }),
            User.countDocuments({ role: { $in: ['department_head', 'department_staff'] } }),
            User.countDocuments({ role: 'admin' }),
        ]);

        const pendingComplaints = statusBreakdown.submitted + statusBreakdown.acknowledged + statusBreakdown.in_progress;
        const overallResolutionRate = totalComplaints > 0
            ? Math.round((resolvedComplaints / totalComplaints) * 100)
            : 0;

        return NextResponse.json({
            overview: {
                totalComplaints,
                pendingComplaints,
                resolvedComplaints,
                rejectedComplaints,
                overallResolutionRate,
                totalUsers,
                totalStaff,
                totalAdmins,
            },
            statusBreakdown,
            urgencyBreakdown,
            departmentStats,
            recentComplaints: allRecentComplaints.slice(0, 10),
        });

    } catch (error) {
        console.error('Admin Stats API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
