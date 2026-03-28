import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from "../../services/api";
import { Calendar, CalendarCheck, CheckCircle, XCircle, TrendingUp, FileText, ArrowRight, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ReportViewerModal from '../../components/ReportViewerModal';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

export default function PatientDashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [healthReport, setHealthReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingRecord, setViewingRecord] = useState(null);

  useEffect(() => {
    if (user) {
      Promise.all([
        apiService.getAppointments(user.id, user.role),
        apiService.getHealthReport(user.id)
      ]).then(([aptData, reportData]) => {
        setAppointments(aptData);
        setHealthReport(reportData);
        setLoading(false);
      });
    }
  }, [user]);

  const upcoming = useMemo(() => {
    return appointments
      .filter((a) => (a.status === 'PENDING' || a.status === 'CONFIRMED') && new Date(a.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [appointments]);

  const nextAppointment = upcoming[0];
  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;

  /* Chart data: last 7 days appointment count (from appointments) */
  const appointmentsPerDay = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = appointments.filter((a) => a.date === dateStr).length;
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
        fullDate: dateStr,
      });
    }
    return days;
  }, [appointments]);

  /* Monthly trend (last 6 months) */
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
      const count = appointments.filter((a) => {
        const ad = new Date(a.date);
        return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth();
      }).length;
      months.push({ name: monthStr, count });
    }
    return months;
  }, [appointments]);

  const overviewCards = [
    { label: 'Upcoming Appointment', value: upcoming.length, icon: Calendar, color: 'blue', trend: '+12%', trendUp: true },
    { label: 'Total Appointments', value: total, icon: CalendarCheck, color: 'green', trend: '+5%', trendUp: true },
    { label: 'Completed Appointments', value: completed, icon: CheckCircle, color: 'orange', trend: '+24%', trendUp: true },
    { label: 'Cancelled Appointments', value: cancelled, icon: XCircle, color: 'red', trend: '+1%', trendUp: false },
  ];

  if (loading) {
    return (
      <div className="pd-card text-center py-5">
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Dashboard Overview</h2>
          <p className="text-slate-500 text-lg mt-3 font-medium">Welcome back, {user?.name?.split(' ')[0]}. Here's a snapshot of your clinical history.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="p-1 px-4 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              Live Health Status
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewCards.map((card, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={card.label} 
            className="premium-card !p-6 flex items-start gap-4 hover:!shadow-md transition-all duration-500"
          >
            <div className={`p-3 rounded-md ${
              card.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
              card.color === 'green' ? 'bg-emerald-50 text-emerald-600' : 
              card.color === 'orange' ? 'bg-amber-50 text-amber-600' : 
              'bg-rose-50 text-rose-600'
            }`}>
              <card.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 leading-tight">{card.value}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{card.label}</div>
              <div className={`mt-2 flex items-center gap-1 text-[10px] font-black ${card.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {card.trendUp ? <TrendingUp size={10} /> : <XCircle size={10} />}
                {card.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {nextAppointment && (
        <div className="premium-card !p-5 border-l-4 border-l-emerald-500 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 justify-content-evenly">
              <div className="w-15 h-15 md:w-20 md:h-20 rounded-md overflow-hidden border-4 border-white shadow-md">
                <img
                  src={'https://ui-avatars.com/api/?name=' + encodeURIComponent(nextAppointment.doctor_name || 'Dr') + '&background=10b981&color=fff'}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="badge-premium bg-emerald-50 text-emerald-600 border-emerald-100 mb-2">Upcoming Consultation</p>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{nextAppointment.doctor_name}</h3>
                <p className="text-slate-500 font-bold text-sm">{nextAppointment.specialization}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className=" rounded-md bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                  <p className="text-sm font-black text-slate-900">{nextAppointment.date} at {nextAppointment.time}</p>
               </div>
               <button 
                 onClick={() => navigate('/dashboard/my-appointments')}
                 className="btn-premium p-4"
               >
                 View All Details
               </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="premium-card p-3">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Weekly Activity</h3>
              <p className="text-xs font-medium text-slate-400">Number of appointments per day</p>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-md">
              <TrendingUp size={18} className="text-emerald-500" />
            </div>
          </div>
          <div style={{ height: 280, width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={280} minWidth={1}>
              <LineChart data={appointmentsPerDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '900', color: '#10b981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-card p-3">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900">Monthly Performance</h3>
              <p className="text-xs font-medium text-slate-400">Appointments count by month</p>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-md">
              <Calendar size={18} className="text-blue-500" />
            </div>
          </div>
          <div style={{ height: 280, width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={280} minWidth={1}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '12px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 premium-card p-3">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Medical Reports</h3>
            <Link to="/dashboard/health-report" className="text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthReport?.medicalRecords?.length > 0 ? (
              healthReport.medicalRecords.slice(-4).reverse().map((record, index) => (
                <div key={record._id || index} className="p-4 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 truncate max-w-[120px]">{record.name}</p>
                      <p className="text-[9px] font-bold text-slate-400">{record.date}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewingRecord(record)}
                    className="p-2 text-slate-300 hover:text-emerald-600 transition-colors"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-2 py-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No reports found.</p>
            )}
          </div>
        </div>

        <div className="premium-card p-3 bg-emerald-600 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Track Your Vitals</h3>
            <p className="text-emerald-50 text-xs font-medium mb-6 opacity-80 leading-relaxed">Regular checkups help in maintaining a detailed health history for better diagnosis.</p>
            <button 
              onClick={() => navigate('/dashboard/health-report')}
              className="px-6 py-3 bg-white text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-emerald-50 transition-all active:scale-95"
            >
              Analyze Metrics
            </button>
          </div>
          <Heart size={120} className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      <div className="premium-card !p-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-slate-900">Need to book an appointment?</h3>
            <p className="text-slate-500 font-medium text-sm mt-1">Search through our list of expert doctors across various specialties.</p>
          </div>
          <Link 
            to="/dashboard/find-doctors" 
            className="btn-premium px-10 py-4 shadow-xl shadow-emerald-500/10"
          >
            Find Doctor Now
          </Link>
        </div>
      </div>
      {viewingRecord && healthReport && (
        <ReportViewerModal
          record={viewingRecord}
          healthData={healthReport}
          patientId={user?.id}
          patientName={user?.name}
          onClose={() => setViewingRecord(null)}
        />
      )}
    </>
  );
}
