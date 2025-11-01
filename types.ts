
export enum UserRole {
    STUDENT = 'student',
    FACULTY = 'faculty',
    ADMIN = 'admin',
}

export const CAREER_PATH_OPTIONS = ['Placement', 'Entrepreneur', 'Training', 'Higher Studies'] as const;
export type CareerPath = typeof CAREER_PATH_OPTIONS[number];

export const FEE_CATEGORIES = ['College', 'Hostel', 'Mess', 'Bus', 'Miscellaneous', 'Lab', 'Exam', 'Association'] as const;
export type FeeCategory = typeof FEE_CATEGORIES[number];

export const STUDENT_TYPE_OPTIONS = ['Hosteller', 'Day Scholar'] as const;
export type StudentType = typeof STUDENT_TYPE_OPTIONS[number];

export type PaymentMode = 'GPay/UPI' | 'Net Banking' | 'Bank Transfer';

export interface FeeItem {
    type: FeeCategory;
    amount: number;
    status: 'Paid' | 'Unpaid';
    paymentDate?: string;
    transactionId?: string;
    paymentMode?: PaymentMode;
}

export interface Student {
    id: string;
    name: string;
    rollNumber: string;
    department: string;
    contact: string;
    address: string;
    cgpa: number;
    email: string;
    careerPath?: CareerPath;
    batch: string;
    academicYear: string;
    studentType: StudentType;
    fees: FeeItem[];
}

export interface Faculty {
    id: string;
    name: string;
    department: string;
    email: string;
    facultyId: string;
}

export interface Admin {
    id: string;
    name: string;
    email: string;
}

export type User = Student | Faculty | Admin;

export enum ApplicationType {
    ON_DUTY = 'On-Duty',
    LEAVE = 'Leave',
    BONAFIDE = 'Bonafide Certificate',
}

export enum ApplicationStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}

export interface Application {
    id: string;
    studentId: string;
    studentName: string;
    studentRollNumber: string;
    type: ApplicationType;
    status: ApplicationStatus;
    reason: string;
    dates: string;
    submittedAt: string;
    documentUrl?: string;
    remarks?: string;
    numberOfDays?: number;
    academicYear?: string;
    batch?: string;
    department?: string;
    facultyAssignedId?: string;
    facultyActionById?: string;
}

export type DayMenu = {
    breakfast: string;
    lunch: string;
    dinner: string;
};

export type HostelMenu = {
    [day: string]: DayMenu;
};

export interface FeesSettings {
    paymentsEnabled: boolean;
}

export interface AdminSettings {
    facultyCanEdit: boolean;
}
