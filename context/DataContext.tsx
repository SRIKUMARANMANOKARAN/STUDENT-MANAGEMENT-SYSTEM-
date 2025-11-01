
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Student, Application, Faculty, HostelMenu, FeesSettings, AdminSettings } from '../types';
import { initialStudents, initialFaculty, initialApplications, studentCredentials, facultyCredentials, initialHostelMenu, initialFeesSettings, initialAdminSettings } from '../services/mockData';

interface DataContextType {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
    faculty: Faculty[];
    setFaculty: React.Dispatch<React.SetStateAction<Faculty[]>>;
    applications: Application[];
    setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
    studentCreds: Record<string, string>;
    setStudentCreds: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    facultyCreds: Record<string, string>;
    setFacultyCreds: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    hostelMenu: HostelMenu;
    setHostelMenu: React.Dispatch<React.SetStateAction<HostelMenu>>;
    feesSettings: FeesSettings;
    setFeesSettings: React.Dispatch<React.SetStateAction<FeesSettings>>;
    adminSettings: AdminSettings;
    setAdminSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [students, setStudents] = useLocalStorage<Student[]>('students', initialStudents);
    const [faculty, setFaculty] = useLocalStorage<Faculty[]>('faculty', initialFaculty);
    const [applications, setApplications] = useLocalStorage<Application[]>('applications', initialApplications);
    const [studentCreds, setStudentCreds] = useLocalStorage<Record<string, string>>('student_creds', studentCredentials);
    const [facultyCreds, setFacultyCreds] = useLocalStorage<Record<string, string>>('faculty_creds', facultyCredentials);
    const [hostelMenu, setHostelMenu] = useLocalStorage<HostelMenu>('hostel_menu', initialHostelMenu);
    const [feesSettings, setFeesSettings] = useLocalStorage<FeesSettings>('fees_settings', initialFeesSettings);
    const [adminSettings, setAdminSettings] = useLocalStorage<AdminSettings>('admin_settings', initialAdminSettings);

    return (
        <DataContext.Provider value={{ students, setStudents, faculty, setFaculty, applications, setApplications, studentCreds, setStudentCreds, facultyCreds, setFacultyCreds, hostelMenu, setHostelMenu, feesSettings, setFeesSettings, adminSettings, setAdminSettings }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
