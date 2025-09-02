// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import HMDashboardPage from '../pages/HMDashboardPage';
import DemandDetailPage from '../pages/DemandDetailPage';
import InterviewerDashboardPage from '../pages/InterviewerDashboardPage'; // 1. Import renamed component
import FeedbackPage from '../pages/FeedbackPage';
import UserManagementPage from '../pages/admin/UserManagementPage';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ... other routes ... */}
                <Route path="/interviewer/assignments" element={<ProtectedRoute><MainLayout><InterviewerDashboardPage /></MainLayout></ProtectedRoute>} /> // 2. Route now renders the new dashboard
                {/* ... other routes ... */}

                {/* --- Full code for completeness --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/hm/dashboard" element={<ProtectedRoute><MainLayout><HMDashboardPage /></MainLayout></ProtectedRoute>} />
                <Route path="/hm/demands/:demandId" element={<ProtectedRoute><MainLayout><DemandDetailPage /></MainLayout></ProtectedRoute>} />
                <Route path="/interviewer/assignments/:assignmentId/feedback" element={<ProtectedRoute><MainLayout><FeedbackPage /></MainLayout></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><MainLayout><UserManagementPage /></MainLayout></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;