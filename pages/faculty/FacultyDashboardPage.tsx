
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UserRole, Application, ApplicationStatus, Student, ApplicationType, Faculty, FeeItem } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CheckCircle, XCircle } from 'lucide-react';

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

const ApprovalModal: React.FC<{
    app: Application;
    newStatus: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED;
    onClose: () => void;
    onConfirm: (appId: string, newStatus: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED, remarks: string) => void;
}> = ({ app, newStatus, onClose, onConfirm }) => {
    const [remarks, setRemarks] = useState('');
    const actionText = newStatus === ApplicationStatus.APPROVED ? 'Approve' : 'Reject';
    const actionColor = newStatus === ApplicationStatus.APPROVED ? 'green' : 'red';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <Card className="w-full max-w-md">
                <h3 className={`text-xl font-bold mb-4 text-${actionColor}-600`}>{actionText} Application</h3>
                <p className="text-sm text-gray-600 mb-2">You are about to {actionText.toLowerCase()} the following request:</p>
                <div className="bg-gray-50/70 p-3 rounded-md border text-sm mb-4">
                    <p><strong>Student:</strong> {app.studentName}</p>
                    <p><strong>Type:</strong> {app.type}</p>
                    <p><strong>Reason:</strong> {app.reason}</p>
                </div>
                 <div>
                    <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
                    <textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} className={inputStyle}></textarea>
                </div>
                 <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => onConfirm(app.id, newStatus, remarks)} variant={newStatus === ApplicationStatus.APPROVED ? 'primary' : 'danger'}>
                        Confirm {actionText}
                    </Button>
                </div>
            </Card>
        </div>
    )
}

const ApprovalDashboard: React.FC = () => {
    const { applications, setApplications } = useData();
    const { user } = useAuth();
    const facultyUser = user as Faculty;

    const pendingApps = applications.filter(app => app.status === ApplicationStatus.PENDING && (app.department === facultyUser.department || app.facultyAssignedId === facultyUser.id));
    const [modalData, setModalData] = useState<{ app: Application, newStatus: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED } | null>(null);

    const handleApproval = (appId: string, newStatus: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED, remarks: string) => {
        setApplications(prev => prev.map(app => 
            app.id === appId ? { ...app, status: newStatus, remarks, facultyActionById: facultyUser.id } : app
        ));
        setModalData(null);
    };

    return (
        <>
            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Pending Student Requests ({facultyUser.department})</h2>
                {pendingApps.length === 0 ? (
                    <p className="text-gray-600">No pending requests from your department at the moment.</p>
                ) : (
                    <div className="space-y-4">
                        {pendingApps.map(app => (
                            <div key={app.id} className="p-4 border border-gray-200/80 rounded-lg flex flex-col md:flex-row justify-between md:items-center bg-white/50">
                                <div className="mb-4 md:mb-0">
                                    <p className="font-semibold text-gray-800">{app.studentName} <span className="text-gray-500 font-normal">({app.studentRollNumber})</span></p>
                                    <p className="text-sm text-gray-600">Type: <strong>{app.type}</strong></p>
                                    <p className="text-sm text-gray-600">Reason: {app.reason}</p>
                                    <p className="text-sm text-gray-600">Dates: {app.dates}</p>
                                    {app.remarks && <p className="text-sm text-gray-500 mt-1">Previous Remarks: {app.remarks}</p>}
                                </div>
                                <div className="flex space-x-2 self-start md:self-center">
                                    <Button onClick={() => setModalData({ app, newStatus: ApplicationStatus.APPROVED })} variant="primary" className="bg-green-600 hover:bg-green-700">Approve</Button>
                                    <Button onClick={() => setModalData({ app, newStatus: ApplicationStatus.REJECTED })} variant="danger">Reject</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
            {modalData && <ApprovalModal app={modalData.app} newStatus={modalData.newStatus} onClose={() => setModalData(null)} onConfirm={handleApproval} />}
        </>
    );
};

const StudentListPage: React.FC = () => {
    const { students, setStudents, adminSettings } = useData();
    const { user } = useAuth();
    const facultyUser = user as Faculty;
    const departmentStudents = students.filter(s => s.department === facultyUser.department);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<Student>>({});

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        setIsEditing(false);
        setEditFormData(student);
    };

    const handleEditToggle = () => {
        if (!selectedStudent) return;
        if (isEditing) {
            setEditFormData(selectedStudent);
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        if (!selectedStudent) return;
        setStudents(prev => 
            prev.map(s => s.id === selectedStudent.id ? { ...s, ...editFormData } : s)
        );
        setSelectedStudent(prev => prev ? { ...prev, ...editFormData } as Student : null);
        setIsEditing(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Students ({facultyUser.department})</h2>
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                    {departmentStudents.map(s => (
                        <li key={s.id} onClick={() => handleSelectStudent(s)} className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedStudent?.id === s.id ? 'bg-green-100/80' : 'hover:bg-gray-100/70'}`}>
                            <p className="font-semibold text-gray-800">{s.name}</p>
                            <p className="text-sm text-gray-500">{s.rollNumber}</p>
                        </li>
                    ))}
                </ul>
            </Card>
            <Card className="lg:col-span-2">
                 <h2 className="text-xl font-bold mb-4 text-gray-800 flex justify-between items-center">
                    <span>Student Details</span>
                    {selectedStudent && adminSettings.facultyCanEdit && (
                         <Button onClick={handleEditToggle} variant="secondary" size="sm">{isEditing ? 'Cancel' : 'Edit Profile'}</Button>
                    )}
                 </h2>
                 {selectedStudent ? (
                    isEditing ? (
                        <div className="space-y-3">
                             <div><label className="text-sm font-semibold text-gray-700">Name</label><input name="name" value={editFormData.name || ''} onChange={handleInputChange} className={inputStyle} /></div>
                             <p><strong>Register Number:</strong> {selectedStudent.rollNumber} (read-only)</p>
                             <p><strong>Department:</strong> {selectedStudent.department} (read-only)</p>
                             <div><label className="text-sm font-semibold text-gray-700">Batch</label><input name="batch" value={editFormData.batch || ''} onChange={handleInputChange} className={inputStyle} /></div>
                             <div><label className="text-sm font-semibold text-gray-700">Academic Year</label><input name="academicYear" value={editFormData.academicYear || ''} onChange={handleInputChange} className={inputStyle} /></div>
                             <div><label className="text-sm font-semibold text-gray-700">Contact</label><input name="contact" value={editFormData.contact || ''} onChange={handleInputChange} className={inputStyle} /></div>
                             <div><label className="text-sm font-semibold text-gray-700">Address</label><textarea name="address" value={editFormData.address || ''} onChange={handleInputChange} className={inputStyle} rows={2}></textarea></div>
                             <p><strong>Email:</strong> {selectedStudent.email} (read-only)</p>
                             <p><strong>Student Type:</strong> <span className="font-semibold text-sky-700">{selectedStudent.studentType}</span> (read-only)</p>
                             <div className="flex justify-end space-x-2 pt-4">
                                <Button onClick={handleSaveChanges}>Save Changes</Button>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-3 text-gray-700">
                            <p><strong>Name:</strong> {selectedStudent.name}</p>
                            <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
                            <p><strong>Batch:</strong> {selectedStudent.batch}</p>
                            <p><strong>Academic Year:</strong> {selectedStudent.academicYear}</p>
                            <p><strong>Department:</strong> {selectedStudent.department}</p>
                            <p><strong>Contact:</strong> {selectedStudent.contact}</p>
                            <p><strong>Address:</strong> {selectedStudent.address}</p>
                            <p><strong>Email:</strong> {selectedStudent.email}</p>
                            <p><strong>CGPA:</strong> {selectedStudent.cgpa}</p>
                            <p><strong>Student Type:</strong> <span className="font-semibold text-sky-700">{selectedStudent.studentType}</span></p>
                            <p><strong>Career Path:</strong> <span className="font-semibold text-green-700">{selectedStudent.careerPath || 'Not Selected'}</span></p>
                        </div>
                    )
                 ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select a student from your department to view details.</p>
                    </div>
                 )}
            </Card>
        </div>
    );
}

const FeeDetailsModal: React.FC<{ student: Student, onClose: () => void }> = ({ student, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <Card className="w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Fee Details for {student.name}</h3>
            <div className="space-y-2">
                {(student.fees || []).map(fee => (
                    <div key={fee.type} className="flex justify-between p-2 bg-gray-50/70 rounded-md">
                        <span className="text-gray-700">{fee.type}</span>
                        <div>
                             <span className="text-gray-800 font-semibold mr-4">₹{fee.amount.toLocaleString()}</span>
                            {fee.status === 'Paid' ? (
                                <span className="text-green-600 font-semibold">Paid</span>
                            ) : (
                                <span className="text-red-600 font-semibold">Unpaid</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
             <div className="flex justify-end mt-6">
                <Button onClick={onClose} variant="secondary">Close</Button>
            </div>
        </Card>
    </div>
);

const FacultyFeesView: React.FC = () => {
    const { students } = useData();
    const { user } = useAuth();
    const facultyUser = user as Faculty;
    const departmentStudents = students.filter(s => s.department === facultyUser.department);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const studentFeeSummaries = departmentStudents.map(student => {
        const fees = student.fees || [];
        const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
        const paid = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
        return { ...student, total, paid, due: total - paid };
    });

    return (
        <>
        <Card>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Student Fee Status ({facultyUser.department})</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/70 border-b">
                            <th className="p-3 font-semibold text-gray-700">Name</th>
                            <th className="p-3 font-semibold text-gray-700">Roll Number</th>
                            <th className="p-3 font-semibold text-gray-700">Total Fees</th>
                            <th className="p-3 font-semibold text-gray-700">Amount Paid</th>
                            <th className="p-3 font-semibold text-gray-700">Dues</th>
                            <th className="p-3 font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentFeeSummaries.length > 0 ? studentFeeSummaries.map(s => (
                            <tr key={s.id} className="border-b border-gray-200/80 hover:bg-gray-50/50">
                                <td className="p-3 text-gray-700">{s.name}</td>
                                <td className="p-3 text-gray-700">{s.rollNumber}</td>
                                <td className="p-3 text-gray-700">₹{s.total.toLocaleString()}</td>
                                <td className="p-3 text-green-600">₹{s.paid.toLocaleString()}</td>
                                <td className="p-3 text-red-600 font-semibold">₹{s.due.toLocaleString()}</td>
                                <td className="p-3"><Button variant="secondary" onClick={() => setSelectedStudent(s)}>View Details</Button></td>
                            </tr>
                        )) : (
                             <tr>
                                <td colSpan={6} className="text-center p-4 text-gray-500">No students found in your department.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
        {selectedStudent && <FeeDetailsModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
        </>
    );
}

const FacultyDashboardPage: React.FC = () => {
    const location = useLocation();
    const pathParts = location.pathname.split('/');
    const currentView = pathParts[pathParts.length - 1];

    const pageTitles: { [key: string]: string } = {
        'dashboard': 'Approval Dashboard',
        'students': 'Student Information',
        'student-fees': 'Student Fee Status',
    };
    
    const title = pageTitles[currentView] || 'Faculty Dashboard';

    return (
        <DashboardLayout role={UserRole.FACULTY} title={title}>
            <Routes>
                <Route path="dashboard" element={<ApprovalDashboard />} />
                <Route path="students" element={<StudentListPage />} />
                <Route path="student-fees" element={<FacultyFeesView />} />
            </Routes>
        </DashboardLayout>
    );
};

export default FacultyDashboardPage;
