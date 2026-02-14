import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import { getComplaintModel } from '@/lib/db/models/Complaint';
import Notification from '@/lib/db/models/Notification';
import { DEPARTMENTS } from '@/constants/departments';
import { DepartmentId } from '@/types/complaint';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token) as any;
        if (!decoded || decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { status, note, department } = await req.json();

        if (!status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }

        await dbConnect();

        // Find the complaint across collections
        let complaint: any = null;
        let foundDeptId: DepartmentId | null = null;

        // If department is specified, search only that collection
        if (department) {
            const Model = getComplaintModel(department as DepartmentId);
            complaint = await Model.findOne({ complaintId: id });
            foundDeptId = department as DepartmentId;
        }

        // Otherwise, search all collections
        if (!complaint) {
            for (const dept of DEPARTMENTS) {
                const Model = getComplaintModel(dept.id);
                const found = await Model.findOne({ complaintId: id });
                if (found) {
                    complaint = found;
                    foundDeptId = dept.id;
                    break;
                }
            }
        }

        if (!complaint) {
            return NextResponse.json({ message: 'Complaint not found' }, { status: 404 });
        }

        // Update the status
        complaint.status = status;

        // Add timeline entry
        complaint.timeline.push({
            status,
            timestamp: new Date(),
            note: note || `Status updated to ${status} by admin`,
            updatedBy: decoded.userId,
        });

        await complaint.save();

        // Create notification for the complaint owner (non-blocking)
        try {
            const statusLabels: Record<string, string> = {
                acknowledged: 'Acknowledged',
                in_progress: 'In Progress',
                resolved: 'Resolved',
                rejected: 'Rejected',
                closed: 'Closed',
            };

            const notificationTitle = `Complaint ${statusLabels[status] || status}`;
            const notificationMessage = status === 'rejected'
                ? `Your complaint ${id} has been rejected. Reason: ${note || 'No reason provided'}`
                : `Your complaint ${id} has been updated to "${statusLabels[status] || status}".${note ? ` Note: ${note}` : ''}`;

            await Notification.create({
                userId: complaint.userId,
                type: status === 'rejected' ? 'complaint_rejected' : 'status_update',
                title: notificationTitle,
                message: notificationMessage,
                complaintId: id,
            });
        } catch (notifError) {
            console.error('Failed to create notification (non-blocking):', notifError);
        }

        return NextResponse.json({
            success: true,
            complaint: {
                ...complaint.toObject(),
                department: foundDeptId,
            },
        });

    } catch (error: any) {
        console.error('Admin Status Update Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
