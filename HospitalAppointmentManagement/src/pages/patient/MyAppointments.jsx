import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from "../../services/api";
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, X, CheckCircle, AlertCircle, Clock3, RotateCcw, Trash2 } from 'lucide-react';

const STATUS_CLASS = { PENDING: 'pending', CONFIRMED: 'confirmed', COMPLETED: 'completed', CANCELLED: 'cancelled' };

export default function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleFor, setRescheduleFor] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    if (user) {
      apiService.getAppointments(user.id, user.role).then((data) => {
        setAppointments(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    await apiService.updateAppointmentStatus(id, 'CANCELLED');
    setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status: 'CANCELLED' } : a)));
  };
  const openReschedule = (apt) => {
    setRescheduleFor(apt);
    setNewDate(apt.date);
    setNewTime(apt.time);
  };

  const handleRescheduleSave = async () => {
    if (!rescheduleFor || !newDate || !newTime) return;
    await apiService.updateAppointment(rescheduleFor._id, { date: newDate, time: newTime, status: 'PENDING' });
    setAppointments((prev) =>
      prev.map((a) =>
        a._id === rescheduleFor._id ? { ...a, date: newDate, time: newTime, status: 'PENDING' } : a
      )
    );
    setRescheduleFor(null);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Appointments</h1>
            <p className="text-slate-400 font-medium mt-1">Manage and track your healthcare visits.</p>
          </div>
          <div className="flex items-center p-0">
            <span className="badge-premium bg-slate-100 text-slate-600 border-slate-200 rounded p-1 m-0 w-15 p-md-2">
              {appointments.length} Total
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-slate-100 rounded-md animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="premium-card text-center py-20">
            <Calendar className="mx-auto h-12 w-12 text-slate-200 mb-4" />
            <h3 className="text-lg font-black text-slate-900 mb-2">No appointments yet</h3>
            <p className="text-slate-400 font-medium mb-8">Book your first consultation to get started.</p>
            <button
              onClick={() => navigate('/dashboard/book-appointment')}
              className="btn-premium py-3 px-8"
            >
              Book Appointment Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {appointments.map((apt) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={apt.id}
                  className="premium-card flex flex-col group hover:shadow-md transition-all duration-500 p-4"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      <div className="w-14 h-12 md:h-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor_name)}&background=random`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 leading-tight">{apt.doctor_name}</h4>
                        <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-0.5">{apt.specialization}</p>
                      </div>
                    </div>
                    <div className={`p-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 
                    ${apt.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        apt.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          apt.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                      {apt.status === 'CONFIRMED' ? <CheckCircle size={10} /> :
                        apt.status === 'PENDING' ? <Clock3 size={10} /> :
                          apt.status === 'CANCELLED' ? <Trash2 size={10} /> : <AlertCircle size={10} />}
                      {apt.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-2 rounded-md bg-slate-50 border border-slate-100 mb-6 transition-colors group-hover:bg-white group-hover:border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Calendar size={14} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                        <p className="text-xs font-black text-slate-900">{apt.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md shadow-sm">
                        <Clock size={14} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time</p>
                        <p className="text-xs font-black text-slate-900">{apt.time}</p>
                      </div>
                    </div>
                  </div>

                  {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                    <div className="pt-1 border-t border-slate-50 flex gap-3">
                      <button
                        onClick={() => openReschedule(apt)}
                        className="btn-premium-outline flex-1 py-3 text-[10px] gap-2"
                      >
                        <RotateCcw size={14} /> Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="flex-1 py-3 px-4 rounded-md border border-rose-100 bg-rose-50 text-rose-600 font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} /> Cancel
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <AnimatePresence>
        {rescheduleFor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRescheduleFor(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-md overflow-hidden shadow-xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Reschedule</h2>
                  <button
                    onClick={() => setRescheduleFor(null)}
                    className="p-2 bg-slate-100 rounded-md hover:bg-rose-50 hover:text-rose-600 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-8 p-4 rounded-md bg-slate-50 border border-slate-100">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Doctor</p>
                  <p className="text-sm font-black text-slate-900">{rescheduleFor.doctor_name}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New Date</label>
                    <input
                      type="date"
                      className="premium-input"
                      value={newDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New Time</label>
                    <input
                      type="time"
                      className="premium-input"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button
                    onClick={() => setRescheduleFor(null)}
                    className="btn-premium-outline flex-1 py-4"
                  >
                    Keep Existing
                  </button>
                  <button
                    onClick={handleRescheduleSave}
                    className="btn-premium flex-1 py-4 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Confirm Change
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
