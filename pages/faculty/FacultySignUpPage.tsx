
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { Faculty } from '../../types';

const DEPARTMENT_OPTIONS = ['CSBS', 'CSE', 'ECE', 'IT', 'AIML', 'AIDS', 'MECH', 'CIVIL', 'CYBER', 'EEE', 'VLSI'];

const FacultySignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const { faculty, setFaculty, setFacultyCreds } = useData();
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        facultyId: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (faculty.some(f => f.email === formData.email)) {
            setError("An account with this email already exists.");
            return;
        }

        const newFacultyId = `f${Date.now()}`;
        const newFaculty: Faculty = {
            id: newFacultyId,
            name: formData.name,
            department: formData.department,
            facultyId: formData.facultyId,
            email: formData.email,
        };

        setFaculty(prev => [...prev, newFaculty]);
        setFacultyCreds(prev => ({...prev, [newFacultyId]: formData.password}));

        navigate('/faculty/login', { state: { message: 'Registration successful! Please log in.' } });
    };

    const inputStyle = "mt-1 block w-full p-2 border border-gray-300/50 rounded-md shadow-sm bg-white/50 focus:ring-green-500 focus:border-green-500 transition-all";

    return (
        <div className="min-h-screen flex justify-center items-center py-8">
            <div className="w-full max-w-lg">
                <Card>
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Faculty Sign Up</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Faculty Name</label>
                                <input type="text" name="name" onChange={handleChange} required className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Faculty ID</label>
                                <input type="text" name="facultyId" onChange={handleChange} required className={inputStyle} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <select name="department" onChange={handleChange} required className={inputStyle}>
                                <option value="">Select Department</option>
                                {DEPARTMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email ID</label>
                            <input type="email" name="email" onChange={handleChange} required className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" name="password" onChange={handleChange} required className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input type="password" name="confirmPassword" onChange={handleChange} required className={inputStyle} />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div className="flex items-center space-x-4 pt-2">
                             <Button type="button" variant="secondary" className="w-full" onClick={() => navigate('/faculty/login')}>
                                Cancel
                            </Button>
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{' '}
                        <Link to="/faculty/login" className="font-semibold text-green-700 hover:text-green-800">
                            Login
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default FacultySignUpPage;
