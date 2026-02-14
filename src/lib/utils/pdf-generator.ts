import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export interface ReportData {
    complaintId: string;
    userName: string;
    department: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    location: string;
}

export const generateComplaintPDF = (data: ReportData) => {
    const doc = new jsPDF();
    const dateStr = format(new Date(), 'dd MMM yyyy');

    // Header
    doc.setFillColor(30, 64, 175); // Blue-800
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('POLLACHI MUNICIPAL CORPORATION', 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Grievance Redressal System - Acknowledgment Receipt', 105, 28, { align: 'center' });

    // Body
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(10);
    doc.text(`Generated on: ${dateStr}`, 160, 50);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Complaint Details', 20, 60);
    doc.setLineWidth(0.5);
    doc.line(20, 62, 190, 62);

    // Table Data
    const tableData = [
        ['Complaint ID', data.complaintId],
        ['Department', data.department],
        ['Title', data.title],
        ['Status', data.status.toUpperCase()],
        ['Filed Date', data.createdAt],
        ['Citizen Name', data.userName],
        ['Location / Area', data.location],
    ];

    autoTable(doc, {
        startY: 70,
        head: [['Field', 'Description']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [30, 64, 175] },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        margin: { left: 20, right: 20 },
    });

    // Description Section
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Full Description:', 20, finalY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitDesc = doc.splitTextToSize(data.description, 170);
    doc.text(splitDesc, 20, finalY + 7);

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('This is a computer-generated document. No signature is required.', 105, pageHeight - 15, { align: 'center' });
    doc.text('Pollachi Municipal Corporation © 2025', 105, pageHeight - 10, { align: 'center' });

    // Save the PDF
    doc.save(`PMC-Complaint-${data.complaintId}.pdf`);
};
