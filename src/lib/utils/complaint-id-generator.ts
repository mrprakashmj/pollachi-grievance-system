import { DEPARTMENT_CODES } from '@/constants/config';
import { DepartmentId } from '@/types/complaint';
import { format } from 'date-fns';

export const generateComplaintId = (department: DepartmentId): string => {
    const deptCode = DEPARTMENT_CODES[department] || 'GEN';
    const dateStr = format(new Date(), 'yyyyMMdd');
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    return `POL-${deptCode}-${dateStr}-${random}`;
};
