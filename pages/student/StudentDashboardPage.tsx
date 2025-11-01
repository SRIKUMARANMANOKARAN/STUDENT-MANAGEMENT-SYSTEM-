

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UserRole, Student, Application, ApplicationStatus, ApplicationType, CareerPath, CAREER_PATH_OPTIONS, FeeItem, PaymentMode } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { UtensilsCrossed, CheckCircle, XCircle, Clock, FileText, Download, QrCode, Landmark, Banknote } from 'lucide-react';

const inputStyle = "mt-1 block w-full p-2 border border-gray-300/50 rounded-md shadow-sm bg-white/50 focus:ring-green-500 focus:border-green-500 transition-all";

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

const DashboardHome: React.FC = () => {
    const { user } = useAuth();
    const { applications } = useData();
    const studentApps = applications.filter(app => app.studentId === user?.id).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    const pendingCount = studentApps.filter(app => app.status === ApplicationStatus.PENDING).length;
    const approvedCount = studentApps.filter(app => app.status === ApplicationStatus.APPROVED).length;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-700">Total Applications</h3>
                    <p className="text-4xl font-bold text-green-600">{studentApps.length}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
                    <p className="text-4xl font-bold text-amber-500">{pendingCount}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-700">Approved Requests</h3>
                    <p className="text-4xl font-bold text-emerald-500">{approvedCount}</p>
                </Card>
            </div>

            <Card>
                <h3 className="text-xl font-bold mb-4 text-gray-800">My Recent Applications</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/70 border-b">
                                <th className="p-3 font-semibold text-gray-700">App ID</th>
                                <th className="p-3 font-semibold text-gray-700">Type</th>
                                <th className="p-3 font-semibold text-gray-700">Date Submitted</th>
                                <th className="p-3 font-semibold text-gray-700">Purpose</th>
                                <th className="p-3 font-semibold text-gray-700">Status</th>
                                <th className="p-3 font-semibold text-gray-700">Faculty Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentApps.length > 0 ? studentApps.slice(0, 5).map(app => (
                                <tr key={app.id} className="border-b border-gray-200/80 hover:bg-gray-50/50">
                                    <td className="p-3 text-gray-600 font-mono text-xs">{app.id.slice(-6)}</td>
                                    <td className="p-3 text-gray-700 font-semibold">{app.type}</td>
                                    <td className="p-3 text-gray-700">{new Date(app.submittedAt).toLocaleDateString()}</td>
                                    <td className="p-3 truncate max-w-xs text-gray-700">{app.reason}</td>
                                    <td className="p-3"><StatusBadge status={app.status} /></td>
                                    <td className="p-3 text-gray-600 italic">{app.remarks || 'No remarks yet'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-gray-500">You have not submitted any applications yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const student = user as Student;

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                    <div><p className="font-semibold text-gray-600">Name:</p><p className="text-gray-800">{student.name}</p></div>
                    <div><p className="font-semibold text-gray-600">Register Number:</p><p className="text-gray-800">{student.rollNumber}</p></div>
                    <div><p className="font-semibold text-gray-600">Department:</p><p className="text-gray-800">{student.department}</p></div>
                    <div><p className="font-semibold text-gray-600">Batch:</p><p className="text-gray-800">{student.batch}</p></div>
                    <div><p className="font-semibold text-gray-600">Academic Year:</p><p className="text-gray-800">{student.academicYear}</p></div>
                    <div><p className="font-semibold text-gray-600">Student Type:</p><p className="text-gray-800 font-medium text-sky-700">{student.studentType}</p></div>
                    <div><p className="font-semibold text-gray-600">Email ID:</p><p className="text-gray-800">{student.email}</p></div>
                    <div><p className="font-semibold text-gray-600">Contact No:</p><p className="text-gray-800">{student.contact}</p></div>
                    <div className="md:col-span-2"><p className="font-semibold text-gray-600">Address:</p><p className="text-gray-800">{student.address}</p></div>
                </div>
                 <div className="pt-4 border-t mt-4">
                     <p className="text-sm text-gray-500 italic">Profile information is read-only. Please contact the admin or faculty (if permitted) for any changes.</p>
                </div>
            </div>
        </Card>
    );
}

const OnDutyApplicationForm: React.FC = () => {
    const { user } = useAuth();
    const { faculty, setApplications } = useData();
    const [dates, setDates] = React.useState('');
    const [reason, setReason] = React.useState('');
    const [selectedFaculty, setSelectedFaculty] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const student = user as Student;
        const newApp: Application = {
            id: `app${Date.now()}`,
            studentId: student.id,
            studentName: student.name,
            studentRollNumber: student.rollNumber,
            type: ApplicationType.ON_DUTY,
            status: ApplicationStatus.PENDING,
            reason: reason,
            dates: dates,
            facultyAssignedId: selectedFaculty,
            submittedAt: new Date().toISOString(),
            department: student.department,
        };
        setApplications(prev => [newApp, ...prev]);
        setDates('');
        setReason('');
        setSelectedFaculty('');
        setSuccessMessage('On-Duty application submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };
    
    return (
         <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">On-Duty Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 {successMessage && <div className="p-3 bg-green-100/80 text-green-800 font-semibold rounded-md">{successMessage}</div>}
                 <div><label className="block font-medium text-gray-700">Date/Duration</label><input type="text" value={dates} onChange={e => setDates(e.target.value)} required className={inputStyle} /></div>
                 <div><label className="block font-medium text-gray-700">Reason/Purpose</label><textarea value={reason} onChange={e => setReason(e.target.value)} required rows={3} className={inputStyle}></textarea></div>
                 <div>
                    <label className="block font-medium text-gray-700">Faculty Selection</label>
                    <select value={selectedFaculty} onChange={e => setSelectedFaculty(e.target.value)} required className={inputStyle}>
                        <option value="">Select a faculty member</option>
                        {faculty.map(f => <option key={f.id} value={f.id}>{f.name} - {f.department}</option>)}
                    </select>
                </div>
                 <div className="flex justify-end space-x-2"><Button type="button" variant="secondary">Cancel</Button><Button type="submit">Submit</Button></div>
            </form>
        </Card>
    )
}

const LeaveApplicationForm: React.FC = () => {
    const { user } = useAuth();
    const { setApplications } = useData();
    const [dates, setDates] = React.useState('');
    const [purpose, setPurpose] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const student = user as Student;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newApp: Application = {
            id: `app${Date.now()}`,
            studentId: student.id,
            studentName: student.name,
            studentRollNumber: student.rollNumber,
            type: ApplicationType.LEAVE,
            status: ApplicationStatus.PENDING,
            reason: purpose,
            dates: dates,
            batch: student.batch,
            academicYear: student.academicYear,
            submittedAt: new Date().toISOString(),
            department: student.department,
        };
        setApplications(prev => [newApp, ...prev]);
        setDates('');
        setPurpose('');
        setSuccessMessage('Leave application submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
         <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Leave Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 {successMessage && <div className="p-3 bg-green-100/80 text-green-800 font-semibold rounded-md">{successMessage}</div>}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label className="block font-medium text-gray-700">Batch</label><input type="text" value={student.batch} readOnly className="mt-1 block w-full p-2 border border-gray-300/50 rounded-md shadow-sm bg-gray-100/60" /></div>
                     <div><label className="block font-medium text-gray-700">Academic Year</label><input type="text" value={student.academicYear} readOnly className="mt-1 block w-full p-2 border border-gray-300/50 rounded-md shadow-sm bg-gray-100/60" /></div>
                 </div>
                 <div><label className="block font-medium text-gray-700">Date/Duration</label><input type="text" value={dates} onChange={e => setDates(e.target.value)} required className={inputStyle} /></div>
                 <div><label className="block font-medium text-gray-700">Purpose</label><textarea value={purpose} onChange={e => setPurpose(e.target.value)} required rows={3} className={inputStyle}></textarea></div>
                 <div className="flex justify-end space-x-2"><Button type="button" variant="secondary">Cancel</Button><Button type="submit">Submit</Button></div>
            </form>
        </Card>
    )
}

const BonafideApplicationForm: React.FC = () => {
    const { user } = useAuth();
    const { setApplications } = useData();
    const [issueDate, setIssueDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const student = user as Student;
        const newApp: Application = {
            id: `app${Date.now()}`,
            studentId: student.id,
            studentName: student.name,
            studentRollNumber: student.rollNumber,
            type: ApplicationType.BONAFIDE,
            status: ApplicationStatus.PENDING,
            reason: description,
            dates: issueDate,
            submittedAt: new Date().toISOString(),
            department: student.department,
        };
        setApplications(prev => [newApp, ...prev]);
        setDescription('');
        setIssueDate(new Date().toISOString().split('T')[0]);
        setSuccessMessage('Bonafide certificate request submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Bonafide Certificate Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 {successMessage && <div className="p-3 bg-green-100/80 text-green-800 font-semibold rounded-md">{successMessage}</div>}
                 <div><label className="block font-medium text-gray-700">Description (Need for Bonafide)</label><textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className={inputStyle}></textarea></div>
                 <div><label className="block font-medium text-gray-700">Issue Date</label><input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} required className={inputStyle} /></div>
                 <div className="flex justify-end space-x-2"><Button type="button" variant="secondary">Cancel</Button><Button type="submit">Submit</Button></div>
            </form>
        </Card>
    );
}

const ViewAllApplicationsPage: React.FC = () => {
    const { user } = useAuth();
    const { applications } = useData();
    const studentApps = applications.filter(app => app.studentId === user?.id).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">All My Submitted Applications</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/70 border-b">
                            <th className="p-3 font-semibold text-gray-700">App ID</th>
                            <th className="p-3 font-semibold text-gray-700">Type</th>
                            <th className="p-3 font-semibold text-gray-700">Date Submitted</th>
                            <th className="p-3 font-semibold text-gray-700">Purpose/Reason</th>
                            <th className="p-3 font-semibold text-gray-700">Status</th>
                            <th className="p-3 font-semibold text-gray-700">Faculty Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentApps.length > 0 ? studentApps.map(app => (
                            <tr key={app.id} className="border-b border-gray-200/80 hover:bg-gray-50/50">
                                <td className="p-3 text-gray-600 font-mono text-xs">{app.id.slice(-6)}</td>
                                <td className="p-3 text-gray-700 font-semibold">{app.type}</td>
                                <td className="p-3 text-gray-700">{new Date(app.submittedAt).toLocaleDateString()}</td>
                                <td className="p-3 truncate max-w-xs text-gray-700">{app.reason}</td>
                                <td className="p-3"><StatusBadge status={app.status} /></td>
                                <td className="p-3 text-gray-600 italic">{app.remarks || 'No remarks yet'}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center p-4 text-gray-500">You have not submitted any applications yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

const HostelMenuPage: React.FC = () => {
    const { hostelMenu } = useData();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center"><UtensilsCrossed className="mr-2" /> Weekly Hostel Menu</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-green-50/70 border-b">
                            <th className="p-3 font-semibold text-gray-700">Day</th>
                            <th className="p-3 font-semibold text-gray-700">Breakfast</th>
                            <th className="p-3 font-semibold text-gray-700">Lunch</th>
                            <th className="p-3 font-semibold text-gray-700">Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => (
                            <tr key={day} className="border-b border-gray-200/80 hover:bg-gray-50/50">
                                <td className="p-3 font-semibold text-gray-800">{day}</td>
                                <td className="p-3 text-gray-700">{hostelMenu[day]?.breakfast || '-'}</td>
                                <td className="p-3 text-gray-700">{hostelMenu[day]?.lunch || '-'}</td>
                                <td className="p-3 text-gray-700">{hostelMenu[day]?.dinner || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

const PaymentModal: React.FC<{
    feeItem: FeeItem;
    onClose: () => void;
    onConfirm: (feeItem: FeeItem, mode: PaymentMode) => void;
}> = ({ feeItem, onClose, onConfirm }) => {
    const [paymentMode, setPaymentMode] = React.useState<PaymentMode>('GPay/UPI');
    const paymentModes = [
        { id: 'GPay/UPI', name: 'UPI / QR', icon: <QrCode/> },
        { id: 'Net Banking', name: 'Net Banking', icon: <Landmark/> },
        { id: 'Bank Transfer', name: 'Bank Transfer', icon: <Banknote/> }
    ] as const;


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <Card className="w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Complete Your Payment</h3>
                <div className="mb-4 p-3 bg-sky-50/70 rounded-lg">
                    <p className="text-gray-600">Paying for: <span className="font-semibold text-gray-800">{feeItem.type}</span></p>
                    <p className="text-gray-600">Amount: <span className="font-semibold text-2xl text-green-600">₹{feeItem.amount.toLocaleString()}</span></p>
                </div>
                
                <div className="flex border-b my-4">
                    {paymentModes.map(mode => (
                        <button key={mode.id} onClick={() => setPaymentMode(mode.id)} className={`flex items-center space-x-2 px-4 py-2 font-semibold transition-colors ${paymentMode === mode.id ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>
                            {mode.icon}<span>{mode.name}</span>
                        </button>
                    ))}
                </div>

                <div className="rounded-md min-h-[180px] flex flex-col justify-center">
                    {paymentMode === 'GPay/UPI' && (
                        <div className="bg-white rounded-lg p-6 shadow-inner flex flex-col items-center w-full">
                            <div className="flex items-center self-start space-x-3 mb-4">
                                <img 
                                    src="https://api.dicebear.com/8.x/initials/svg?seed=Sri%20Kumaran&backgroundColor=fbbf24" 
                                    alt="Recipient Avatar" 
                                    className="w-10 h-10 rounded-full" 
                                />
                                <span className="text-xl font-semibold text-gray-800">Sri Kumaran</span>
                            </div>
                            <div className="relative w-[200px] h-[200px] mx-auto">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=srikumaransri06@oksbi&pn=Sri%20Kumaran&am=${feeItem.amount}&q=H`} alt="QR Code" className="rounded-lg" />
                                <img src="https://www.gstatic.com/images/branding/product/2x/gpay_logomark_64dp.png" alt="GPay Logo" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full p-1 border shadow-md" />
                            </div>
                            <p className="text-md text-gray-600 mt-4">UPI ID: <span className="font-semibold text-gray-800">srikumaransri06@oksbi</span></p>
                        </div>
                    )}
                    {paymentMode === 'Net Banking' && (
                        <div className="p-4 bg-gray-50/70 rounded-md">
                            <p className="font-semibold mb-2">Select your bank (simulation)</p>
                            <select className={inputStyle}><option>HDFC Bank</option><option>ICICI Bank</option><option>State Bank of India</option></select>
                            <p className="text-xs text-gray-500 mt-2">You will be redirected to the bank's secure portal to complete the payment.</p>
                        </div>
                    )}
                    {paymentMode === 'Bank Transfer' && (
                        <div className="text-sm p-4 bg-gray-50/70 rounded-md">
                            <p className="font-semibold mb-2">Bank Account Details for NEFT/RTGS</p>
                            <p><strong>Account Name:</strong> MKCE College</p>
                            <p><strong>Account Number:</strong> 1234567890123</p>
                            <p><strong>IFSC Code:</strong> HDFC0001234</p>
                            <p><strong>Bank Name:</strong> HDFC Bank, Karur</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-2 pt-6">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel Payment</Button>
                    <Button onClick={() => onConfirm(feeItem, paymentMode)}>Confirm Payment</Button>
                </div>
            </Card>
        </div>
    )
};

const ReceiptModal: React.FC<{
    feeItem: FeeItem;
    student: Student;
    onClose: () => void;
}> = ({ feeItem, student, onClose }) => {
    return (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="printable-area w-full max-w-lg">
                <Card>
                    <div className="text-center mb-4">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                        <h3 className="text-2xl font-bold mt-2 text-gray-800">Payment Successful!</h3>
                        <p className="text-gray-600">Your payment receipt has been generated.</p>
                    </div>
                    <div className="p-4 bg-sky-50/70 rounded-lg border border-sky-200/80 text-sm space-y-2">
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Student Name:</span><span>{student.name}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Fee Type:</span><span>{feeItem.type}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Amount Paid:</span><span className="font-bold text-lg">₹{feeItem.amount.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Payment Date:</span><span>{feeItem.paymentDate}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Payment Mode:</span><span>{feeItem.paymentMode}</span></div>
                        <div className="flex justify-between"><span className="font-semibold text-gray-600">Transaction ID:</span><span className="font-mono text-xs">{feeItem.transactionId}</span></div>
                    </div>
                    <div className="flex justify-center space-x-2 pt-6 no-print">
                        <Button variant="secondary" onClick={() => window.print()}><Download size={16} className="mr-2"/>Download Receipt</Button>
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
};

const FeesPage: React.FC = () => {
    const { user } = useAuth();
    const { students, setStudents, feesSettings } = useData();
    const student = students.find(s => s.id === user?.id) as Student;
    
    const [payingFee, setPayingFee] = React.useState<FeeItem | null>(null);
    const [receipt, setReceipt] = React.useState<FeeItem | null>(null);

    const handleConfirmPayment = (feeItem: FeeItem, mode: PaymentMode) => {
        const updatedFee = {
            ...feeItem,
            status: 'Paid' as const,
            paymentDate: new Date().toLocaleDateString('en-CA'),
            transactionId: `TXN${Date.now()}`,
            paymentMode: mode
        };

        setStudents(prevStudents => prevStudents.map(s => {
            if (s.id === student.id) {
                return {
                    ...s,
                    fees: s.fees.map(f => f.type === feeItem.type ? updatedFee : f)
                }
            }
            return s;
        }));
        
        setPayingFee(null);
        setReceipt(updatedFee);
    };

    const studentFees = (student.fees || []).filter(fee => {
        if (student.studentType === 'Day Scholar') {
            return fee.type !== 'Hostel' && fee.type !== 'Mess';
        }
        if (student.studentType === 'Hosteller') {
            return fee.type !== 'Bus';
        }
        return true;
    });
    
    const totalAssigned = studentFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalPaid = student.fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
    const totalPending = student.fees.reduce((sum, f) => sum + f.amount, 0) - totalPaid;

    return (
        <>
            <Card>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">My Fee Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-sky-100/70 rounded-lg text-center">
                        <p className="text-sm font-semibold text-sky-800">Total Fees Assigned</p>
                        <p className="text-3xl font-bold text-sky-600">₹{student.fees.reduce((sum, fee) => sum + fee.amount, 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-green-100/70 rounded-lg text-center">
                        <p className="text-sm font-semibold text-green-800">Total Paid</p>
                        <p className="text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
                    </div>
                     <div className="p-4 bg-red-100/70 rounded-lg text-center">
                        <p className="text-sm font-semibold text-red-800">Total Pending</p>
                        <p className="text-3xl font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
                    </div>
                </div>

                {!feesSettings.paymentsEnabled && (
                     <div className="text-center p-3 mb-6 bg-red-100/70 rounded-md">
                        <div className="flex items-center justify-center text-red-600">
                            <XCircle size={20} className="mr-2" />
                            <p className="font-bold">Payment Closed</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Admin has currently disabled payments.</p>
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead>
                            <tr className="bg-gray-50/70 border-b">
                                <th className="p-3 font-semibold text-gray-700">Fee Type</th>
                                <th className="p-3 font-semibold text-gray-700">Amount (₹)</th>
                                <th className="p-3 font-semibold text-gray-700">Payment Status</th>
                                <th className="p-3 font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentFees.map(fee => (
                                <tr key={fee.type} className="border-b border-gray-200/80 hover:bg-gray-50/50">
                                    <td className="p-3 font-semibold text-gray-800">{fee.type}</td>
                                    <td className="p-3 text-gray-700">{fee.amount.toLocaleString()}</td>
                                    <td className="p-3">
                                        {fee.status === 'Paid' ? (
                                            <div className="flex items-center text-green-600"><CheckCircle size={16} className="mr-1" /> Paid</div>
                                        ) : (
                                             <div className="flex items-center text-red-600"><XCircle size={16} className="mr-1" /> Unpaid</div>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {fee.status === 'Unpaid' ? (
                                            feesSettings.paymentsEnabled ? (
                                                <Button onClick={() => setPayingFee(fee)} size="sm">Pay Now</Button>
                                            ) : (
                                                <span className="text-xs text-gray-500 italic">Disabled</span>
                                            )
                                        ) : (
                                            <Button variant="secondary" size="sm" onClick={() => setReceipt(fee)}><FileText size={14} className="mr-1" /> View Receipt</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100/80 border-t-2 border-gray-300/80">
                                <td className="p-3 font-bold text-gray-800">Total Fees</td>
                                <td className="p-3 font-bold text-gray-800">₹{totalAssigned.toLocaleString()}</td>
                                <td className="p-3" colSpan={2}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>
            {payingFee && <PaymentModal feeItem={payingFee} onClose={() => setPayingFee(null)} onConfirm={handleConfirmPayment} />}
            {receipt && <ReceiptModal feeItem={receipt} student={student} onClose={() => setReceipt(null)} />}
        </>
    );
};

const CareerPathPage: React.FC = () => {
    const { user } = useAuth();
    const { students, setStudents } = useData();
    const student = user as Student;
    const [selectedPath, setSelectedPath] = React.useState<CareerPath | undefined>(student.careerPath);
    const [successMessage, setSuccessMessage] = React.useState('');

    const handleSave = () => {
        setStudents(prev => prev.map(s => s.id === student.id ? {...s, careerPath: selectedPath} : s));
        setSuccessMessage('Career path updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };
    
    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose Your Career Path</h2>
            <p className="text-gray-600 mb-6">Let us know your career aspirations to help us guide you better.</p>
             {successMessage && <div className="mb-4 p-3 bg-green-100/80 text-green-800 font-semibold rounded-md">{successMessage}</div>}
            <div className="space-y-3">
                {CAREER_PATH_OPTIONS.map(path => (
                    <label key={path} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedPath === path ? 'bg-green-100/80 border-green-300' : 'bg-white/60 border-gray-200/80 hover:bg-gray-50/70'}`}>
                        <input type="radio" name="careerPath" value={path} checked={selectedPath === path} onChange={() => setSelectedPath(path)} className="h-5 w-5 text-green-600 focus:ring-green-500" />
                        <span className={`ml-3 font-semibold ${selectedPath === path ? 'text-green-800' : 'text-gray-700'}`}>{path}</span>
                    </label>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} disabled={!selectedPath}>Save Selection</Button>
            </div>
        </Card>
    );
}

const ChangePasswordPage: React.FC = () => {
    const { changePassword } = useAuth();
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (changePassword(oldPassword, newPassword)) {
            setSuccess("Password changed successfully!");
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setError("Incorrect old password.");
        }
    };
    
    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Change Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                {error && <p className="text-red-500 bg-red-100/70 p-3 rounded-md">{error}</p>}
                {success && <p className="text-green-800 bg-green-100/70 p-3 rounded-md">{success}</p>}
                 <div><label className="block font-medium text-gray-700">Old Password</label><input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className={inputStyle} /></div>
                 <div><label className="block font-medium text-gray-700">New Password</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className={inputStyle} /></div>
                 <div><label className="block font-medium text-gray-700">Confirm New Password</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className={inputStyle} /></div>
                 <div className="flex justify-end"><Button type="submit">Update Password</Button></div>
            </form>
        </Card>
    );
}

const StudentDashboardPage: React.FC = () => {
    const location = useLocation();
    const pathParts = location.pathname.split('/');
    const currentView = pathParts[pathParts.length - 1];

    const pageTitles: { [key: string]: string } = {
        'dashboard': 'Student Dashboard',
        'profile': 'My Profile',
        'on-duty': 'On-Duty Application',
        'leave': 'Leave Application',
        'bonafide': 'Bonafide Certificate',
        'applications': 'My Applications',
        'career-path': 'Career Path Selection',
        'change-password': 'Change Password',
        'hostel-menu': 'Hostel Food Menu',
        'fees': 'Fees Payment',
    };
    
    const title = pageTitles[currentView] || 'Student Dashboard';

    return (
        <DashboardLayout role={UserRole.STUDENT} title={title}>
            <Routes>
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="on-duty" element={<OnDutyApplicationForm />} />
                <Route path="leave" element={<LeaveApplicationForm />} />
                <Route path="bonafide" element={<BonafideApplicationForm />} />
                <Route path="applications" element={<ViewAllApplicationsPage />} />
                <Route path="hostel-menu" element={<HostelMenuPage />} />
                <Route path="fees" element={<FeesPage />} />
                <Route path="career-path" element={<CareerPathPage />} />
                <Route path="change-password" element={<ChangePasswordPage />} />
            </Routes>
        </DashboardLayout>
    );
};

export default StudentDashboardPage;
