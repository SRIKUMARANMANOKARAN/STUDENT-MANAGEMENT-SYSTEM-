
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { Student, FEE_CATEGORIES, FeeItem, StudentType, STUDENT_TYPE_OPTIONS } from '../../types';

const DEPARTMENT_OPTIONS = ['CSBS', 'CSE', 'ECE', 'IT', 'AIML', 'AIDS', 'MECH', 'CIVIL', 'CYBER', 'EEE', 'VLSI'];
const ACADEMIC_YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const StudentSignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const { students, setStudents, setStudentCreds } = useData();
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        department: '',
        batch: '',
        academicYear: '',
        studentType: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        if (students.some(s => s.email === formData.email)) {
            setError("An account with this email already exists.");
            return;
        }

        const newStudentId = `s${Date.now()}`;
        const defaultFees: FeeItem[] = FEE_CATEGORIES.map(category => ({
            type: category,
            amount: 0,
            status: 'Unpaid'
        }));
        
        const newStudent: Student = {
            id: newStudentId,
            name: formData.name,
            rollNumber: formData.rollNumber,
            department: formData.department,
            batch: formData.batch,
            academicYear: formData.academicYear,
            studentType: formData.studentType as StudentType,
            address: formData.address,
            email: formData.email,
            cgpa: 0, // Default value
            contact: '', // Default value
            fees: defaultFees,
        };

        setStudents(prev => [...prev, newStudent]);
        setStudentCreds(prev => ({...prev, [newStudentId]: formData.password}));

        navigate('/student/login', { state: { message: 'Registration successful! Please log in.' } });
    };

    const inputStyle = "mt-1 block w-full p-2 border border-gray-300/50 rounded-md shadow-sm bg-white/50 focus:ring-green-500 focus:border-green-500 transition-all";

    return (
        <div className="min-h-screen flex justify-center items-center py-8">
            <div className="w-full max-w-lg">
                <Card>
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Sign Up</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" onChange={handleChange} required className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Register Number</label>
                                <input type="text" name="rollNumber" onChange={handleChange} required className={inputStyle} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <select name="department" onChange={handleChange} required className={inputStyle} defaultValue="">
                                    <option value="" disabled>Select Department</option>
                                    {DEPARTMENT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Batch</label>
                                <input type="text" name="batch" placeholder="e.g., 2022-2026" onChange={handleChange} required className={inputStyle} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                                <select name="academicYear" onChange={handleChange} required className={inputStyle} defaultValue="">
                                    <option value="" disabled>Select Year</option>
                                    {ACADEMIC_YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Student Type</label>
                                <select name="studentType" onChange={handleChange} required className={inputStyle} defaultValue="">
                                    <option value="" disabled>Select Type</option>
                                    {STUDENT_TYPE_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea name="address" onChange={handleChange} required className={inputStyle} rows={2}></textarea>
                            </div>
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
                             <Button type="button" variant="secondary" className="w-full" onClick={() => navigate('/student/login')}>
                                Cancel
                            </Button>
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Already have an account?{' '}
                        <Link to="/student/login" className="font-semibold text-green-700 hover:text-green-800">
                            Login
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default StudentSignUpPage;
