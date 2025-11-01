
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, Shield } from 'lucide-react';
import Card from '../components/common/Card';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-white text-shadow-lg">Student Management System</h1>
                <p className="text-gray-100 mt-4 text-lg">Your digital campus assistant.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                <Link to="/student/login">
                    <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer h-full">
                        <div className="flex justify-center mb-4">
                             <div className="bg-green-100 p-4 rounded-full">
                                <User className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Student Login</h2>
                        <p className="text-gray-600 mt-2">Access your dashboard, apply for leave, and manage your profile.</p>
                    </Card>
                </Link>
                <Link to="/faculty/login">
                     <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer h-full">
                        <div className="flex justify-center mb-4">
                            <div className="bg-sky-100 p-4 rounded-full">
                                <Briefcase className="h-12 w-12 text-sky-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Faculty Login</h2>
                        <p className="text-gray-600 mt-2">Manage student requests, view profiles, and more.</p>
                    </Card>
                </Link>
                 <Link to="/admin/login">
                     <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer h-full">
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-100 p-4 rounded-full">
                                <Shield className="h-12 w-12 text-red-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                        <p className="text-gray-600 mt-2">Manage students, faculty, and system settings.</p>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
