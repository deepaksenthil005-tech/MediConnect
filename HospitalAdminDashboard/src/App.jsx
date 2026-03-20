import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import DoctorsManagement from './pages/admin/DoctorsManagement';
import PatientsManagement from './pages/admin/PatientsManagement';
import AppointmentsManagement from './pages/admin/AppointmentsManagement';
import Reports from './pages/admin/Reports';
import Notifications from './pages/admin/Notifications';
import Feedback from './pages/admin/Feedback';
import Settings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';

function AppContent() {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="doctors" element={<DoctorsManagement />} />
                  <Route path="patients" element={<PatientsManagement />} />
                  <Route path="appointments" element={<AppointmentsManagement />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
