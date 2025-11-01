
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import FacultyDashboardPage from './pages/faculty/FacultyDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { UserRole } from './types';

const App: React.FC = () => {
    return (
        <div className="fade-in">
            <DataProvider>
                <AuthProvider>
                    <HashRouter>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/student/login" element={<LoginPage role={UserRole.STUDENT} />} />
                            <Route path="/faculty/login" element={<LoginPage role={UserRole.FACULTY} />} />
                            <Route path="/admin/login" element={<LoginPage role={UserRole.ADMIN} />} />
                            
                            <Route path="/student/*" element={
                                <PrivateRoute role={UserRole.STUDENT}>
                                    <StudentDashboardPage />
                                </PrivateRoute>
                            } />

                            <Route path="/faculty/*" element={
                                <PrivateRoute role={UserRole.FACULTY}>
                                    <FacultyDashboardPage />
                                </PrivateRoute>
                            } />

                             <Route path="/admin/*" element={
                                <PrivateRoute role={UserRole.ADMIN}>
                                    <AdminDashboardPage />
                                </PrivateRoute>
                            } />

                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </HashRouter>
                </AuthProvider>
            </DataProvider>
        </div>
    );
};

interface PrivateRouteProps {
  children: React.ReactElement;
  role: UserRole;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
    const { user, userRole } = useAuth();
    if (!user || userRole !== role) {
        return <Navigate to={`/${role}/login`} />;
    }
    return children;
};


export default App;
