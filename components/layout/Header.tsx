
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white/60 backdrop-blur-lg shadow-md p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <UserIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-gray-800 font-medium">{user?.name}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
                    aria-label="Logout"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;