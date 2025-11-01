
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, UserRole, Student, Faculty, Admin } from '../types';
import { useData } from './DataContext';
import { adminCredentials } from '../services/mockData';

interface AuthContextType {
    user: User | null;
    userRole: UserRole | null;
    login: (email: string, pass: string, role: UserRole) => boolean;
    logout: () => void;
    changePassword: (oldPass: string, newPass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { students, faculty, studentCreds, setStudentCreds, facultyCreds } = useData();
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('userRole') as UserRole;
        if (storedUser && storedRole) {
            setUser(JSON.parse(storedUser));
            setUserRole(storedRole);
        }
    }, []);

    const login = (email: string, pass: string, role: UserRole): boolean => {
        let foundUser: User | undefined;
        let creds: Record<string, string>;
        
        if (role === UserRole.STUDENT) {
            foundUser = students.find(s => s.email === email);
            creds = studentCreds;
        } else if (role === UserRole.FACULTY) {
            foundUser = faculty.find(f => f.email === email);
            creds = facultyCreds;
        } else { // Admin
            const adminUser: Admin = { id: 'admin1', name: 'Admin', email: 'admin@mkce.com'};
            if (adminUser.email === email && adminCredentials[adminUser.id] === pass) {
                foundUser = adminUser;
            }
            creds = adminCredentials;
        }

        if (foundUser && creds[foundUser.id] === pass) {
            setUser(foundUser);
            setUserRole(role);
            localStorage.setItem('user', JSON.stringify(foundUser));
            localStorage.setItem('userRole', role);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setUserRole(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
    };
    
    const changePassword = (oldPass: string, newPass: string): boolean => {
        if (user && userRole === UserRole.STUDENT) {
            if (studentCreds[user.id] === oldPass) {
                setStudentCreds(prev => ({ ...prev, [user.id]: newPass }));
                return true;
            }
        }
        return false;
    }


    return (
        <AuthContext.Provider value={{ user, userRole, login, logout, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
