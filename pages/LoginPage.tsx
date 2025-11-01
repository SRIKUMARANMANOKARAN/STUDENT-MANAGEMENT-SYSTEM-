
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

interface LoginPageProps {
    role: UserRole;
}

const LoginPage: React.FC<LoginPageProps> = ({ role }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const getRoleDetails = () => {
        switch(role) {
            case UserRole.STUDENT:
                return { title: 'Student Login', loginLabel: 'Email ID', defaultEmail: 'mkce@2025', defaultPassword: 'mkce' };
            case UserRole.FACULTY:
                return { title: 'Faculty Login', loginLabel: 'Login ID', defaultEmail: 'faculty@mkce.com', defaultPassword: 'fac.mkce' };
            case UserRole.ADMIN:
                return { title: 'Admin Login', loginLabel: 'Admin ID', defaultEmail: 'admin@mkce.com', defaultPassword: 'admin.mkce' };
            default:
                return { title: 'Login', loginLabel: 'Email', defaultEmail: '', defaultPassword: '' };
        }
    }
    
    const { title, loginLabel, defaultEmail, defaultPassword } = getRoleDetails();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(email, password, role)) {
            navigate(`/${role}/dashboard`);
        } else {
            setError('Invalid credentials.');
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="w-full max-w-md">
                 <Link to="/" className="text-center block mb-4 text-white hover:underline font-semibold">
                    &larr; Back to Home
                </Link>
                <Card>
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
                    
                    <div className="mb-4 p-3 bg-sky-100/70 border border-sky-200 rounded-md text-sm text-sky-800">
                        <p className="font-semibold">Demo Credentials:</p>
                        <p>{loginLabel}: <span className="font-mono">{defaultEmail}</span></p>
                        <p>Password: <span className="font-mono">{defaultPassword}</span></p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                {loginLabel}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow-sm appearance-none border border-gray-300/80 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder={`Enter your ${loginLabel.toLowerCase()}`}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow-sm appearance-none border border-gray-300/80 rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                placeholder="******************"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                        <div className="flex items-center justify-between">
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                    {role !== UserRole.ADMIN && (
                         <p className="text-center text-xs text-gray-500 mt-6">
                            Note: Student and Faculty accounts are created by the Admin. No sign-up option is available.
                        </p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
