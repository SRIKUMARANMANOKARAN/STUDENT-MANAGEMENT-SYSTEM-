
import React from 'react';
import Sidebar from './Sidebar';
import { UserRole } from '../../types';
import Header from './Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: UserRole;
    title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, title }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={title} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
