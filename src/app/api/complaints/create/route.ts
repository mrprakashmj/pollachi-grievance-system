import { NextRequest, NextResponse } from 'next/server';
import { generateComplaintId } from '@/lib/utils/complaint-id-generator';
import dbConnect from '@/lib/db/mongodb';
import { getComplaintModel } from '@/lib/db/models/Complaint';
import { saveFile } from '@/lib/utils/upload-handler';
import { ComplaintStatus, UrgencyLevel, DepartmentId } from '@/types/complaint';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // Extract basic fields
        const department = formData.get('department') as DepartmentId;
        const subCategory = formData.get('subCategory') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const location = formData.get('location') as string;
        const pinCode = formData.get('pinCode') as string;
        const urgency = formData.get('urgency') as UrgencyLevel;
        const userId = formData.get('userId') as string;
        const userName = formData.get('userName') as string;
        const userEmail = formData.get('userEmail') as string;
        const userPhone = formData.get('userPhone') as string;
        const userAddress = formData.get('userAddress') as string;

        // Generate Complaint ID
        const complaintId = generateComplaintId(department);

        // Handle File Uploads
        const attachmentFiles = formData.getAll('attachments') as File[];
        const attachmentUrls: string[] = [];

        if (attachmentFiles && attachmentFiles.length > 0) {
            for (const file of attachmentFiles) {
                if (file instanceof File) {
                    const url = await saveFile(file, complaintId); // Save to public/uploads/[complaintId]/
                    attachmentUrls.push(url);
                }
            }
        }

        // Connect to MongoDB
        await dbConnect();

        // Get departmental model
        const DepartmentalComplaint = getComplaintModel(department);

        // Create Complaint in departmental collection
        const complaint = await DepartmentalComplaint.create({
            complaintId,
            userId,
            userName,
            department,
            category: subCategory,
            title,
            description,
            urgency,
            status: 'submitted',
            location,
            images: attachmentUrls,
            assignedTo: undefined,
            timeline: [
                {
                    status: 'submitted',
                    timestamp: new Date(),
                    note: 'Complaint registered successfully',
                    updatedBy: 'system',
                },
            ],
        });

        return NextResponse.json({
            success: true,
            id: (complaint as any)._id,
            complaintId
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
