// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts & Guards
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import SearchResultsPage from '../pages/SearchResultsPage'; // 1. Import

// Pages
import LoginPage from '../pages/LoginPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import HomePage from '../pages/HomePage';
import HMDashboardPage from '../pages/HMDashboardPage'; // The new dashboard
import DemandListPage from '../pages/DemandListPage';   // The old dashboard, renamed
import DemandDetailPage from '../pages/DemandDetailPage';
import InterviewerDashboardPage from '../pages/InterviewerDashboardPage';
import FeedbackPage from '../pages/FeedbackPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import SquadManagementPage from '../pages/admin/SquadManagementPage';
import SquadDetailPage from '../pages/admin/SquadDetailPage';
import TalentPoolPage from '../pages/TalentPoolPage'; 
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

                {/* HM Routes */}
                <Route path="/hm/dashboard" element={<ProtectedRoute><MainLayout><HMDashboardPage /></MainLayout></ProtectedRoute>} />
                <Route path="/hm/demands" element={<ProtectedRoute><MainLayout><DemandListPage /></MainLayout></ProtectedRoute>} />
                <Route path="/hm/demands/:demandId" element={<ProtectedRoute><MainLayout><DemandDetailPage /></MainLayout></ProtectedRoute>} />
                
                {/* Interviewer Routes */}
                <Route path="/interviewer/assignments" element={<ProtectedRoute><MainLayout><InterviewerDashboardPage /></MainLayout></ProtectedRoute>} />
                <Route path="/interviewer/assignments/:assignmentId/feedback" element={<ProtectedRoute><MainLayout><FeedbackPage /></MainLayout></ProtectedRoute>} />

                {/* Admin (HM Only) Routes */}
                <Route path="/admin/users" element={<ProtectedRoute><MainLayout><UserManagementPage /></MainLayout></ProtectedRoute>} />
                <Route path="/admin/squads" element={<ProtectedRoute><MainLayout><SquadManagementPage /></MainLayout></ProtectedRoute>} />
                <Route path="/admin/squads/:squadId" element={<ProtectedRoute><MainLayout><SquadDetailPage /></MainLayout></ProtectedRoute>} />
                <Route path="/talent-pool" element={<ProtectedRoute><MainLayout><TalentPoolPage /></MainLayout></ProtectedRoute>} />
                <Route path="/search/results" element={<ProtectedRoute><MainLayout><SearchResultsPage /></MainLayout></ProtectedRoute>} />
                
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;