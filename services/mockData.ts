
import { Student, Faculty, Application, ApplicationStatus, ApplicationType, HostelMenu, FeesSettings, FeeItem, AdminSettings } from '../types';

export const initialStudents: Student[] = [
    {
        id: 's1',
        name: 'MKCE Student',
        rollNumber: '21CS001',
        department: 'CSE',
        contact: '123-456-7890',
        address: '123 College Road, Karur, Tamil Nadu',
        cgpa: 8.5,
        email: 'mkce@2025',
        careerPath: 'Placement',
        batch: '2021-2025',
        academicYear: '4th Year',
        studentType: 'Hosteller',
        fees: [
            { type: 'College', amount: 95000, status: 'Unpaid' },
            { type: 'Hostel', amount: 25000, status: 'Unpaid' },
            { type: 'Mess', amount: 15000, status: 'Paid', paymentDate: '2024-07-01', transactionId: 'TXN12345', paymentMode: 'GPay/UPI' },
            { type: 'Exam', amount: 2000, status: 'Unpaid' },
            { type: 'Association', amount: 500, status: 'Unpaid' },
        ],
    },
    {
        id: 's2',
        name: 'Jane Roe',
        rollNumber: '22EC015',
        department: 'ECE',
        contact: '098-765-4321',
        address: '456 University Ave, Erode, Tamil Nadu',
        cgpa: 9.1,
        email: 'jane.roe@example.com',
        careerPath: 'Higher Studies',
        batch: '2022-2026',
        academicYear: '3rd Year',
        studentType: 'Day Scholar',
        fees: [
             { type: 'College', amount: 92000, status: 'Paid', paymentDate: '2024-07-10', transactionId: 'TXN67890', paymentMode: 'Net Banking' },
             { type: 'Exam', amount: 2000, status: 'Paid', paymentDate: '2024-07-11', transactionId: 'TXN67891', paymentMode: 'GPay/UPI' },
        ],
    },
     {
        id: 's3',
        name: 'John Smith',
        rollNumber: '21CS042',
        department: 'CSE',
        contact: '555-555-5555',
        address: '789 Tech Park, Coimbatore, Tamil Nadu',
        cgpa: 7.8,
        email: 'john.smith@example.com',
        careerPath: 'Entrepreneur',
        batch: '2021-2025',
        academicYear: '4th Year',
        studentType: 'Day Scholar',
        fees: [
            { type: 'College', amount: 95000, status: 'Unpaid' },
            { type: 'Bus', amount: 8000, status: 'Paid', paymentDate: '2024-06-25', transactionId: 'TXN11223', paymentMode: 'Bank Transfer' },
            { type: 'Miscellaneous', amount: 1500, status: 'Unpaid'},
        ],
    }
];

export const initialFaculty: Faculty[] = [
    {
        id: 'f1',
        name: 'MKCE Faculty',
        department: 'CSE',
        email: 'faculty@mkce.com',
        facultyId: 'F001'
    },
    {
        id: 'f2',
        name: 'Dr. Anna Lee',
        department: 'ECE',
        email: 'anna.lee@example.com',
        facultyId: 'F002'
    },
];

export const studentCredentials = {
    's1': 'mkce',
    's2': 'password123',
    's3': 'password456',
};

export const facultyCredentials = {
    'f1': 'fac.mkce',
    'f2': 'password123',
};

export const adminCredentials = {
    'admin1': 'admin.mkce',
};

export const initialApplications: Application[] = [
    {
        id: 'app1',
        studentId: 's1',
        studentName: 'MKCE Student',
        studentRollNumber: '21CS001',
        type: ApplicationType.LEAVE,
        status: ApplicationStatus.PENDING,
        reason: 'Family function',
        dates: '2024-08-15 to 2024-08-16',
        submittedAt: new Date().toISOString(),
        department: 'CSE',
        batch: '2021-2025',
    },
    {
        id: 'app2',
        studentId: 's2',
        studentName: 'Jane Roe',
        studentRollNumber: '22EC015',
        type: ApplicationType.ON_DUTY,
        status: ApplicationStatus.PENDING,
        reason: 'Attending technical symposium',
        dates: '2024-09-01',
        submittedAt: new Date().toISOString(),
        department: 'ECE',
        batch: '2022-2026',
        facultyAssignedId: 'f2',
    },
     {
        id: 'app3',
        studentId: 's1',
        studentName: 'MKCE Student',
        studentRollNumber: '21CS001',
        type: ApplicationType.BONAFIDE,
        status: ApplicationStatus.APPROVED,
        reason: 'Passport Application',
        dates: 'N/A',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        remarks: 'Approved. Collect from office.',
        department: 'CSE',
        batch: '2021-2025',
        facultyActionById: 'f1',
    },
     {
        id: 'app4',
        studentId: 's3',
        studentName: 'John Smith',
        studentRollNumber: '21CS042',
        type: ApplicationType.ON_DUTY,
        status: ApplicationStatus.PENDING,
        reason: 'Representing college in hackathon',
        dates: '2024-09-05 to 2024-09-06',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        department: 'CSE',
        batch: '2021-2025',
        facultyAssignedId: 'f1',
    },
];

export const initialHostelMenu: HostelMenu = {
    Monday: { breakfast: 'Idly, Sambar', lunch: 'Rice, Dal, Veg Curry', dinner: 'Chapathi, Paneer Masala' },
    Tuesday: { breakfast: 'Pongal, Vada', lunch: 'Sambar Rice, Potato Fry', dinner: 'Dosa, Chutney' },
    Wednesday: { breakfast: 'Poori, Masala', lunch: 'Lemon Rice, Curd Rice', dinner: 'Kothu Parotta' },
    Thursday: { breakfast: 'Upma, Kesari', lunch: 'Rice, Veg Kootu', dinner: 'Idiyappam, Stew' },
    Friday: { breakfast: 'Dosa, Sambar', lunch: 'Variety Rice, Appalam', dinner: 'Chapathi, Veg Kurma' },
    Saturday: { breakfast: 'Idly, Vada Curry', lunch: 'Veg Biryani, Raita', dinner: 'Masala Dosa' },
    Sunday: { breakfast: 'Aloo Paratha', lunch: 'Special Meals', dinner: 'Naan, Paneer Butter Masala' },
};

export const initialFeesSettings: FeesSettings = {
    paymentsEnabled: true,
};

export const initialAdminSettings: AdminSettings = {
    facultyCanEdit: false,
};
