import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientLayout from './components/patient/PatientLayout';
import PatientDashboardHome from './pages/patient/PatientDashboardHome';
import FindDoctors from './pages/patient/FindDoctors';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import HealthReport from './pages/patient/HealthReport';
import Prescriptions from './pages/patient/Prescriptions';
import PatientReviews from './pages/patient/Reviews';
import PatientProfile from './pages/patient/Profile';
import PatientSettings from './pages/patient/Settings';
import AdminDashboard from './pages/AdminDashboard';
import DoctorsManagement from './pages/admin/DoctorsManagement';
import PatientsManagement from './pages/admin/PatientsManagement';
import AppointmentsManagement from './pages/admin/AppointmentsManagement';
import Reports from './pages/admin/Reports';
import Notifications from './pages/admin/Notifications';
import Feedback from './pages/admin/Feedback';
import Settings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';
import About from './pages/About';
import Services from './pages/Services';
import Reviews from './pages/Reviews';
import ForgotPassword from './pages/ForgotPassword';

function AppContent() {
  const { isLoading } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isPatientDashboard = location.pathname.startsWith('/dashboard');
  const showSiteHeader = !isAdminPath && !isPatientDashboard;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {showSiteHeader && <Header />}
      <main className={isAdminPath || isPatientDashboard ? '' : 'flex-grow'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<div className="py-24 text-center text-3xl font-bold">Contact Us Page</div>} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientDashboardHome />} />
            <Route path="find-doctors" element={<FindDoctors />} />
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="my-appointments" element={<MyAppointments />} />
            <Route path="health-report" element={<HealthReport />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="reviews" element={<PatientReviews />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="settings" element={<PatientSettings />} />
          </Route>

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
        </Routes>
      </main>
      {showSiteHeader && <Footer />}
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
