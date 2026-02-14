export type UserRole = 'public' | 'department_staff' | 'department_head' | 'admin';

export interface User {
  uid: string; // Mapped from _id
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  department?: string; // Only for staff
  address?: string;
  pinCode?: string;
  aadhaar?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  pinCode: string;
  aadhaar?: string;
}

