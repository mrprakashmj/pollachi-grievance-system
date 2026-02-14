import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import { getComplaintModel } from '@/lib/db/models/Complaint';
import { DEPARTMENTS } from '@/constants/departments';
import { DepartmentId } from '@/types/complaint';

export async function GET(req: Request) {
    try {
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

        const { searchParams } = new URL(req.url);
        const department = searchParams.get('department') || 'all';
        const status = searchParams.get('status') || 'all';
        const urgency = searchParams.get('urgency') || 'all';
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Build query filter
        const query: any = {};
        if (status !== 'all') query.status = status;
        if (urgency !== 'all') query.urgency = urgency;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { complaintId: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Determine which departments to query
        const deptIds: DepartmentId[] = department !== 'all'
            ? [department as DepartmentId]
            : DEPARTMENTS.map(d => d.id);

        // Fetch complaints from selected department collections
        const fetchPromises = deptIds.map(async (deptId) => {
            const Model = getComplaintModel(deptId);
            const [complaints, count] = await Promise.all([
                Model.find(query).sort({ createdAt: -1 }).lean(),
                Model.countDocuments(query),
            ]);
            // Tag each complaint with the department id
            return {
                complaints: complaints.map((c: any) => ({
                    ...c,
                    _id: c._id.toString(),
                    department: deptId,
                })),
                count,
            };
        });

        const results = await Promise.all(fetchPromises);

        // Merge all complaints
        let allComplaints = results.flatMap(r => r.complaints);
        const totalCount = results.reduce((sum, r) => sum + r.count, 0);

        // Sort merged results by date
        allComplaints.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Paginate
        const paginatedComplaints = allComplaints.slice(skip, skip + limit);

        // Department counts for tabs
        const deptCountPromises = DEPARTMENTS.map(async (dept) => {
            const Model = getComplaintModel(dept.id);
            const count = await Model.countDocuments(status !== 'all' ? { status } : {});
            return { id: dept.id, label: dept.label, count };
        });

        const departmentCounts = await Promise.all(deptCountPromises);

        // Status summary counts
        const statusCountPromises = ['submitted', 'acknowledged', 'in_progress', 'resolved', 'rejected', 'closed'].map(async (s) => {
            let count = 0;
            for (const dept of DEPARTMENTS) {
                const Model = getComplaintModel(dept.id);
                count += await Model.countDocuments({ status: s });
            }
            return { status: s, count };
        });

        const statusCounts = await Promise.all(statusCountPromises);

        return NextResponse.json({
            complaints: paginatedComplaints,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
            departmentCounts,
            statusCounts,
        });

    } catch (error: any) {
        console.error('Admin Complaints API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
