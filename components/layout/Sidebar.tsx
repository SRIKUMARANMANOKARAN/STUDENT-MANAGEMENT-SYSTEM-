

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, FileText, CalendarCheck, FileBadge, Route, Lock, Users, ClipboardList, UtensilsCrossed, CreditCard, ListChecks, DollarSign, Shield } from 'lucide-react';
import { UserRole } from '../../types';

interface NavItem {
    path: string;
    name: string;
    icon: React.ReactNode;
}

const studentNavItems: NavItem[] = [
    { path: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: 'profile', name: 'Profile', icon: <User size={20} /> },
    { path: 'on-duty', name: 'On-Duty Application', icon: <CalendarCheck size={20} /> },
    { path: 'leave', name: 'Leave Application', icon: <FileText size={20} /> },
    { path: 'bonafide', name: 'Bonafide Certificate', icon: <FileBadge size={20} /> },
    { path: 'applications', name: 'My Applications', icon: <ClipboardList size={20} /> },
    { path: 'hostel-menu', name: 'Hostel Food Menu', icon: <UtensilsCrossed size={20} /> },
    { path: 'fees', name: 'Fees Payment', icon: <CreditCard size={20} /> },
    { path: 'career-path', name: 'Career Path', icon: <Route size={20} /> },
    { path: 'change-password', name: 'Change Password', icon: <Lock size={20} /> },
];

const facultyNavItems: NavItem[] = [
    { path: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: 'students', name: 'Student Details', icon: <Users size={20} /> },
    { path: 'student-fees', name: 'Student Fees', icon: <ListChecks size={20} /> },
];

const adminNavItems: NavItem[] = [
    { path: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
];


interface SidebarProps {
    role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    const getNavItems = () => {
        switch(role) {
            case UserRole.STUDENT: return studentNavItems;
            case UserRole.FACULTY: return facultyNavItems;
            case UserRole.ADMIN: return adminNavItems;
            default: return [];
        }
    }
    const navItems = getNavItems();
    const basePath = `/${role}`;

    return (
        <aside className="w-64 bg-sky-800/80 backdrop-blur-lg text-white flex flex-col">
            <div className="p-4 border-b border-sky-700">
                <h2 className="text-3xl font-bold text-center tracking-wider">S<span className="text-green-400">M</span></h2>
                <p className="text-sm text-center text-sky-200 capitalize">{role} Panel</p>
            </div>
            <nav className="flex-1 p-2">
                <ul>
                    {navItems.map(item => (
                        <li key={item.name}>
                            <NavLink
                                to={`${basePath}/${item.path}`}
                                end={item.path === 'dashboard'}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 p-3 rounded-md my-1 transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-green-600 text-white'
                                        : 'text-sky-100 hover:bg-sky-700/80 hover:text-white'
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;