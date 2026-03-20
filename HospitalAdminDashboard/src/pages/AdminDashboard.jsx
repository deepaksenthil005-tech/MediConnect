import { apiService } from '../services/api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserRound,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    apiService.getAdminStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Doctors', value: stats.totalDoctors, icon: UserRound, color: 'bg-blue-500', trend: '+12%', trendUp: true },
    { title: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'bg-purple-500', trend: '+5%', trendUp: true },
    { title: "Today's Appointments", value: stats.todayAppointments, icon: CalendarCheck, color: 'bg-emerald-500', trend: '+18%', trendUp: true },
    { title: 'Pending Appointments', value: stats.pendingAppointments, icon: Clock, color: 'bg-amber-500', trend: '-2%', trendUp: false },
    { title: 'Completed Appointments', value: stats.completedAppointments, icon: CheckCircle2, color: 'bg-indigo-500', trend: '+24%', trendUp: true },
    { title: 'Cancelled Appointments', value: stats.cancelledAppointments, icon: XCircle, color: 'bg-rose-500', trend: '+1%', trendUp: false },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Snapshot of today's clinical operations.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/admin/appointments')}
            className="px-6 py-3 bg-slate-900 text-white font-black rounded-md hover:bg-emerald-600 transition-all text-xs uppercase tracking-widest shadow-sm"
          >
            Manage Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-4 rounded-md border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`p-3 w-fit rounded-md ${card.color} text-white mb-4`}>
              <card.icon size={20} />
            </div>
            <div className="text-2xl font-black text-slate-900">{card.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{card.title}</div>
            <div className={`mt-2 flex items-center gap-1 text-[10px] font-black ${card.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
              {card.trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {card.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Appointments History" subtitle="Daily Trend" icon={<TrendingUp className="h-5 w-5 text-emerald-600" />} iconBg="bg-emerald-50">
          <div className="w-full h-[250px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.appointmentsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                  <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <ChartCard title="Monthly Performance" subtitle="Appointment Volume" icon={<BarChart3 className="h-5 w-5 text-blue-600" />} iconBg="bg-blue-50">
          <div className="w-full h-[250px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '6px', border: 'none' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartCard title="Specialization" subtitle="Distribution" className="lg:col-span-1">
          <div className="w-full h-[250px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.doctorWiseAppointments} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="doctor">
                    {stats.doctorWiseAppointments.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} cornerRadius={4} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '6px', border: 'none' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </ChartCard>

        <div className="lg:col-span-2 bg-white rounded-md border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
            <button onClick={() => navigate('/admin/appointments')} className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {stats.recentAppointments?.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between py-4 px-2 mb-3 rounded-md bg-slate-50 border border-slate-100/50 hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                    {apt.patient_name?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{apt.patient_name}</p>
                    <p className="text-[10px] font-bold text-slate-400">Dr. {apt.doctor_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {apt.status}
                  </span>
                  <p className="text-[10px] font-black text-slate-900 mt-1">{apt.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon, iconBg, children, className = "" }) {
  return (
    <div className={`bg-white p-6 rounded-md border border-slate-100 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
          <p className="text-xs font-medium text-slate-400">{subtitle}</p>
        </div>
        {icon && <div className={`p-2.5 ${iconBg} rounded-md`}>{icon}</div>}
      </div>
      <div className="h-64 min-w-0" style={{ minHeight: '250px' }}>{children}</div>
    </div>
  );
}
