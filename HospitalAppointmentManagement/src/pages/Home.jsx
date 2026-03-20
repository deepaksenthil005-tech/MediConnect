import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Calendar, Users, Activity, LayoutDashboard, User, ClipboardList, Settings, Stethoscope } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { useAuth } from '../context/AuthContext';
import { apiService } from "../services/api";

export default function Home() {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
      return;
    }
    apiService.getDoctors().then((doctors) => {
      setFeaturedDoctors(doctors.slice(0, 3));
    });
  }, [user, navigate]);

  if (user) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Welcome back, <span className="text-emerald-600">{user.name}</span>
            </h1>
            <p className="text-gray-500">What would you like to do today?</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {user.role === 'ADMIN' ? (
              <>
                <Link to="/admin" className="bg-white p-8 rounded-md shadow-sm border-2 border-transparent hover:border-emerald-500 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="bg-emerald-100 w-14 h-14 rounded-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Hub</h3>
                  <p className="text-gray-500">Manage doctors, appointments, and hospital statistics.</p>
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Admin Only</div>
                </Link>
                <Link to="/admin/doctors" className="bg-white p-8 rounded-md shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-md transition-all group">
                  <div className="bg-blue-100 w-14 h-14 rounded-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Doctors</h3>
                  <p className="text-gray-500">View and update doctor profiles and availability.</p>
                </Link>
                <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 opacity-60 cursor-not-allowed">
                  <div className="bg-purple-100 w-14 h-14 rounded-md flex items-center justify-center mb-6">
                    <Settings className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">System Settings</h3>
                  <p className="text-gray-500">Configure platform preferences and security.</p>
                </div>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="bg-white p-8 rounded-md shadow-sm border-2 border-transparent hover:border-emerald-500 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className="bg-emerald-100 w-14 h-14 rounded-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Calendar className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">My Appointments</h3>
                  <p className="text-gray-500">View and manage your upcoming medical consultations.</p>
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">Patient Portal</div>
                </Link>
                <Link to="/dashboard/find-doctors" className="bg-white p-8 rounded-md shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-md transition-all group">
                  <div className="bg-blue-100 w-14 h-14 rounded-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Stethoscope className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Book Doctor</h3>
                  <p className="text-gray-500">Find a specialist and schedule a new appointment.</p>
                </Link>
                <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 opacity-60 cursor-not-allowed">
                  <div className="bg-orange-100 w-14 h-14 rounded-md flex items-center justify-center mb-6">
                    <ClipboardList className="h-7 w-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Medical Records</h3>
                  <p className="text-gray-500">Access your health history and prescriptions securely.</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
              <Link to="/doctors" className="text-emerald-600 font-bold hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-24">
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=2070"
            alt="Healthcare"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
              Your Health, Our Priority
            </span>
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
              Find & Book the <span className="text-emerald-600">Best Doctors</span> Near You.
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Skip the waiting room. Connect with top-rated medical professionals and manage your health journey with ease.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/doctors"
                className="bg-emerald-600 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center group"
              >
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-md font-bold text-lg hover:border-emerald-200 transition-all flex items-center justify-center">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-8 rounded-xl shadow-sm border border-gray-50">
          {[
            { label: 'Doctors', value: '500+', icon: Users },
            { label: 'Patients', value: '20k+', icon: Activity },
            { label: 'Experience', value: '15yrs', icon: ShieldCheck },
            { label: 'Appointments', value: '50k+', icon: Calendar },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="bg-emerald-50 w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Our Top Specialists</h2>
            <p className="text-gray-500 max-w-xl">Meet our highly qualified and experienced medical professionals dedicated to providing exceptional care.</p>
          </div>
          <Link to="/doctors" className="text-emerald-600 font-bold flex items-center hover:underline">
            View All Doctors <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </section>

      <section className="bg-emerald-600 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">Ready to take control of your health?</h2>
          <p className="text-emerald-50 text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of patients who trust HealthCare for their healthcare needs. Simple, fast, and secure.
          </p>
          <Link to="/register" className="bg-white text-emerald-600 px-10 py-4 rounded-md font-bold text-lg hover:bg-emerald-50 transition-all shadow-md inline-block">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
