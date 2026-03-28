import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Bell, Info, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiService.getNotifications();
      // Only keep the required notification types for patient
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "SUCCESS": return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
      case "WARNING": return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "ERROR": return <AlertTriangle className="h-6 w-6 text-rose-500" />;
      default: return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getStyleForType = (type) => {
    switch (type) {
      case "SUCCESS": return "bg-emerald-50 border-emerald-100";
      case "WARNING": return "bg-amber-50 border-amber-100";
      case "ERROR": return "bg-rose-50 border-rose-100";
      default: return "bg-blue-50 border-blue-100";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-black text-xs uppercase tracking-widest">Loading Notifications</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notification Center</h1>
        <p className="text-slate-500 font-medium mt-2">View all alerts, appointment updates, and system broadcasts.</p>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
            <Bell className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-slate-500 font-bold">You have no new notifications.</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={notif._id || index}
              className={`p-6 rounded-[2rem] border flex gap-6 items-start transition-all duration-300 hover:shadow-lg ${getStyleForType(notif.type)} bg-white`}
            >
               <div className={`p-4 rounded-2xl shrink-0 ${getStyleForType(notif.type)} bg-opacity-50`}>
                 {getIconForType(notif.type)}
               </div>
               
               <div className="flex-1 mt-1">
                 <div className="flex items-center justify-between gap-4">
                   <h3 className="text-lg font-black text-slate-900">{notif.title}</h3>
                   <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 whitespace-nowrap">
                     <Calendar className="w-3 h-3" />
                     {new Date(notif.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                   </span>
                 </div>
                 
                 <p className="text-slate-600 font-medium text-sm leading-relaxed mt-2 pr-4">{notif.message}</p>
                 
                 {notif.category && (
                    <span className="inline-block mt-4 px-3 py-1 bg-white border border-slate-100 text-[9px] font-black uppercase tracking-widest rounded-md text-slate-500 shadow-sm">
                      Target: {notif.target} • {notif.category} Message
                    </span>
                 )}
               </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
