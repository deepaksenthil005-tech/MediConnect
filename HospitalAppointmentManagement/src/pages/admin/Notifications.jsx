import React, { useEffect, useState } from 'react';
import { Bell, Send, Search, Filter, Trash2, CheckCircle2, Info, AlertTriangle, X, Calendar, User, ArrowRight } from 'lucide-react';
import { localDb } from '../../services/localDb';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL, SYSTEM, APPOINTMENTS
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'INFO',
    target: 'ALL'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [notifs, apts] = await Promise.all([
      localDb.getNotifications(),
      localDb.getAppointments()
    ]);
    
    // Transform appointments into notification-like items
    const aptNotifs = apts
      .filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED')
      .map(a => ({
        id: `apt-${a.id}`,
        title: a.status === 'PENDING' ? 'New Appointment Request' : 'Appointment Confirmed',
        message: `Patient ${a.patient_name} has a ${a.status.toLowerCase()} session with Dr. ${a.doctor_name} on ${a.date} at ${a.time}.`,
        type: a.status === 'PENDING' ? 'WARNING' : 'SUCCESS',
        category: 'APPOINTMENT',
        created_at: a.created_at || new Date().toISOString(),
        target: 'ADMIN'
      }));

    const systemNotifs = notifs.map(n => ({ ...n, category: 'SYSTEM' }));
    
    const combined = [...aptNotifs, ...systemNotifs].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    setNotifications(combined);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await localDb.sendNotification({
      ...formData,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });
    setIsModalOpen(false);
    setFormData({ title: '', message: '', type: 'INFO', target: 'ALL' });
    fetchData();
  };

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'ALL') return true;
    if (filter === 'SYSTEM') return n.category === 'SYSTEM';
    if (filter === 'APPOINTMENTS') return n.category === 'APPOINTMENT';
    return true;
  });

  const getTypeStyles = (type) => {
    switch (type) {
      case 'SUCCESS': return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'WARNING': return { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'ERROR': return { icon: X, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' };
      default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-slate-500 text-lg mt-2 font-medium">Monitor system activities and patient requests in real-time.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] font-black transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest"
        >
          <Send className="h-5 w-5" />
          <span>Broadcast Message</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-100/50 rounded-2xl w-fit">
        {['ALL', 'SYSTEM', 'APPOINTMENTS'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing Feed</p>
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
            <Bell className="h-12 w-12 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No notifications found for this category.</p>
          </div>
        ) : (
          filteredNotifs.map((notif, index) => {
            const styles = getTypeStyles(notif.type);
            const Icon = styles.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex items-center gap-6"
              >
                <div className={`w-16 h-16 rounded-2xl ${styles.bg} ${styles.color} flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0`}>
                   <Icon className="h-8 w-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight truncate">{notif.title}</h3>
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-md">
                       {notif.category}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed truncate max-w-2xl">{notif.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase">
                       <Calendar className="h-3 w-3" />
                       {new Date(notif.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <div className="text-[10px] font-black text-slate-300 uppercase">
                       To: {notif.target || 'ALL'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {notif.category === 'APPOINTMENT' && (
                      <button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                        <ArrowRight className="h-5 w-5" />
                      </button>
                   )}
                   <button className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                     <Trash2 className="h-5 w-5" />
                   </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white">
              <div className="p-10 pb-6 border-b border-slate-50 flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Broadcast Feed</h2>
                  <p className="text-slate-500 font-medium mt-1">Send a priority message to the user database.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all text-slate-300">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-3 gap-3">
                  {['ALL', 'PATIENTS', 'DOCTORS'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, target: t })}
                      className={`py-3 text-[10px] font-black tracking-widest uppercase rounded-2xl border-2 transition-all ${
                        formData.target === t ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Intent</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['INFO', 'SUCCESS', 'WARNING', 'ERROR'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: t })}
                          className={`py-2 text-[8px] font-black tracking-widest uppercase rounded-xl border transition-all ${
                            formData.type === t ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Headline</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                      placeholder="e.g. Health Drive 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-900 placeholder:text-slate-300 resize-none"
                      placeholder="Type the broadcast body..."
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 bg-slate-50 hover:bg-slate-100 text-slate-500 font-black rounded-[1.75rem] transition-all uppercase tracking-widest text-xs">
                    Dismiss
                  </button>
                  <button type="submit" className="flex-1 px-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-[1.75rem] transition-all shadow-xl shadow-emerald-200 uppercase tracking-widest text-xs">
                    Publish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
