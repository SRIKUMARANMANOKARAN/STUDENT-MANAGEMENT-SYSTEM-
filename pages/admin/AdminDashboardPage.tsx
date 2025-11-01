
import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UserRole, Student, Faculty, Application, ApplicationStatus, DayMenu, HostelMenu, FEE_CATEGORIES, FeeItem, FeeCategory, STUDENT_TYPE_OPTIONS, StudentType } from '../../types';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Edit, Trash2, PlusCircle, Users, ClipboardList, UtensilsCrossed, DollarSign, BarChart2, CheckCircle, XCircle, Settings } from 'lucide-react';

// --- Reusable Components ---
const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
    const colorClasses = {
        [ApplicationStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [ApplicationStatus.APPROVED]: 'bg-green-100 text-green-800',
        [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const inputStyle = "mt-1 block w-full p-2 border border-gray-300/50 rounded-md shadow-sm bg-white/50 focus:ring-green-500 focus:border-green-500 transition-all";
const tableHeaderClass = "p-3 font-semibold text-gray-700 text-left";
const tableCellClass = "p-3 text-gray-700";
const tableRowClass = "border-b border-gray-200/80";


// --- Manage Students Component ---
const ManageStudents: React.FC<{ onAdd: () => void, onEdit: (user: Student) => void }> = ({ onAdd, onEdit }) => {
    const { students, setStudents, studentCreds, setStudentCreds } = useData();

    const handleDeleteStudent = (studentId: string) => {
        if (window.confirm('Are you sure you want to delete this student? This action is irreversible.')) {
            setStudents(students.filter(s => s.id !== studentId));
            const newCreds = { ...studentCreds };
            delete newCreds[studentId];
            setStudentCreds(newCreds);
        }
    };
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Manage Students</h3>
                <Button onClick={onAdd}><PlusCircle size={16} className="mr-2" />Add Student</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead><tr className="bg-gray-50/70 border-b"><th className={tableHeaderClass}>Name</th><th className={tableHeaderClass}>Roll No.</th><th className={tableHeaderClass}>Department</th><th className={tableHeaderClass}>Email</th><th className={tableHeaderClass}>Actions</th></tr></thead>
                    <tbody>
                        {students.map(s => (
                            <tr key={s.id} className={`${tableRowClass} hover:bg-gray-50/50`}>
                                <td className={tableCellClass}>{s.name}</td>
                                <td className={tableCellClass}>{s.rollNumber}</td>
                                <td className={tableCellClass}>{s.department}</td>
                                <td className={tableCellClass}>{s.email}</td>
                                <td className={`${tableCellClass} flex space-x-2`}>
                                    <Button onClick={() => onEdit(s)} variant="secondary" className="p-2"><Edit size={16} /></Button>
                                    <Button onClick={() => handleDeleteStudent(s.id)} variant="danger" className="p-2"><Trash2 size={16} /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

// --- Manage Faculty Component ---
const ManageFaculty: React.FC<{ onAdd: () => void, onEdit: (user: Faculty) => void }> = ({ onAdd, onEdit }) => {
    const { faculty, setFaculty, facultyCreds, setFacultyCreds } = useData();

    const handleDeleteFaculty = (facultyId: string) => {
        if (window.confirm('Are you sure you want to delete this faculty member? This action is irreversible.')) {
            setFaculty(faculty.filter(f => f.id !== facultyId));
            const newCreds = { ...facultyCreds };
            delete newCreds[facultyId];
            setFacultyCreds(newCreds);
        }
    };
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Manage Faculty</h3>
                <Button onClick={onAdd}><PlusCircle size={16} className="mr-2" />Add Faculty</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead><tr className="bg-gray-50/70 border-b"><th className={tableHeaderClass}>Name</th><th className={tableHeaderClass}>Faculty ID</th><th className={tableHeaderClass}>Department</th><th className={tableHeaderClass}>Email</th><th className={tableHeaderClass}>Actions</th></tr></thead>
                    <tbody>
                        {faculty.map(f => (
                            <tr key={f.id} className={`${tableRowClass} hover:bg-gray-50/50`}>
                                <td className={tableCellClass}>{f.name}</td>
                                <td className={tableCellClass}>{f.facultyId}</td>
                                <td className={tableCellClass}>{f.department}</td>
                                <td className={tableCellClass}>{f.email}</td>
                                <td className={`${tableCellClass} flex space-x-2`}>
                                    <Button onClick={() => onEdit(f)} variant="secondary" className="p-2"><Edit size={16} /></Button>
                                    <Button onClick={() => handleDeleteFaculty(f.id)} variant="danger" className="p-2"><Trash2 size={16} /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

// --- View Applications Component ---
const ViewAllApplications: React.FC = () => {
    const { applications, faculty, students } = useData();
    const [filters, setFilters] = useState({ department: '', batch: '', status: '' });

    const distinct = <T,>(arr: T[]) => [...new Set(arr)].filter(Boolean);
    const departments = distinct(students.map(s => s.department));
    const batches = distinct(students.map(s => s.batch));

    const filteredApps = useMemo(() => {
        return applications
            .filter(app => filters.department ? app.department === filters.department : true)
            .filter(app => filters.batch ? app.batch === filters.batch : true)
            .filter(app => filters.status ? app.status === filters.status : true)
            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }, [applications, filters]);

    return (
         <Card>
            <h3 className="text-xl font-bold mb-4 text-gray-800">All Student Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50/70 rounded-lg">
                <select value={filters.department} onChange={e => setFilters({...filters, department: e.target.value})} className={inputStyle}><option value="">All Departments</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select>
                <select value={filters.batch} onChange={e => setFilters({...filters, batch: e.target.value})} className={inputStyle}><option value="">All Batches</option>{batches.map(b => <option key={b} value={b}>{b}</option>)}</select>
                <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className={inputStyle}><option value="">All Statuses</option>{Object.values(ApplicationStatus).map(s => <option key={s} value={s}>{s}</option>)}</select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead><tr className="bg-gray-50/70 border-b"><th className={tableHeaderClass}>Student</th><th className={tableHeaderClass}>Type</th><th className={tableHeaderClass}>Reason</th><th className={tableHeaderClass}>Submitted</th><th className={tableHeaderClass}>Status</th><th className={tableHeaderClass}>Handled By</th></tr></thead>
                    <tbody>
                        {filteredApps.map(app => {
                            const handlingFaculty = faculty.find(f => f.id === app.facultyActionById);
                            return (
                            <tr key={app.id} className={`${tableRowClass} hover:bg-gray-50/50`}>
                                <td className={tableCellClass}>{app.studentName} ({app.studentRollNumber})</td>
                                <td className={tableCellClass}>{app.type}</td>
                                <td className={`${tableCellClass} truncate max-w-xs`}>{app.reason}</td>
                                <td className={tableCellClass}>{new Date(app.submittedAt).toLocaleDateString()}</td>
                                <td className={tableCellClass}><StatusBadge status={app.status}/></td>
                                <td className={tableCellClass}>{handlingFaculty?.name ?? 'N/A'}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

// --- Manage Hostel Menu ---
const ManageHostelMenu: React.FC = () => {
    const { hostelMenu, setHostelMenu } = useData();
    const [menu, setMenu] = useState<HostelMenu>(hostelMenu);
    const [successMessage, setSuccessMessage] = useState('');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleChange = (day: string, meal: keyof DayMenu, value: string) => {
        setMenu(prev => ({...prev, [day]: {...prev[day], [meal]: value}}));
    }

    const handleSave = () => {
        setHostelMenu(menu);
        setSuccessMessage('Hostel menu updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    }
    
    return (
        <Card>
             <h3 className="text-xl font-bold mb-4 text-gray-800">Manage Hostel Food Menu</h3>
             {successMessage && <div className="p-3 mb-4 bg-green-100/80 text-green-800 font-semibold rounded-md">{successMessage}</div>}
             <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                     <thead><tr className="bg-gray-50/70 border-b"><th className={tableHeaderClass}>Day</th><th className={tableHeaderClass}>Breakfast</th><th className={tableHeaderClass}>Lunch</th><th className={tableHeaderClass}>Dinner</th></tr></thead>
                     <tbody>
                        {days.map(day => (
                            <tr key={day} className={tableRowClass}>
                                <td className={`${tableCellClass} font-semibold`}>{day}</td>
                                <td className={tableCellClass}><input type="text" value={menu[day]?.breakfast || ''} onChange={e => handleChange(day, 'breakfast', e.target.value)} className={inputStyle}/></td>
                                <td className={tableCellClass}><input type="text" value={menu[day]?.lunch || ''} onChange={e => handleChange(day, 'lunch', e.target.value)} className={inputStyle}/></td>
                                <td className={tableCellClass}><input type="text" value={menu[day]?.dinner || ''} onChange={e => handleChange(day, 'dinner', e.target.value)} className={inputStyle}/></td>
                            </tr>
                        ))}
                     </tbody>
                </table>
             </div>
             <div className="flex justify-end mt-4"><Button onClick={handleSave}>Save Menu Changes</Button></div>
        </Card>
    );
}

// --- Manage Fees ---
const EditStudentFeesModal: React.FC<{
    student: Student | null;
    onClose: () => void;
    onSave: (studentId: string, updatedFees: FeeItem[]) => void;
}> = ({ student, onClose, onSave }) => {
    if (!student) return null;

    const initialFees = useMemo((): FeeItem[] => {
        const existingFees = student.fees || [];
        const feeMap = new Map(existingFees.map(f => [f.type, f]));
        return FEE_CATEGORIES.map(cat => feeMap.get(cat) || { type: cat, amount: 0, status: 'Unpaid' as const});
    }, [student.fees]);

    const [fees, setFees] = useState<FeeItem[]>(initialFees);

    const handleFeeChange = (type: FeeCategory, amount: string) => {
        const newAmount = parseFloat(amount) || 0;
        setFees(prev => prev.map(fee => fee.type === type ? { ...fee, amount: newAmount } : fee));
    };

    const handleStatusToggle = (type: FeeCategory) => {
        setFees(prev => prev.map(fee => {
            if (fee.type === type) {
                const isPaid = fee.status === 'Paid';
                return {
                    ...fee,
                    status: isPaid ? 'Unpaid' : 'Paid',
                    paymentDate: isPaid ? undefined : new Date().toLocaleDateString('en-CA'),
                    transactionId: isPaid ? undefined : `ADMIN_OVERRIDE_${Date.now()}`,
                    paymentMode: isPaid ? undefined : 'Bank Transfer'
                };
            }
            return fee;
        }));
    };

    const handleSubmit = () => {
        onSave(student.id, fees);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <Card className="w-full max-w-2xl">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Fees for {student.name}</h3>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {fees.map(fee => (
                        <div key={fee.type} className="grid grid-cols-12 gap-2 items-center">
                            <label className="font-medium text-gray-700 col-span-4">{fee.type}</label>
                            <div className="relative col-span-5">
                                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                <input type="number" value={fee.amount} onChange={e => handleFeeChange(fee.type, e.target.value)} className={`${inputStyle} pl-7`} />
                            </div>
                            <div className="col-span-3">
                                <Button
                                    onClick={() => handleStatusToggle(fee.type)}
                                    variant={fee.status === 'Paid' ? 'primary' : 'secondary'}
                                    className="w-full flex justify-center items-center space-x-1"
                                    size="sm"
                                >
                                    {fee.status === 'Paid' ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                                    <span>{fee.status}</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-2 pt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                </div>
            </Card>
        </div>
    );
};


const ManageFees: React.FC = () => {
    const { students, setStudents, feesSettings, setFeesSettings } = useData();
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const handleSaveFees = (studentId: string, updatedFees: FeeItem[]) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, fees: updatedFees } : s));
    };

    const feeSummaries = useMemo(() => {
        return students.map(s => {
            const studentFees = s.fees || [];
            const total = studentFees.reduce((sum, f) => sum + f.amount, 0);
            const paid = studentFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
            const pending = total - paid;
            const feeData: { [key: string]: number } = {};
            studentFees.forEach(f => { feeData[f.type] = f.amount; });
            return { ...s, total, paid, pending, feeData };
        });
    }, [students]);

    return (
        <>
            <Card>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Manage Student Fees</h3>
                <div className="p-4 bg-sky-50/70 rounded-lg mb-6 flex justify-between items-center">
                    <p className="font-semibold text-gray-700">Fee Payment Status</p>
                    <label className="flex items-center cursor-pointer">
                        <span className={`mr-3 font-medium ${!feesSettings.paymentsEnabled ? 'text-red-600' : 'text-gray-500'}`}>Disabled</span>
                        <div className="relative">
                            <input type="checkbox" checked={feesSettings.paymentsEnabled} onChange={() => setFeesSettings(prev => ({ ...prev, paymentsEnabled: !prev.paymentsEnabled }))} className="sr-only" />
                            <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-transform ${feesSettings.paymentsEnabled ? 'transform translate-x-6 bg-green-500' : 'bg-gray-500'}`}></div>
                        </div>
                        <span className={`ml-3 font-medium ${feesSettings.paymentsEnabled ? 'text-green-600' : 'text-gray-500'}`}>Enabled</span>
                    </label>
                </div>
                
                <h4 className="text-lg font-semibold mb-2 text-gray-800">Student Fees Overview</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50/70 border-b">
                                <th className={`${tableHeaderClass} sticky left-0 bg-gray-50/70`}>Student Name</th>
                                {FEE_CATEGORIES.map(cat => <th key={cat} className={tableHeaderClass}>{cat}</th>)}
                                <th className={tableHeaderClass}>Total Fees</th>
                                <th className={tableHeaderClass}>Paid</th>
                                <th className={tableHeaderClass}>Pending</th>
                                <th className={tableHeaderClass}>Type</th>
                                <th className={tableHeaderClass}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeSummaries.map(s => (
                                <tr key={s.id} className={`${tableRowClass} hover:bg-gray-50/50`}>
                                    <td className={`${tableCellClass} font-semibold sticky left-0 bg-white/70 backdrop-blur-sm`}>{s.name}</td>
                                    {FEE_CATEGORIES.map(cat => <td key={cat} className={tableCellClass}>₹{s.feeData[cat]?.toLocaleString() || 0}</td>)}
                                    <td className={`${tableCellClass} font-semibold`}>₹{s.total.toLocaleString()}</td>
                                    <td className={`${tableCellClass} font-semibold text-green-600`}>₹{s.paid.toLocaleString()}</td>
                                    <td className={`${tableCellClass} font-semibold text-red-600`}>₹{s.pending.toLocaleString()}</td>
                                    <td className={tableCellClass}>{s.studentType}</td>
                                    <td className={tableCellClass}>
                                        <Button onClick={() => setEditingStudent(s)} size="sm" variant="secondary">Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <EditStudentFeesModal 
                student={editingStudent} 
                onClose={() => setEditingStudent(null)} 
                onSave={handleSaveFees} 
            />
        </>
    );
};

// --- Reports Component ---
const AdminReports: React.FC = () => {
    const { students, applications } = useData();

    const feeSummary = useMemo(() => {
        let total = 0, collected = 0;
        const studentsWithDues: { name: string, rollNumber: string, department: string, pending: number }[] = [];

        students.forEach(student => {
            const studentFees = student.fees || [];
            const studentTotal = studentFees.reduce((sum, f) => sum + f.amount, 0);
            const studentPaid = studentFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
            const studentPending = studentTotal - studentPaid;
            
            total += studentTotal;
            collected += studentPaid;

            if (studentPending > 0) {
                studentsWithDues.push({ name: student.name, rollNumber: student.rollNumber, department: student.department, pending: studentPending });
            }
        });
        
        return { 
            total, 
            collected, 
            pending: total - collected,
            completionRatio: total > 0 ? ((collected / total) * 100).toFixed(2) : '0.00',
            studentsWithDues: studentsWithDues.sort((a,b) => b.pending - a.pending)
        };
    }, [students]);

    const appSummary = useMemo(() => {
        return applications.reduce((acc, app) => {
            acc.total++;
            if (app.status === ApplicationStatus.PENDING) acc.pending++;
            if (app.status === ApplicationStatus.APPROVED) acc.approved++;
            if (app.status === ApplicationStatus.REJECTED) acc.rejected++;
            return acc;
        }, { total: 0, pending: 0, approved: 0, rejected: 0 });
    }, [applications]);
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Fee Collection Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50/70 rounded-lg">
                            <span className="font-semibold text-gray-700">Total Assignable Fees:</span>
                            <span className="text-2xl font-bold text-sky-600">₹{feeSummary.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50/70 rounded-lg">
                            <span className="font-semibold text-gray-700">Total Fees Collected:</span>
                            <span className="text-2xl font-bold text-green-600">₹{feeSummary.collected.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50/70 rounded-lg">
                            <span className="font-semibold text-gray-700">Total Dues:</span>
                            <span className="text-2xl font-bold text-red-600">₹{feeSummary.pending.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50/70 rounded-lg">
                            <span className="font-semibold text-gray-700">Payment Completion Ratio:</span>
                            <span className="text-2xl font-bold text-blue-600">{feeSummary.completionRatio}%</span>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Application Statistics</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50/70 rounded-lg"><span className="font-semibold text-gray-700">Total Applications:</span><span className="text-2xl font-bold text-sky-600">{appSummary.total}</span></div>
                        <div className="flex justify-between items-center p-3 bg-gray-50/70 rounded-lg"><span className="font-semibold text-gray-700">Pending:</span><span className="text-2xl font-bold text-amber-500">{appSummary.pending}</span></div>
                        <div className="flex justify-between items-center p-3 bg-gray-50/70 rounded-lg"><span className="font-semibold text-gray-700">Approved:</span><span className="text-2xl font-bold text-green-600">{appSummary.approved}</span></div>
                        <div className="flex justify-between items-center p-3 bg-gray-50/70 rounded-lg"><span className="font-semibold text-gray-700">Rejected:</span><span className="text-2xl font-bold text-red-600">{appSummary.rejected}</span></div>
                    </div>
                </Card>
            </div>
             <Card>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Pending Dues List</h3>
                <div className="overflow-y-auto max-h-80">
                    <table className="w-full">
                         <thead><tr className="bg-gray-50/70 border-b"><th className={tableHeaderClass}>Student Name</th><th className={tableHeaderClass}>Roll No.</th><th className={tableHeaderClass}>Department</th><th className={tableHeaderClass}>Pending Amount</th></tr></thead>
                        <tbody>
                            {feeSummary.studentsWithDues.length > 0 ? (
                                feeSummary.studentsWithDues.map(s => (
                                    <tr key={s.rollNumber} className={`${tableRowClass} hover:bg-gray-50/50`}>
                                        <td className={tableCellClass}>{s.name}</td>
                                        <td className={tableCellClass}>{s.rollNumber}</td>
                                        <td className={tableCellClass}>{s.department}</td>
                                        <td className={`${tableCellClass} font-semibold text-red-600`}>₹{s.pending.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="text-center p-4 text-gray-500">No pending dues found. All payments are clear!</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const AdminSettingsTab: React.FC = () => {
    const { adminSettings, setAdminSettings } = useData();

    const handleToggle = () => {
        setAdminSettings(prev => ({ ...prev, facultyCanEdit: !prev.facultyCanEdit }));
    };

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-gray-800">System Settings</h3>
            <div className="p-4 bg-sky-50/70 rounded-lg flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-800">Allow Faculty to Edit Student Details</p>
                    <p className="text-sm text-gray-600">When enabled, faculty can modify basic student profile information.</p>
                </div>
                <label className="flex items-center cursor-pointer">
                    <span className={`mr-3 font-medium ${!adminSettings.facultyCanEdit ? 'text-red-600' : 'text-gray-500'}`}>Disabled</span>
                    <div className="relative">
                        <input type="checkbox" checked={adminSettings.facultyCanEdit} onChange={handleToggle} className="sr-only" />
                        <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                        <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-transform ${adminSettings.facultyCanEdit ? 'transform translate-x-6 bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <span className={`ml-3 font-medium ${adminSettings.facultyCanEdit ? 'text-green-600' : 'text-gray-500'}`}>Enabled</span>
                </label>
            </div>
        </Card>
    );
};


// --- Main Admin Dashboard ---
const AdminDashboard: React.FC = () => {
    type View = 'students' | 'faculty' | 'applications' | 'menu' | 'fees' | 'reports' | 'settings';
    const [activeView, setActiveView] = useState<View>('fees');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Student | Faculty | null>(null);
    const [editingUserType, setEditingUserType] = useState<'student' | 'faculty' | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addUserType, setAddUserType] = useState<'student' | 'faculty' | null>(null);
    const { setStudents, setFaculty } = useData();

    const openEditModal = (user: Student | Faculty, type: 'student' | 'faculty') => {
        setEditingUser(user); setEditingUserType(type); setIsEditModalOpen(true);
    };
    const openAddModal = (type: 'student' | 'faculty') => {
        setAddUserType(type); setIsAddModalOpen(true);
    };
    const closeModal = () => {
        setIsEditModalOpen(false); setIsAddModalOpen(false);
    };

    const handleUpdateUser = (updatedUser: Student | Faculty) => {
        if (editingUserType === 'student') setStudents(prev => prev.map(s => s.id === updatedUser.id ? updatedUser as Student : s));
        else if (editingUserType === 'faculty') setFaculty(prev => prev.map(f => f.id === updatedUser.id ? updatedUser as Faculty : f));
        closeModal();
    };

    const tabs: { id: View, name: string, icon: React.ReactNode }[] = [
        { id: 'students', name: 'Students', icon: <Users size={18}/> },
        { id: 'faculty', name: 'Faculty', icon: <Users size={18}/> },
        { id: 'applications', name: 'Applications', icon: <ClipboardList size={18}/> },
        { id: 'menu', name: 'Hostel Menu', icon: <UtensilsCrossed size={18}/> },
        { id: 'fees', name: 'Fees', icon: <DollarSign size={18}/> },
        { id: 'reports', name: 'Reports', icon: <BarChart2 size={18}/> },
        { id: 'settings', name: 'Settings', icon: <Settings size={18}/> },
    ];

    return (
        <div className="space-y-6">
             <h2 className="text-3xl font-bold text-gray-800">Admin Control Panel</h2>
             <div className="bg-white/60 backdrop-blur-md rounded-xl p-2 flex flex-wrap gap-2">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`flex-1 flex justify-center items-center space-x-2 p-3 rounded-lg font-semibold transition-all duration-300 min-w-[120px] ${activeView === tab.id ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100/80'}`}>
                        {tab.icon}<span>{tab.name}</span>
                    </button>
                ))}
             </div>
             
             <div className="fade-in">
                {activeView === 'students' && <ManageStudents onAdd={() => openAddModal('student')} onEdit={(u) => openEditModal(u, 'student')} />}
                {activeView === 'faculty' && <ManageFaculty onAdd={() => openAddModal('faculty')} onEdit={(u) => openEditModal(u, 'faculty')} />}
                {activeView === 'applications' && <ViewAllApplications />}
                {activeView === 'menu' && <ManageHostelMenu />}
                {activeView === 'fees' && <ManageFees />}
                {activeView === 'reports' && <AdminReports />}
                {activeView === 'settings' && <AdminSettingsTab />}
             </div>

            {isEditModalOpen && <EditUserModal user={editingUser} userType={editingUserType} onClose={closeModal} onSave={handleUpdateUser} />}
            {isAddModalOpen && <AddUserModal userType={addUserType} onClose={closeModal} />}
        </div>
    );
};

// --- Modals (Edit/Add User) ---

const EditUserModal: React.FC<{
    user: Student | Faculty | null;
    userType: 'student' | 'faculty' | null;
    onClose: () => void;
    onSave: (user: Student | Faculty) => void;
}> = ({ user, userType, onClose, onSave }) => {
    const [formData, setFormData] = useState(user);
    if (!user || !userType) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); if (formData) onSave(formData);
    }
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <Card className="w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Edit {userType === 'student' ? 'Student' : 'Faculty'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} /></div>
                        {userType === 'student' && 'rollNumber' in formData && <div><label>Roll Number</label><input type="text" name="rollNumber" value={formData.rollNumber} disabled className={`${inputStyle} bg-gray-100/60`} /></div>}
                        {userType === 'student' && 'department' in formData && <div><label>Department</label><input type="text" name="department" value={formData.department} disabled className={`${inputStyle} bg-gray-100/60`} /></div>}
                        {userType === 'student' && 'batch' in formData && <div><label>Batch</label><input type="text" name="batch" value={formData.batch} onChange={handleChange} className={inputStyle} /></div>}
                        {userType === 'student' && 'academicYear' in formData && <div><label>Academic Year</label><input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} className={inputStyle} /></div>}
                        {userType === 'student' && 'contact' in formData && <div><label>Contact</label><input type="text" name="contact" value={formData.contact} onChange={handleChange} className={inputStyle} /></div>}
                        {userType === 'student' && 'cgpa' in formData && <div><label>CGPA</label><input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className={inputStyle} /></div>}
                        {userType === 'student' && 'studentType' in formData && <div><label>Student Type</label><select name="studentType" value={formData.studentType} onChange={handleChange} className={inputStyle}>{STUDENT_TYPE_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}</select></div>}
                        {userType === 'student' && 'address' in formData && <div className="md:col-span-2"><label>Address</label><textarea name="address" value={formData.address} onChange={handleChange} className={inputStyle} rows={2} /></div>}
                        {userType === 'faculty' && 'facultyId' in formData && <div><label>Faculty ID</label><input type="text" name="facultyId" value={formData.facultyId} onChange={handleChange} className={inputStyle} /></div>}
                        {userType === 'faculty' && 'department' in formData && <div><label>Department</label><input type="text" name="department" value={formData.department} onChange={handleChange} className={inputStyle} /></div>}
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const AddUserModal: React.FC<{
    userType: 'student' | 'faculty' | null,
    onClose: () => void;
}> = ({ userType, onClose }) => {
    const { setStudents, setStudentCreds, setFaculty, setFacultyCreds } = useData();
    const [formData, setFormData] = useState<any>({});
    const [password, setPassword] = useState('');
    if (!userType) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userType === 'student') {
            const newId = `s${Date.now()}`;
            const defaultFees: FeeItem[] = FEE_CATEGORIES.map(category => ({ type: category, amount: 0, status: 'Unpaid' as const }));
            const newStudent: Student = { id: newId, cgpa: 0, fees: defaultFees, ...formData };
            setStudents(prev => [...prev, newStudent]);
            setStudentCreds(prev => ({ ...prev, [newId]: password }));
        } else {
            const newId = `f${Date.now()}`;
            const newFaculty: Faculty = { id: newId, ...formData };
            setFaculty(prev => [...prev, newFaculty]);
            setFacultyCreds(prev => ({ ...prev, [newId]: password }));
        }
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
             <Card className="w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Add New {userType === 'student' ? 'Student' : 'Faculty'}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {userType === 'student' ? (
                        <>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div><label>Name</label><input required type="text" name="name" onChange={handleChange} className={inputStyle} /></div>
                                <div><label>Roll Number</label><input required type="text" name="rollNumber" onChange={handleChange} className={inputStyle} /></div>
                                <div><label>Department</label><input required type="text" name="department" onChange={handleChange} className={inputStyle} /></div>
                                <div><label>Batch</label><input required type="text" name="batch" onChange={handleChange} className={inputStyle} /></div>
                                <div><label>Academic Year</label><input required type="text" name="academicYear" onChange={handleChange} className={inputStyle} /></div>
                                <div><label>Email</label><input required type="email" name="email" onChange={handleChange} className={inputStyle} /></div>
                                <div><label>Contact No</label><input required type="text" name="contact" onChange={handleChange} className={inputStyle} /></div>
                                <div>
                                    <label>Student Type</label>
                                    <select required name="studentType" onChange={handleChange} className={inputStyle} defaultValue="">
                                        <option value="" disabled>Select Type</option>
                                        {STUDENT_TYPE_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2"><label>Address</label><textarea required name="address" onChange={handleChange} className={inputStyle} rows={2}></textarea></div>
                           </div>
                            <div><label>Set Initial Password</label><input required type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputStyle} /></div>
                        </>
                    ) : (
                         <>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div><label>Name</label><input required type="text" name="name" onChange={handleChange} className={inputStyle} /></div>
                                <div><label>Faculty ID</label><input required type="text" name="facultyId" onChange={handleChange} className={inputStyle} /></div>
                                <div><label>Department</label><input required type="text" name="department" onChange={handleChange} className={inputStyle} /></div>
                                <div><label>Email</label><input required type="email" name="email" onChange={handleChange} className={inputStyle} /></div>
                            </div>
                           <div><label>Set Initial Password</label><input required type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputStyle} /></div>
                        </>
                    )}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Add User</Button>
                    </div>
                </form>
             </Card>
        </div>
    )
}

const AdminDashboardPage: React.FC = () => {
    return (
        <DashboardLayout role={UserRole.ADMIN} title={"Admin Control Panel"}>
            <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
            </Routes>
        </DashboardLayout>
    );
};

export default AdminDashboardPage;
